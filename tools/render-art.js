// Renders art previews to PNG so the drawings can be checked by eye.
// Usage: node tools/render-art.js <outDir> <name>[:query] ...
//   e.g. node tools/render-art.js /tmp/out lion lion:lit=queue lion:scene=0
const path = require('path');
const { chromium } = require(process.env.PW_PATH || 'playwright');

(async () => {
  const [outDir, ...items] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  for (const item of items) {
    const [name, query] = item.split(':');
    const url = 'file://' + path.resolve(__dirname, 'art-preview.html') + '?a=' + name + (query ? '&' + query.replace(/,/g, '&') : '');
    await page.goto(url);
    await page.waitForTimeout(150);
    const file = path.join(outDir, item.replace(/[:=,&]/g, '_') + '.png');
    await page.screenshot({ path: file });
    const parts = await page.evaluate(() => window.PARTS);
    console.log(file, JSON.stringify(parts));
  }
  if (errors.length) console.log('ERRORS:\n' + errors.join('\n'));
  await browser.close();
})();
