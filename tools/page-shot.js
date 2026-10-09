// node tools/page-shot.js <url> <out.png> <w>x<h>
const { chromium } = require(process.env.PW_PATH || 'playwright');
(async () => { const [url, out, size] = process.argv.slice(2); const [w, h] = size.split('x').map(Number);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: w, height: h } });
  p.on('pageerror', (e) => console.log('pageerror', e.message)); await p.goto(url); await p.waitForTimeout(400);
  await p.screenshot({ path: out, fullPage: true }); await b.close(); })();
