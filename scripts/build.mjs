// Builds AS_IS_Contract_Wizard.html: one self-contained file (code, styles,
// pdf-lib and the contract template inlined) that works when double-clicked.
// Browsers block ES modules on file:// pages, so index.html needs a server.
import { readFileSync, writeFileSync } from 'node:fs';
import { build } from 'esbuild';

const out = 'AS_IS_Contract_Wizard.html';
const { outputFiles } = await build({
  entryPoints: ['src/app.js'], bundle: true, format: 'iife', write: false, target: 'es2020',
});
// Keep "</script" sequences from closing the inline tags early.
const inline = (js) => js.replace(/<\/script/gi, '<\\/script');
const app = inline(outputFiles[0].text);
const pdfLib = inline(readFileSync('vendor/pdf-lib.min.js', 'utf8'));
const css = readFileSync('styles.css', 'utf8');
const template = readFileSync('assets/asis-7x.pdf').toString('base64');

let html = readFileSync('index.html', 'utf8');
const swap = (from, to) => {
  if (!html.includes(from)) throw new Error(`index.html is missing: ${from}`);
  html = html.replace(from, () => to);
};
swap('<link rel="stylesheet" href="styles.css">', `<style>\n${css}</style>`);
swap('<script src="vendor/pdf-lib.min.js"></script>', `<script>${pdfLib}</script>`);
// pdf.js runs its worker on the main thread when window.pdfjsWorker exists,
// which avoids loading a separate worker file (blocked on file:// pages).
for (const f of ['pdf.min.js', 'pdf.worker.min.js']) {
  swap(`<script src="vendor/${f}"></script>`, `<script>${inline(readFileSync('vendor/' + f, 'utf8'))}</script>`);
}
swap('<script type="module" src="src/app.js"></script>',
  `<script>window.ASIS_TEMPLATE_B64 = "${template}";</script>\n  <script>${app}</script>`);
writeFileSync(out, html);
console.log(`wrote ${out} (${(html.length / 1024).toFixed(0)} KB)`);
