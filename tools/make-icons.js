// Builds icons/icon.svg (Suri on a green badge) and PNG sizes via Chromium.
const fs = require('fs'), path = require('path');
global.window = {};
['js/art/kit.js', 'js/art/build.js', 'js/art/suri.js'].forEach((f) => require(path.resolve(__dirname, '..', f)));
const PR = window.PR;
let suri = PR.svg('suri', { viewBox: '58 14 184 184', still: true });
suri = suri.replace('<svg ', '<svg x="40" y="52" width="432" height="432" data-mood="happy" ');
// show only the "happy" mood in a static file
suri = suri.replace('<defs>', '<style>.mood{display:none}.m-happy{display:inline}.a-blink{transform:scaleY(0)}</style><defs>');
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#43C08A"/><stop offset="1" stop-color="#1F7A50"/></linearGradient>
<radialGradient id="sun" cx="0.5" cy="0.35" r="0.6"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".9"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></radialGradient></defs>
<rect width="512" height="512" rx="112" fill="url(#bg)"/><circle cx="256" cy="200" r="230" fill="url(#sun)"/>
${suri}</svg>`;
fs.writeFileSync(path.resolve(__dirname, '../icons/icon.svg'), icon);
(async () => {
  const { chromium } = require(process.env.PW_PATH || 'playwright');
  const b = await chromium.launch();
  for (const size of [192, 512]) {
    const p = await b.newPage({ viewport: { width: size, height: size } });
    await p.setContent(`<html><body style="margin:0;background:transparent">${icon.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
    await p.screenshot({ path: path.resolve(__dirname, `../icons/icon-${size}.png`), omitBackground: true });
    await p.close();
  }
  // maskable: full-bleed square
  const p = await b.newPage({ viewport: { width: 512, height: 512 } });
  await p.setContent(`<html><body style="margin:0;background:#2E9E6A">${icon.replace('rx="112"', 'rx="0"').replace('<svg ', '<svg width="512" height="512" ')}</body></html>`);
  await p.screenshot({ path: path.resolve(__dirname, '../icons/icon-maskable-512.png') });
  await b.close();
  console.log('icons done');
})();
