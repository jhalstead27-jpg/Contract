import { QUESTIONS, SECTIONS, TEMPLATE_URL, isVisible, computedBalance, num } from './fields.js';
import { fillContract, fmtMoney, fmtDate } from './fill.js';

const STORE = 'asis-7x-answers';
const $ = (id) => document.getElementById(id);

let answers = load();
let current = 0; // index into QUESTIONS
let pdfUrl = null;

function load() {
  try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; }
}
function save() {
  try { localStorage.setItem(STORE, JSON.stringify(answers)); } catch { /* private mode */ }
  renderReview();
}

const visible = () => QUESTIONS.filter((q) => isVisible(q, answers));
const isAnswered = (q) => {
  const v = answers[q.id];
  return Array.isArray(v) ? true : v !== undefined && v !== '';
};

// ---------------------------------------------------------------- popup ---
const dlg = $('qDialog');

function open(index = firstUnanswered()) {
  current = Math.max(0, Math.min(index, QUESTIONS.length - 1));
  if (!isVisible(QUESTIONS[current], answers)) current = step(current, 1) ?? current;
  showQuestion();
  if (!dlg.open) dlg.showModal();
}

function firstUnanswered() {
  const i = QUESTIONS.findIndex((q) => isVisible(q, answers) && !(q.id in answers));
  return i < 0 ? 0 : i;
}

// Next/previous visible question index, or null at either end.
function step(from, dir) {
  for (let i = from + dir; i >= 0 && i < QUESTIONS.length; i += dir) {
    if (isVisible(QUESTIONS[i], answers)) return i;
  }
  return null;
}

function showQuestion() {
  const q = QUESTIONS[current];
  const vis = visible();
  const pos = vis.indexOf(q) + 1;
  $('qSection').textContent = q.section;
  $('qCount').textContent = `${pos} of ${vis.length}`;
  $('qBar').style.width = `${(100 * pos) / vis.length}%`;
  $('qRef').textContent = q.ref ? `Contract ${q.ref}` : '';
  $('qLabel').textContent = q.label + (q.required ? ' *' : '');
  $('qHelp').textContent = q.help || '';
  $('qBlank').textContent = q.blank ? `Form default: ${q.blank}` : '';
  $('qError').hidden = true;
  $('backBtn').disabled = step(current, -1) === null;
  $('skipBtn').hidden = !!q.required;
  $('nextBtn').textContent = step(current, 1) === null ? 'Finish' : 'Next';

  let value = answers[q.id];
  if (value === undefined && q.default !== undefined) value = q.default;
  if (value === undefined && q.suggest) value = q.suggest(answers);
  $('qBody').replaceChildren(renderInput(q, value));
  const first = $('qBody').querySelector('input, textarea');
  if (first) setTimeout(() => first.focus(), 30);
}

function renderInput(q, value) {
  const wrap = document.createElement('div');
  if (q.type === 'choice' || q.type === 'multi') {
    wrap.className = 'opts';
    const multi = q.type === 'multi';
    const selected = multi ? new Set(value || []) : new Set([value]);
    for (const [val, text] of q.options) {
      const label = document.createElement('label');
      label.className = 'opt';
      const input = document.createElement('input');
      input.type = multi ? 'checkbox' : 'radio';
      input.name = 'q';
      input.value = val;
      input.checked = selected.has(val);
      if (multi && q.exclusive) {
        input.addEventListener('change', () => {
          if (!input.checked) return;
          for (const other of wrap.querySelectorAll('input')) {
            if (other !== input && (val === q.exclusive || other.value === q.exclusive)) other.checked = false;
          }
        });
      }
      if (!multi) input.addEventListener('dblclick', () => $('qForm').requestSubmit());
      label.append(input, document.createTextNode(text));
      wrap.append(label);
    }
    return wrap;
  }

  let input;
  if (q.type === 'textarea') {
    input = document.createElement('textarea');
    input.rows = q.rows || 3;
  } else {
    input = document.createElement('input');
    input.type = { number: 'number', date: 'date' }[q.type] || 'text';
    if (q.step) input.step = q.step;
    if (q.type === 'number') input.min = '0';
    if (q.type === 'money') {
      input.inputMode = 'decimal';
      input.addEventListener('blur', () => { if (input.value.trim()) input.value = fmtMoney(input.value); });
    }
  }
  input.id = 'qInput';
  input.placeholder = q.placeholder || '';
  if (q.computed) {
    const auto = computedBalance(answers);
    input.value = value === undefined || value === '' ? fmtMoney(auto) : fmtMoney(value);
    input.dataset.auto = fmtMoney(auto);
  } else {
    input.value = q.type === 'money' && value ? fmtMoney(value) : value ?? '';
  }

  if (q.type !== 'money') { wrap.append(input); } else {
    wrap.className = 'money';
    const sign = document.createElement('span');
    sign.textContent = '$';
    wrap.append(sign, input);
  }
  if (q.computed) {
    const box = document.createElement('div');
    const note = document.createElement('p');
    note.className = 'calc muted';
    note.textContent = `Calculated: $${input.dataset.auto}. `;
    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'linkish';
    reset.textContent = 'Use calculated value';
    reset.onclick = () => { input.value = input.dataset.auto; };
    note.append(reset);
    if (computedBalance(answers) < 0) note.textContent += ' Warning: deposits + loan exceed the price.';
    box.append(wrap, note);
    return box;
  }
  return wrap;
}

function readInput(q) {
  if (q.type === 'choice') return $('qBody').querySelector('input:checked')?.value ?? '';
  if (q.type === 'multi') return [...$('qBody').querySelectorAll('input:checked')].map((i) => i.value);
  const el = $('qInput');
  let v = el.value.trim();
  if (q.type === 'money' && v) v = String(num(v));
  if (q.computed && fmtMoney(v) === el.dataset.auto) v = ''; // keep it auto-calculated
  return q.type === 'textarea' ? el.value.replace(/\s+$/, '') : v;
}

function validate(q, v) {
  const empty = Array.isArray(v) ? v.length === 0 : v === '';
  if (q.required && empty) return 'This one is required.';
  if (q.type === 'money' && v !== '' && !(num(v) >= 0)) return 'Enter a dollar amount.';
  if (q.id === 'loanAmount' && v && !/^\$?[\d,]*\.?\d*\s*%?$/.test(v)) return 'Enter a dollar amount (e.g. 320000) or a percentage (e.g. 80%).';
  if (q.id === 'closingDate' && v && answers.acceptanceDate && v < answers.acceptanceDate) return 'Closing Date is before the offer acceptance deadline.';
  return '';
}

function next(skip = false) {
  const q = QUESTIONS[current];
  const v = skip ? (q.type === 'multi' ? [] : '') : readInput(q);
  const err = skip ? '' : validate(q, v);
  if (err) {
    $('qError').textContent = err;
    $('qError').hidden = false;
    return;
  }
  answers[q.id] = v;
  save();
  const n = step(current, 1);
  if (n === null) { dlg.close(); generate(); return; }
  current = n;
  showQuestion();
}

$('qForm').addEventListener('submit', (e) => { e.preventDefault(); next(); });
$('skipBtn').onclick = () => next(true);
$('backBtn').onclick = () => {
  const p = step(current, -1);
  if (p !== null) { current = p; showQuestion(); }
};
$('closeBtn').onclick = () => dlg.close();
dlg.addEventListener('close', renderReview);

// --------------------------------------------------------------- review ---
function display(q) {
  const v = answers[q.id];
  if (q.computed && (v === undefined || v === '')) return answers.price ? `$${fmtMoney(computedBalance(answers))} (calculated)` : '';
  if (v === undefined || v === '' || (Array.isArray(v) && !v.length)) return '';
  if (q.options) {
    const map = Object.fromEntries(q.options);
    return [].concat(v).map((x) => map[x] ?? x).join('\n');
  }
  if (q.type === 'money') return `$${fmtMoney(v)}`;
  if (q.type === 'date') return fmtDate(v);
  return String(v);
}

function renderReview() {
  const root = $('review');
  root.replaceChildren();
  for (const s of SECTIONS) {
    const qs = QUESTIONS.filter((q) => q.section === s.title && isVisible(q, answers));
    if (!qs.length) continue;
    const h = document.createElement('h3');
    h.textContent = s.title;
    root.append(h);
    for (const q of qs) {
      const b = document.createElement('button');
      b.className = 'ans';
      const l = document.createElement('span');
      l.textContent = q.label;
      const v = document.createElement('span');
      const text = display(q);
      v.className = 'v' + (text ? '' : ' empty');
      v.textContent = text || (q.id in answers ? 'left blank' : 'not answered');
      b.append(l, v);
      b.onclick = () => open(QUESTIONS.indexOf(q));
      root.append(b);
    }
  }
  const vis = visible();
  const done = vis.filter((q) => q.id in answers).length;
  $('bar').style.width = `${(100 * done) / vis.length}%`;
  $('progressText').textContent = `${done} of ${vis.length} questions answered`;
  $('startBtn').textContent = done === 0 ? 'Start questions' : done < vis.length ? 'Continue questions' : 'Review questions';
}

// ------------------------------------------------------------- generate ---
async function templateBytes() {
  // The single-file build (scripts/build.mjs) embeds the template.
  if (window.ASIS_TEMPLATE_B64) return Uint8Array.from(atob(window.ASIS_TEMPLATE_B64), (c) => c.charCodeAt(0));
  try {
    const res = await fetch(TEMPLATE_URL);
    if (res.ok) return await res.arrayBuffer();
  } catch { /* opened from file:// */ }
  return new Promise((resolve) => {
    const picker = $('templatePicker');
    notice('Could not load the contract template automatically. Choose assets/asis-7x.pdf from this project folder.');
    picker.onchange = async () => resolve(await picker.files[0].arrayBuffer());
    picker.click();
  });
}

function notice(msg) {
  $('notice').textContent = msg;
  $('notice').hidden = !msg;
}

function problems() {
  const out = [];
  const missing = QUESTIONS.filter((q) => q.required && isVisible(q, answers) && !isAnswered(q));
  if (missing.length) out.push('Required items still blank: ' + missing.map((q) => q.label).join('; '));
  if (num(answers.price) && computedBalance(answers) < 0 && !answers.balance) out.push('Deposits + loan + other exceed the purchase price.');
  return out;
}

async function generate() {
  const issues = problems();
  notice(issues.join('\n'));
  try {
    const { bytes, warnings } = await fillContract(window.PDFLib, await templateBytes(), answers);
    if (warnings.length) {
      const names = warnings.map((id) => QUESTIONS.find((q) => q.id === id)?.label || id);
      issues.push('Too long to fit, text was cut off: ' + names.join('; ') + '. Shorten it or use an addendum.');
      notice(issues.join('\n'));
    }
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    pdfUrl = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    const name = (answers.street || 'contract').replace(/[^\w]+/g, '_').replace(/^_|_$/g, '');
    $('downloadLink').href = pdfUrl;
    $('downloadLink').download = `ASIS_${name}.pdf`;
    $('preview').src = pdfUrl;
    $('previewCard').hidden = false;
    $('previewCard').scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    notice('Could not build the PDF: ' + err.message);
  }
}

$('startBtn').onclick = () => open();
$('generateBtn').onclick = generate;
$('resetBtn').onclick = () => {
  if (!confirm('Clear all answers and start over?')) return;
  answers = {};
  save();
  $('previewCard').hidden = true;
  notice('');
};

renderReview();
