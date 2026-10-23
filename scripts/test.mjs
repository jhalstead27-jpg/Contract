// Sanity checks for the field map and the filler. Run with `npm test`.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as PDFLib from 'pdf-lib';
import { QUESTIONS, TEXT, BOXES, WHITEOUT, RIDERS, riderBox, computedBalance } from '../src/fields.js';
import { fillContract, resolve } from '../src/fill.js';
import { SAMPLE } from './sample.mjs';

const ids = new Set(QUESTIONS.map((q) => q.id));
for (const id of Object.keys(TEXT)) assert(ids.has(id), `TEXT.${id} has no question`);
for (const id of Object.keys(WHITEOUT)) assert(TEXT[id], `WHITEOUT.${id} has no text slot`);
assert.equal(ids.size, QUESTIONS.length, 'duplicate question ids');

// Every slot stays on the page and inside the printable width.
for (const [id, slots] of Object.entries(TEXT)) {
  for (const [p, x, w, y] of slots) {
    assert(p >= 1 && p <= 13 && x >= 54 && x + w <= 577 && y > 40 && y < 750, `bad slot ${id}`);
  }
}

// Every checkbox on the form is reachable from some answer.
const reached = new Set();
const mark = (a) => resolve(a).checks.forEach((c) => reached.add(c.join()));
mark(SAMPLE);
for (const [depositTiming, assign, loanType, rateType, title, warranty, assess] of [
  ['accompanies', 'release', 'FHA', 'adjustable', 'ii', 'buyer', 'b'],
  ['within', 'norelease', 'VA', 'either', 'iii', 'na', 'a'],
  ['within', 'not', 'other', 'fixed', 'i', 'seller', 'a'],
]) {
  mark({ depositTiming, assign, loanType, rateType, title, warranty, assess, financing: ['8b', '8c', '8d'],
    leaseAfterClosing: 'yes', counterOffer: 'yes', riderOther: 'x', riders: RIDERS.map(([k]) => k) });
}
mark({ financing: ['8a'] });
for (const [k, b] of Object.entries(BOXES)) assert(reached.has(b.join()), `checkbox ${k} unreachable`);
for (const [k] of RIDERS) assert(reached.has(riderBox(k).join()), `rider ${k} unreachable`);
assert.equal(reached.size, Object.keys(BOXES).length + RIDERS.length + 1);

// Balance to close: 425,000 - 10,000 - 5,000 - 80% loan (340,000) = 70,000.
assert.equal(computedBalance(SAMPLE), 70000);
assert.equal(resolve(SAMPLE).text.balance, '70,000.00');
assert.equal(computedBalance({ ...SAMPLE, financing: ['8a'] }), 410000);

const tpl = readFileSync('assets/asis-7x.pdf');
const { bytes, warnings } = await fillContract(PDFLib, tpl, SAMPLE);
assert.deepEqual(warnings, []);
assert.equal((await PDFLib.PDFDocument.load(bytes)).getPageCount(), 13);

const long = await fillContract(PDFLib, tpl, { ...SAMPLE, county: 'x'.repeat(200) });
assert.deepEqual(long.warnings, ['county']);

console.log(`ok: ${Object.keys(TEXT).length} text blanks, ${reached.size} checkboxes, ${QUESTIONS.length} questions`);
