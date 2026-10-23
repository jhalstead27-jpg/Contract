# "AS IS" Contract Wizard

A browser app that asks popup questions, one at a time, and writes the answers into the
**FloridaRealtors/FloridaBar-ASIS-7x Rev. 2/26 "AS IS" Residential Contract For Sale And Purchase**.
It fills the blanks and checks the boxes, then gives you a PDF to preview and download.

## Run it

```bash
npm start            # serves http://localhost:8080
```

Any static web server works (for example `python3 -m http.server`). It also works on GitHub Pages.
Answers are saved in the browser as you go. Close the popup at any time and pick up where you left off.
If you open `index.html` straight from disk, the browser can't load the template on its own,
so the app asks you to pick `assets/asis-7x.pdf`.

## What gets filled

Every line the form marks with an asterisk (the form's marker for "contains a blank") is mapped in
`src/fields.js`, with its line number:

| Area | Lines | Blanks / boxes |
|---|---|---|
| Parties | 1–2 | Seller, Buyer |
| ¶1 Property | 7–25 | Address, county, tax ID, legal description (3 lines), included and excluded items |
| ¶2 Price & deposits | 27–42 | Price, initial deposit plus timing boxes and days, Escrow Agent name, address, phone, email and fax, additional deposit and days, loan amount, Other, **balance to close (auto-calculated)** |
| ¶3–4 Dates | 45, 53 | Acceptance deadline, Closing Date |
| ¶6–7 | 72, 83–84 | Lease/occupancy box, 3 assignability boxes |
| ¶8 Financing | 88–97, 132–133 | 8(a)–(d) boxes, loan type (4), rate type (3), approval days, max rate, term, application days |
| ¶9 Costs/title | 141–196 | Seller/Buyer "Other" costs, title evidence days, 9(c)(i)–(iii), title search cap, home warranty boxes, company and cost, special assessments (a)/(b) |
| ¶10(d), ¶12(a) | 225, 261 | Flood termination days, Inspection Period |
| ¶19 Riders | 592 | All 30 rider boxes plus "Other" (I, K and L are RESERVED on the form) |
| ¶20, Counter-offer | 594–613 | Additional terms (17 lines), counter-offer box |
| Page 13 | 640–651 | Buyer and Seller notice addresses, both sales associates, both brokers |
| Footer | pages 1–12 | Optional typed initials |

Signature and date lines are left for the parties to sign.

The form's "if left blank" defaults are shown with each question, so skipping a question is safe.
Text that is too long for its blank is shrunk down to 6 pt. If it still doesn't fit, the app warns you.

This copy of the form came from TransactionDesk with a few values already printed on it
(the street address, a "0" balance, the listing associate and the cooperating broker). Those spots
are covered with white and replaced by your answers. The same values are the defaults in the questions.

## Updating the template

TransactionDesk PDFs are encrypted (no open password, but edits restricted), and the PDF library
can't load encrypted files. To swap in a fresh download of the same form revision:

```bash
python3 scripts/prepare_template.py ~/Downloads/AS_IS_...pdf assets/asis-7x.pdf
```

A different revision of the form needs its coordinates re-checked in `src/fields.js`.
`node scripts/sample.mjs out.pdf all` draws every mapped slot and checkbox in red so you can see them.

## Tests

```bash
npm install && npm test
```

The tests check that every blank has a question, every checkbox can be reached, the balance
math is right, and a sample contract fills without overflow.
