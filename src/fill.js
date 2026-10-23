// Writes answers onto the ASIS-7x PDF. Works in the browser (pass window.PDFLib)
// and in Node (pass the pdf-lib module) so the same code is used by the tests.
import {
  BOXES, TEXT, WHITEOUT, INITIALS, QUESTIONS, riderBox, computedBalance, num, isVisible,
} from './fields.js';

const PAGE_H = 792;
const BOX = 8.1;
const MAX_SIZE = 9;
const MIN_SIZE = 6;

export const fmtMoney = (v) =>
  String(v ?? '').trim() === '' ? '' : num(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function fmtDate(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '');
  return m ? `${m[2]}/${m[3]}/${m[1]}` : v || '';
}

function formatValue(q, a) {
  const v = a[q.id];
  if (q.type === 'money') return fmtMoney(v);
  if (q.type === 'date') return fmtDate(v);
  return String(v ?? '').trim();
}

// Turns answers into { text: {id: string}, checks: [[page, x, top]] }.
export function resolve(a) {
  const text = {};
  const checks = [];
  const check = (key) => checks.push(BOXES[key]);

  for (const q of QUESTIONS) {
    if (TEXT[q.id] && isVisible(q, a)) text[q.id] = formatValue(q, a);
  }
  if (a.balance === undefined || a.balance === '') {
    const bal = computedBalance(a);
    text.balance = num(a.price) ? fmtMoney(bal) : '';
  }
  if (a.loanAmount && /^\s*[\d,.$]+\s*$/.test(a.loanAmount) && a.financing?.includes('8b')) {
    text.loanAmount = '$' + fmtMoney(a.loanAmount);
  }

  if (a.depositTiming === 'accompanies') check('depositAccompanies');
  if (a.depositTiming === 'within') check('depositWithinDays');
  if (a.leaseAfterClosing === 'yes') check('leaseAfterClosing');
  const as = { release: 'assignRelease', norelease: 'assignNoRelease', not: 'assignNot' }[a.assign];
  if (as) check(as);

  const fin = a.financing || [];
  for (const k of ['8a', '8b', '8c', '8d']) if (fin.includes(k)) check('fin' + k);
  if (fin.includes('8b')) {
    const lt = { conventional: 'loanConventional', FHA: 'loanFHA', VA: 'loanVA', other: 'loanOther' }[a.loanType];
    if (lt) check(lt);
    const rt = { fixed: 'rateFixed', adjustable: 'rateAdjustable', either: 'rateEither' }[a.rateType];
    if (rt) check(rt);
  }

  if (a.title) check('title_' + a.title);
  const w = { buyer: 'warrantyBuyer', seller: 'warrantySeller', na: 'warrantyNA' }[a.warranty];
  if (w) check(w);
  if (a.assess) check('assess_' + a.assess);
  if (a.counterOffer === 'yes') check('counterOffer');

  for (const r of a.riders || []) checks.push(riderBox(r));
  if (String(a.riderOther ?? '').trim()) checks.push(riderBox('OTHER'));

  return { text, checks };
}

// Greedy word wrap of `str` into the given slots. Returns per-slot lines,
// the font size used, and whether everything fit.
export function layout(font, str, slots) {
  for (let size = MAX_SIZE; size >= MIN_SIZE; size -= 0.5) {
    const out = slots.map(() => '');
    let i = 0;
    let fits = true;
    const paragraphs = str.split(/\r?\n/);
    for (let p = 0; p < paragraphs.length && fits; p++) {
      if (p > 0) {
        if (out[i] !== '') i++;
        if (i >= slots.length) { fits = false; break; }
      }
      for (const word of paragraphs[p].split(/\s+/).filter(Boolean)) {
        while (true) {
          if (i >= slots.length) { fits = false; break; }
          const trial = out[i] ? out[i] + ' ' + word : word;
          if (font.widthOfTextAtSize(trial, size) <= slots[i][2]) { out[i] = trial; break; }
          if (out[i] === '') { fits = false; break; } // single word too wide
          i++;
        }
        if (!fits) break;
      }
    }
    if (fits) return { lines: out, size, fits: true };
  }
  // Fall back to smallest size, hard-truncating what does not fit.
  const out = slots.map(() => '');
  let rest = str.replace(/\s+/g, ' ').trim();
  slots.forEach((s, i) => {
    let line = '';
    for (const ch of rest) {
      if (font.widthOfTextAtSize(line + ch, MIN_SIZE) > s[2]) break;
      line += ch;
    }
    out[i] = line;
    rest = rest.slice(line.length).trim();
  });
  return { lines: out, size: MIN_SIZE, fits: false };
}

function sanitize(font, s) {
  const ok = new Set(font.getCharacterSet());
  return [...s.replace(/\r\n?/g, '\n').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-')]
    .map((c) => (c === '\n' || ok.has(c.codePointAt(0)) ? c : '?')).join('');
}

export async function fillContract(PDFLib, templateBytes, answers) {
  const { PDFDocument, StandardFonts, rgb } = PDFLib;
  const doc = await PDFDocument.load(templateBytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const ink = rgb(0, 0, 0);
  const warnings = [];

  for (const rects of Object.values(WHITEOUT)) {
    for (const [p, x, top, w, h] of rects) {
      pages[p - 1].drawRectangle({ x, y: PAGE_H - top - h, width: w, height: h, color: rgb(1, 1, 1) });
    }
  }

  const { text, checks } = resolve(answers);

  for (const [id, raw] of Object.entries(text)) {
    if (!raw) continue;
    const slots = TEXT[id];
    const { lines, size, fits } = layout(font, sanitize(font, raw), slots);
    if (!fits) warnings.push(id);
    lines.forEach((line, i) => {
      if (!line) return;
      const [p, x, , baseline] = slots[i];
      pages[p - 1].drawText(line, { x, y: PAGE_H - baseline, size, font, color: ink });
    });
  }

  for (const [p, x, top] of checks) {
    const page = pages[p - 1];
    const x0 = x + 1.6, x1 = x + BOX - 1.6;
    const y0 = PAGE_H - top - BOX + 1.6, y1 = PAGE_H - top - 1.6;
    page.drawLine({ start: { x: x0, y: y0 }, end: { x: x1, y: y1 }, thickness: 1.2, color: ink });
    page.drawLine({ start: { x: x0, y: y1 }, end: { x: x1, y: y0 }, thickness: 1.2, color: ink });
  }

  if (answers.printInitials === 'yes') {
    for (let p = 0; p < INITIALS.pages; p++) {
      for (const key of ['buyerInitials1', 'buyerInitials2', 'sellerInitials1', 'sellerInitials2']) {
        const v = sanitize(font, String(answers[key] ?? '').trim());
        if (!v) continue;
        const [x, w] = INITIALS[key];
        const tw = font.widthOfTextAtSize(v, MAX_SIZE);
        pages[p].drawText(v, { x: x + Math.max(0, (w - tw) / 2), y: PAGE_H - INITIALS.baseline, size: MAX_SIZE, font, color: ink });
      }
    }
  }

  return { bytes: await doc.save(), warnings };
}
