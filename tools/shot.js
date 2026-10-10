// Screenshots of the running game. Usage: node tools/shot.js <outDir> <width>x<height> <hash> [<hash>...]
// A hash may be followed by "@js:<code>" to run code before the shot (e.g. click something).
const path = require('path');
const { chromium } = require(process.env.PW_PATH || 'playwright');
(async () => {
  const [outDir, size, ...hashes] = process.argv.slice(2);
  const [w, h] = size.split('x').map(Number);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
  const base = process.env.BASE || 'file://' + path.resolve(__dirname, '..', 'index.html');
  for (const item of hashes) {
    const [hash, js] = item.split('@js:');
    await page.goto(base + hash);
    await page.waitForTimeout(Number(process.env.WAIT || 700));
    if (js) { await page.evaluate(js); await page.waitForTimeout(900); }
    const file = path.join(outDir, `${w}x${h}_${hash.replace(/[#/]/g, '_') || 'title'}${js ? '_js' : ''}.png`);
    await page.screenshot({ path: file });
    console.log(file);
  }
  if (errors.length) console.log('ERRORS:\n' + [...new Set(errors)].join('\n'));
  await browser.close();
})();
