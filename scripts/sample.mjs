// Fills the template with sample answers: `node scripts/sample.mjs out.pdf [all]`.
// "all" fills every blank with filler text and checks every box (calibration).
import { readFileSync, writeFileSync } from 'node:fs';
import * as PDFLib from 'pdf-lib';
import { fillContract } from '../src/fill.js';
import { BOXES, TEXT, RIDERS } from '../src/fields.js';

export const SAMPLE = {
  seller: 'John Q. Seller and Mary R. Seller', buyer: 'Alex Buyer and Jordan Buyer',
  street: '3107 Galloway Oaks Dr, Orlando, FL 32818', county: 'Orange', taxId: '12-34-56-7890-01-234',
  legal: 'LOT 12, BLOCK B, GALLOWAY OAKS PHASE 2, ACCORDING TO THE PLAT THEREOF AS RECORDED IN PLAT BOOK 45, PAGE 67, PUBLIC RECORDS OF ORANGE COUNTY, FLORIDA',
  personalIncluded: 'Washer, dryer, pool equipment', excluded: 'Dining room chandelier',
  price: '425000', initialDeposit: '10000', depositTiming: 'within', depositDays: '3',
  escrowName: 'Sunshine Title & Escrow, LLC', escrowAddress: '100 Main St, Orlando, FL 32801', escrowPhone: '407-555-0100',
  escrowEmail: 'escrow@sunshinetitle.example', escrowFax: '407-555-0101',
  hasAddlDeposit: 'yes', addlDeposit: '5000', addlDepositDays: '10',
  financing: ['8b'], loanAmount: '80%', loanType: 'conventional', rateType: 'fixed', maxRate: '7.25', loanTerm: '30',
  loanApprovalDays: '30', applicationDays: '5', hasOther: 'no',
  acceptanceDate: '2026-11-01', closingDate: '2026-12-15', leaseAfterClosing: 'no', assign: 'not',
  sellerOtherCosts: 'Up to $5,000 toward Buyer closing costs', buyerOtherCosts: '', titleDays: '15', title: 'i',
  warranty: 'seller', warrantyCompany: 'Acme Home Warranty', warrantyCost: '650', assess: 'a',
  floodDays: '20', inspectionDays: '15', riders: ['B', 'F'], riderOther: '',
  additionalTerms: 'Seller to provide a clear WDO report prior to closing.\nBuyer to receive all garage door remotes and pool keys.',
  counterOffer: 'no', buyerNotice: '123 Current Rd\nOrlando, FL 32803', sellerNotice: '3107 Galloway Oaks Dr\nOrlando, FL 32818',
  coopAssociate: 'Jason Halstead', coopBroker: 'HALSTEAD LANDKORN REALTY', listingAssociate: 'Adam J Smith', listingBroker: 'Example Realty Group',
  printInitials: 'yes', buyerInitials1: 'AB', buyerInitials2: 'JB', sellerInitials1: 'JS', sellerInitials2: 'MS',
};

if (process.argv[1].endsWith('sample.mjs')) {
  const [out = 'sample.pdf', mode] = process.argv.slice(2);
  let a = SAMPLE;
  if (mode === 'all') {
    // Bypass the answer logic: fill every slot and mark every box directly.
    a = { printInitials: 'yes', buyerInitials1: 'B1', buyerInitials2: 'B2', sellerInitials1: 'S1', sellerInitials2: 'S2' };
    const bytes = readFileSync('assets/asis-7x.pdf');
    const doc = await PDFLib.PDFDocument.load(bytes);
    const font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
    const pages = doc.getPages();
    for (const [id, slots] of Object.entries(TEXT)) {
      for (const [p, x, w, y] of slots) {
        pages[p - 1].drawRectangle({ x, y: 792 - y, width: w, height: 7, borderColor: PDFLib.rgb(1, 0, 0), borderWidth: 0.4 });
        pages[p - 1].drawText(id, { x, y: 792 - y, size: 7, font, color: PDFLib.rgb(0, 0, 0.8) });
      }
    }
    const boxes = [...Object.values(BOXES)];
    const { riderBox } = await import('../src/fields.js');
    for (const r of [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].concat(['AA', 'BB', 'CC', 'DD', 'EE', 'FF', 'GG', 'OTHER'])) boxes.push(riderBox(r));
    for (const [p, x, top] of boxes) {
      pages[p - 1].drawRectangle({ x: x + 1.5, y: 792 - top - 8.1 + 1.5, width: 5.1, height: 5.1, color: PDFLib.rgb(1, 0, 0) });
    }
    writeFileSync(out, await doc.save());
  } else {
    const { bytes, warnings } = await fillContract(PDFLib, readFileSync('assets/asis-7x.pdf'), a);
    writeFileSync(out, bytes);
    if (warnings.length) console.log('overflow:', warnings.join(', '));
  }
  console.log('wrote', out);
}
