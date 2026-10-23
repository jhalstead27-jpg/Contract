// Question definitions and the PDF coordinate map for the
// FloridaRealtors/FloridaBar-ASIS-7x Rev. 2/26 "AS IS" Residential Contract.
//
// Coordinates are PDF points measured from the TOP-LEFT of a 612x792 page
// (pdf-lib flips them in fill.js). `y` is the text baseline. Every starred
// line in the form (the form's own marker for "contains a blank") has an
// entry below, labelled with its line number.

export const TEMPLATE_URL = 'assets/asis-7x.pdf';
export const FORM_NAME = 'FloridaRealtors/FloridaBar-ASIS-7x Rev. 2/26';

// ---------------------------------------------------------------------------
// Checkbox positions: [page, x, top] of the 8.1pt square printed on the form.
// ---------------------------------------------------------------------------
export const BOXES = {
  depositAccompanies: [1, 175.5, 443.8], // L30 (i)
  depositWithinDays: [1, 298.6, 443.8], // L30 (ii)
  leaseAfterClosing: [2, 91.1, 274.6], // L72 6(b)
  assignRelease: [2, 260.8, 401.1], // L83
  assignNoRelease: [2, 133.6, 412.6], // L84
  assignNot: [2, 437.9, 412.6], // L84
  fin8a: [2, 73.1, 470.6], // L88 cash
  fin8b: [2, 73.1, 482.1], // L89 financing contingency
  loanConventional: [2, 307.8, 493.6], // L90
  loanFHA: [2, 380.8, 493.6],
  loanVA: [2, 417.5, 493.6],
  loanOther: [2, 459.6, 493.6],
  rateFixed: [2, 421.1, 505.1], // L91
  rateAdjustable: [2, 462.9, 505.1],
  rateEither: [2, 529.1, 505.1],
  fin8c: [3, 73.1, 320.6], // L132 assumption
  fin8d: [3, 73.1, 332.2], // L133 purchase money mortgage
  title_i: [4, 91.1, 136.6], // L172
  title_ii: [4, 91.1, 159.7], // L174
  title_iii: [4, 91.1, 182.6], // L176
  warrantyBuyer: [4, 244.6, 274.6], // L184
  warrantySeller: [4, 289.3, 274.6],
  warrantyNA: [4, 333.3, 274.6],
  assess_a: [4, 91.1, 389.6], // L194
  assess_b: [4, 91.1, 412.6], // L196
  counterOffer: [12, 73.1, 304.1], // L613
};

// Paragraph 19 riders (page 11). Column x positions / row tops from the form.
export const RIDERS = [
  ['A', 'Condominium Rider'],
  ['B', 'Homeowners’ Assn.'],
  ['C', 'Seller Financing'],
  ['D', 'Mortgage Assumption'],
  ['E', 'FHA/VA Financing'],
  ['F', 'Appraisal Contingency'],
  ['G', 'Short Sale'],
  ['H', 'Homeowners’/Flood Ins'],
  ['J', 'Interest-Bearing Acct.'],
  ['M', 'Defective Drywall'],
  ['N', 'Coastal Construction Control Line'],
  ['O', 'Insulation Disclosure'],
  ['P', 'Lead Paint Disclosure (Pre-1978)'],
  ['Q', 'Housing for Older Persons'],
  ['R', 'Rezoning'],
  ['S', 'Lease Purchase/ Lease Option'],
  ['T', 'Pre-Closing Occupancy'],
  ['U', 'Post-Closing Occupancy'],
  ['V', 'Sale of Buyer’s Property'],
  ['W', 'Back-up Contract'],
  ['X', 'Kick-out Clause'],
  ['Y', 'Seller’s Attorney Approval'],
  ['Z', 'Buyer’s Attorney Approval'],
  ['AA', 'Licensee Property Interest'],
  ['BB', 'Binding Arbitration'],
  ['CC', 'Miami-Dade County Special Taxing District Disclosure'],
  ['DD', 'Seasonal/Vacation Rentals'],
  ['EE', 'Qualifying Improvements Disclosure'],
  ['FF', 'Credit Related to Buyers Broker Compensation'],
  ['GG', 'Sellers Agreement with Respect to Buyers Broker Compensation'],
];
const COL1 = 'ABCDEFGHIJKLMN'; // I, K, L are RESERVED but still have boxes
const COL2 = 'OPQRSTUVWXYZ';
const COL3 = { AA: 530.5, BB: 542.0, CC: 553.5, DD: 588.0, EE: 611.0, FF: 634.0, GG: 656.9, OTHER: 691.4 };
export function riderBox(letter) {
  if (letter.length === 1 && COL1.includes(letter)) return [11, 65.8, 530.4 + 11.5 * COL1.indexOf(letter)];
  if (letter.length === 1 && COL2.includes(letter)) return [11, 216.6, 530.5 + 11.5 * COL2.indexOf(letter)];
  return [11, 405.1, COL3[letter]];
}

// ---------------------------------------------------------------------------
// Text blanks: one or more [page, x, width, baseline] slots. Multi-slot blanks
// wrap from one slot to the next (e.g. a legal description over 3 lines).
// ---------------------------------------------------------------------------
export const TEXT = {
  seller: [[1, 101, 432, 98.9]], // L1
  buyer: [[1, 75, 459, 110.4]], // L2
  street: [[1, 200, 374, 167.9]], // L7
  county: [[1, 143, 76, 178.6]], // L8
  taxId: [[1, 380, 195, 179.4]], // L8
  legal: [[1, 262, 313, 190.9], [1, 92, 483, 202.4], [1, 92, 483, 213.9]], // L9-11
  personalIncluded: [[1, 360, 215, 328.9], [1, 92, 483, 340.4]], // L21-22
  excluded: [[1, 324, 251, 363.4], [1, 92, 483, 374.9]], // L24-25
  price: [[1, 507, 68, 409.9]], // L27
  initialDeposit: [[1, 507, 68, 427.4]], // L28
  depositDays: [[1, 403, 26, 449.6]], // L30
  escrowName: [[1, 191, 305, 484.1]], // L33
  escrowAddress: [[1, 131, 223, 496.4]], // L34
  escrowPhone: [[1, 392, 104, 495.6]], // L34
  escrowEmail: [[1, 124, 227, 507.0]], // L35
  escrowFax: [[1, 375, 121, 507.0]], // L35
  addlDepositDays: [[1, 346, 53, 518.6]], // L36
  addlDeposit: [[1, 507, 68, 530.1]], // L37
  loanAmount: [[1, 506, 69, 553.1]], // L39
  otherDesc: [[1, 120, 329, 568.4]], // L40
  otherAmount: [[1, 507, 68, 567.6]], // L40
  balance: [[1, 507, 68, 590.6]], // L42
  acceptanceDate: [[1, 91, 124, 625.1]], // L45
  closingDate: [[2, 275, 158, 61.9]], // L53
  loanApprovalDays: [[2, 288, 36, 487.8]], // L89
  loanOtherDesc: [[2, 499, 77, 499.4]], // L90
  maxRate: [[2, 500, 36, 522.3]], // L92
  loanTerm: [[2, 444, 36, 533.9]], // L93
  applicationDays: [[2, 331, 36, 579.8]], // L97
  sellerOtherCosts: [[3, 403, 170, 441.8]], // L141
  buyerOtherCosts: [[3, 114, 226, 591.3]], // L154
  titleDays: [[3, 304, 30, 602.9]], // L155
  titleSearchCap: [[4, 266, 70, 222.9]], // L179
  warrantyCompany: [[4, 91, 237, 291.9]], // L185
  warrantyCost: [[4, 443, 92, 291.9]], // L185
  floodDays: [[5, 406, 26, 107.9]], // L225
  inspectionDays: [[5, 436, 30, 545.3]], // L261
  riderOther: [[11, 446, 130, 696.3]], // L592 "Other:"
  // L594-611 Additional Terms: 17 full-width lines starting on line 595.
  additionalTerms: Array.from({ length: 17 }, (_, i) => [12, 72, 504, 86.4 + 11.5 * i]),
  buyerNotice: [[13, 73, 237, 465.0], [13, 73, 237, 476.4], [13, 73, 237, 488.0]], // L640-642
  sellerNotice: [[13, 329, 243, 465.0], [13, 329, 243, 476.4], [13, 329, 243, 488.0]],
  coopAssociate: [[13, 73, 237, 591.5]], // L649
  listingAssociate: [[13, 344, 231, 591.5]], // L649
  coopBroker: [[13, 73, 237, 620.4]], // L651
  listingBroker: [[13, 344, 231, 620.4]], // L651
};

// Values TransactionDesk pre-printed onto this copy of the form. They are
// covered with white before the user's answer is written in their place.
export const WHITEOUT = {
  street: [[1, 211, 159.2, 126, 9.0]], // "3107 GALLOWAY OAKS DR"
  balance: [[1, 570, 582.2, 7, 8.2]], // "0"
  listingAssociate: [[13, 425, 583.2, 68, 8.2]], // "Adam J Smith"
  coopBroker: [[13, 126, 612.2, 132, 8.2]], // "HALSTEAD LANDKORN REALTY"
};

// Footer initials, pages 1-12.
export const INITIALS = {
  buyerInitials1: [108, 40], buyerInitials2: [152, 44],
  sellerInitials1: [483, 44], sellerInitials2: [531, 44],
  baseline: 743.8, pages: 12,
};

// ---------------------------------------------------------------------------
// Questions, asked one at a time in a popup. `when` hides a question that does
// not apply. `blank` repeats the form's own default when the blank is empty.
// ---------------------------------------------------------------------------
const loan = (a) => a.financing?.includes('8b');
const yes = (k) => (a) => a[k] === 'yes';

export const SECTIONS = [
  {
    title: 'Parties',
    questions: [
      { id: 'seller', label: 'Seller name(s)', ref: 'Line 1', type: 'text', required: true,
        help: 'Full legal name(s) of every seller, exactly as they appear on the deed.' },
      { id: 'buyer', label: 'Buyer name(s)', ref: 'Line 2', type: 'text', required: true,
        help: 'Full legal name(s) of every buyer, as they will take title.' },
    ],
  },
  {
    title: 'Property (Paragraph 1)',
    questions: [
      { id: 'street', label: 'Street address, city, zip', ref: '1(a), Line 7', type: 'text', required: true,
        default: '3107 GALLOWAY OAKS DR' },
      { id: 'county', label: 'County the property is located in', ref: '1(b), Line 8', type: 'text', required: true,
        placeholder: 'e.g. Orange', help: 'Just the county name. The form already prints “County, Florida”.' },
      { id: 'taxId', label: 'Property Tax ID / Parcel #', ref: '1(b), Line 8', type: 'text' },
      { id: 'legal', label: 'Legal description', ref: '1(c), Lines 9–11', type: 'textarea',
        help: 'Copy it from the deed or property appraiser. It fills three lines; if it is longer, enter “See attached Exhibit A” and attach it.' },
      { id: 'personalIncluded', label: 'Other personal property INCLUDED in the sale', ref: '1(d), Lines 21–22', type: 'textarea',
        help: 'The form already includes ranges/ovens, refrigerators, dishwashers, disposal, ceiling fans, light fixtures, window treatments, smoke detectors, garage door openers, TV wall mounts, access devices and storm shutters. List anything extra (e.g. washer, dryer, pool equipment). Leave blank if none.' },
      { id: 'excluded', label: 'Items EXCLUDED from the sale', ref: '1(e), Lines 24–25', type: 'textarea',
        help: 'Leave blank if nothing is excluded.' },
    ],
  },
  {
    title: 'Purchase Price & Deposits (Paragraph 2)',
    questions: [
      { id: 'price', label: 'Purchase price', ref: '2, Line 27', type: 'money', required: true },
      { id: 'initialDeposit', label: 'Initial escrow deposit', ref: '2(a), Line 28', type: 'money' },
      { id: 'depositTiming', label: 'When will the initial deposit be delivered to Escrow Agent?', ref: '2(a), Line 30', type: 'choice',
        options: [['accompanies', 'It accompanies the offer'], ['within', 'Within a number of days after Effective Date']],
        blank: 'If neither box is checked, option (ii) applies.' },
      { id: 'depositDays', label: 'Initial deposit due within how many days after Effective Date?', ref: '2(a), Line 30', type: 'number',
        when: (a) => a.depositTiming === 'within', blank: 'If left blank, then 3 days.' },
      { id: 'escrowName', label: 'Escrow Agent name', ref: '2(a), Line 33', type: 'text' },
      { id: 'escrowAddress', label: 'Escrow Agent address', ref: '2(a), Line 34', type: 'text' },
      { id: 'escrowPhone', label: 'Escrow Agent phone', ref: '2(a), Line 34', type: 'text' },
      { id: 'escrowEmail', label: 'Escrow Agent email', ref: '2(a), Line 35', type: 'text' },
      { id: 'escrowFax', label: 'Escrow Agent fax', ref: '2(a), Line 35', type: 'text' },
      { id: 'hasAddlDeposit', label: 'Will there be an additional deposit?', ref: '2(b), Lines 36–37', type: 'choice',
        options: [['yes', 'Yes'], ['no', 'No']], default: 'no' },
      { id: 'addlDeposit', label: 'Additional deposit amount', ref: '2(b), Line 37', type: 'money', when: yes('hasAddlDeposit') },
      { id: 'addlDepositDays', label: 'Additional deposit due within how many days after Effective Date?', ref: '2(b), Line 36', type: 'number',
        when: yes('hasAddlDeposit'), blank: 'If left blank, then 10 days.' },
    ],
  },
  {
    title: 'Financing (Paragraphs 2(c) & 8)',
    questions: [
      { id: 'financing', label: 'How is the buyer paying?', ref: '8(a)–(d), Lines 88–133', type: 'multi', required: true,
        options: [['8a', '8(a) Cash — no financing contingency'], ['8b', '8(b) Mortgage loan — contingent on loan approval'],
          ['8c', '8(c) Assumption of existing mortgage (Rider D)'], ['8d', '8(d) Purchase money note & mortgage to Seller (Rider C)']],
        exclusive: '8a', help: 'Cash cannot be combined with the other options.' },
      { id: 'loanAmount', label: 'Loan amount (dollar amount or percentage of price)', ref: '2(c), Line 39', type: 'text',
        when: loan, placeholder: 'e.g. 320000 or 80%', help: 'Enter a dollar figure or a percentage such as 80%.' },
      { id: 'loanType', label: 'Type of mortgage loan', ref: '8(b), Line 90', type: 'choice', when: loan,
        options: [['conventional', 'Conventional'], ['FHA', 'FHA'], ['VA', 'VA'], ['other', 'Other']] },
      { id: 'loanOtherDesc', label: 'Describe the other loan type', ref: '8(b), Line 90', type: 'text',
        when: (a) => loan(a) && a.loanType === 'other' },
      { id: 'rateType', label: 'Interest rate type', ref: '8(b), Line 91', type: 'choice', when: loan,
        options: [['fixed', 'Fixed'], ['adjustable', 'Adjustable'], ['either', 'Fixed or adjustable']] },
      { id: 'maxRate', label: 'Maximum initial interest rate (%)', ref: '8(b), Line 92', type: 'number', step: '0.001', when: loan,
        blank: 'If left blank, the prevailing rate based on Buyer’s creditworthiness.' },
      { id: 'loanTerm', label: 'Loan term (years)', ref: '8(b), Line 93', type: 'number', when: loan, blank: 'If left blank, then 30 years.' },
      { id: 'loanApprovalDays', label: 'Loan Approval Period (days after Effective Date)', ref: '8(b), Line 89', type: 'number', when: loan,
        blank: 'If left blank, then 30 days.' },
      { id: 'applicationDays', label: 'Buyer applies for financing within how many days?', ref: '8(b)(i), Line 97', type: 'number', when: loan,
        blank: 'If left blank, then 5 days.' },
      { id: 'hasOther', label: 'Any other credit toward the price (Paragraph 2(d) “Other”)?', ref: '2(d), Line 40', type: 'choice',
        options: [['yes', 'Yes'], ['no', 'No']], default: 'no', help: 'E.g. a seller-held second mortgage or an assumed loan balance.' },
      { id: 'otherDesc', label: 'Describe the “Other” item', ref: '2(d), Line 40', type: 'text', when: yes('hasOther') },
      { id: 'otherAmount', label: '“Other” amount', ref: '2(d), Line 40', type: 'money', when: yes('hasOther') },
      { id: 'balance', label: 'Balance to close', ref: '2(e), Line 42', type: 'money', computed: true,
        help: 'Calculated as price minus deposits, loan amount and “Other”. You can override it.' },
    ],
  },
  {
    title: 'Dates (Paragraphs 3 & 4)',
    questions: [
      { id: 'acceptanceDate', label: 'Offer expires if not accepted and delivered by', ref: '3(a), Line 45', type: 'date', required: true },
      { id: 'closingDate', label: 'Closing Date', ref: '4, Line 53', type: 'date', required: true },
    ],
  },
  {
    title: 'Occupancy & Assignment (Paragraphs 6 & 7)',
    questions: [
      { id: 'leaseAfterClosing', label: 'Is the property subject to lease(s) or occupancy after Closing?', ref: '6(b), Line 72', type: 'choice',
        options: [['yes', 'Yes — check 6(b)'], ['no', 'No']], default: 'no' },
      { id: 'assign', label: 'Can the buyer assign this contract?', ref: '7, Lines 83–84', type: 'choice',
        options: [['release', 'May assign and be released from liability'], ['norelease', 'May assign but NOT be released from liability'], ['not', 'May not assign']],
        blank: 'If no box is checked, Buyer may not assign.' },
    ],
  },
  {
    title: 'Closing Costs & Title (Paragraph 9)',
    questions: [
      { id: 'sellerOtherCosts', label: 'Other costs to be paid by SELLER', ref: '9(a), Line 141', type: 'text',
        help: 'E.g. “Up to $5,000 toward Buyer’s closing costs”. Leave blank if none.' },
      { id: 'buyerOtherCosts', label: 'Other costs to be paid by BUYER', ref: '9(b), Line 154', type: 'text' },
      { id: 'titleDays', label: 'Title Evidence Deadline (days before Closing Date)', ref: '9(c), Line 155', type: 'number',
        blank: 'If left blank, then 15 days (5 days if 8(a) cash is checked).' },
      { id: 'title', label: 'Who designates the Closing Agent and pays for the Owner’s Policy?', ref: '9(c), Lines 172–176', type: 'choice',
        options: [['i', '(i) Seller designates Closing Agent and pays Owner’s Policy and Charges'],
          ['ii', '(ii) Buyer designates Closing Agent and pays Owner’s Policy and Charges'],
          ['iii', '(iii) Miami-Dade/Broward regional provision']] },
      { id: 'titleSearchCap', label: 'Seller’s title search cost not to exceed', ref: '9(c)(iii), Line 179', type: 'money',
        when: (a) => a.title === 'iii', blank: 'If left blank, then $200.00.' },
      { id: 'warranty', label: 'Who pays for a home warranty plan?', ref: '9(e), Line 184', type: 'choice',
        options: [['buyer', 'Buyer'], ['seller', 'Seller'], ['na', 'N/A — no home warranty']] },
      { id: 'warrantyCompany', label: 'Home warranty company', ref: '9(e), Line 185', type: 'text',
        when: (a) => a.warranty === 'buyer' || a.warranty === 'seller' },
      { id: 'warrantyCost', label: 'Home warranty cost not to exceed', ref: '9(e), Line 185', type: 'money',
        when: (a) => a.warranty === 'buyer' || a.warranty === 'seller' },
      { id: 'assess', label: 'If special assessments may be paid in installments:', ref: '9(f), Lines 194–196', type: 'choice',
        options: [['a', '(a) Seller pays installments due before Closing; Buyer pays those due after'],
          ['b', '(b) Seller pays the assessment(s) in full at or before Closing']],
        blank: 'If neither box is checked, option (a) applies.' },
    ],
  },
  {
    title: 'Flood Zone & Inspections (Paragraphs 10 & 12)',
    questions: [
      { id: 'floodDays', label: 'Days after Effective Date to terminate over flood zone / elevation', ref: '10(d), Line 225', type: 'number',
        blank: 'If left blank, then 20 days.' },
      { id: 'inspectionDays', label: 'Inspection Period (days after Effective Date)', ref: '12(a), Line 261', type: 'number',
        blank: 'If left blank, then 15 days.' },
    ],
  },
  {
    title: 'Riders & Additional Terms (Paragraphs 19 & 20)',
    questions: [
      { id: 'riders', label: 'Which riders / addenda are attached?', ref: '19, Line 592', type: 'multi',
        options: RIDERS.map(([k, v]) => [k, `${k}. ${v}`]),
        suggest: (a) => [
          a.financing?.includes('8c') && 'D', a.financing?.includes('8d') && 'C',
          loan(a) && (a.loanType === 'FHA' || a.loanType === 'VA') && 'E',
        ].filter(Boolean),
        help: 'Checked automatically: C if 8(d), D if 8(c), E if FHA/VA. Uncheck any you do not want.' },
      { id: 'riderOther', label: 'Other addendum (name it)', ref: '19, Line 592 “Other”', type: 'text',
        help: 'Leave blank if none. Filling this checks the “Other” box.' },
      { id: 'additionalTerms', label: 'Additional terms', ref: '20, Lines 594–611', type: 'textarea', rows: 8,
        help: 'Up to 17 lines on the form. Leave blank if none.' },
      { id: 'counterOffer', label: 'Is this a Seller counter-offer?', ref: 'Counter-Offer, Line 613', type: 'choice',
        options: [['yes', 'Yes — Seller counters Buyer’s offer'], ['no', 'No']], default: 'no' },
    ],
  },
  {
    title: 'Notice Addresses & Brokers (Page 13)',
    questions: [
      { id: 'buyerNotice', label: 'Buyer’s address for purposes of notice', ref: 'Lines 640–642', type: 'textarea', rows: 3 },
      { id: 'sellerNotice', label: 'Seller’s address for purposes of notice', ref: 'Lines 640–642', type: 'textarea', rows: 3 },
      { id: 'coopAssociate', label: 'Cooperating Sales Associate (buyer’s agent), if any', ref: 'Line 649', type: 'text' },
      { id: 'coopBroker', label: 'Cooperating Broker, if any', ref: 'Line 651', type: 'text', default: 'HALSTEAD LANDKORN REALTY' },
      { id: 'listingAssociate', label: 'Listing Sales Associate', ref: 'Line 649', type: 'text', default: 'Adam J Smith' },
      { id: 'listingBroker', label: 'Listing Broker', ref: 'Line 651', type: 'text' },
    ],
  },
  {
    title: 'Initials (footer of pages 1–12)',
    questions: [
      { id: 'printInitials', label: 'Print typed initials in the footer of every page?', ref: 'Pages 1–12', type: 'choice',
        options: [['no', 'No — parties will initial by hand / e-sign'], ['yes', 'Yes — type initials on every page']], default: 'no' },
      { id: 'buyerInitials1', label: 'Buyer 1 initials', type: 'text', when: yes('printInitials') },
      { id: 'buyerInitials2', label: 'Buyer 2 initials', type: 'text', when: yes('printInitials') },
      { id: 'sellerInitials1', label: 'Seller 1 initials', type: 'text', when: yes('printInitials') },
      { id: 'sellerInitials2', label: 'Seller 2 initials', type: 'text', when: yes('printInitials') },
    ],
  },
];

export const QUESTIONS = SECTIONS.flatMap((s) => s.questions.map((q) => ({ ...q, section: s.title })));

// ---------------------------------------------------------------------------
// Derived values
// ---------------------------------------------------------------------------
export const num = (v) => {
  const n = parseFloat(String(v ?? '').replace(/[$,\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

export function loanDollars(a) {
  if (!a.financing?.includes('8b')) return 0;
  const s = String(a.loanAmount ?? '').trim();
  if (s.endsWith('%')) return (num(a.price) * num(s.slice(0, -1))) / 100;
  return num(s);
}

export function computedBalance(a) {
  return num(a.price) - num(a.initialDeposit)
    - (a.hasAddlDeposit === 'yes' ? num(a.addlDeposit) : 0)
    - loanDollars(a)
    - (a.hasOther === 'yes' ? num(a.otherAmount) : 0);
}

export const isVisible = (q, a) => !q.when || q.when(a);
