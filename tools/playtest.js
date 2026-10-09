// Plays every activity automatically and saves screenshots.
// Usage: BASE=http://127.0.0.1:8080/index.html node tools/playtest.js <outDir> [width]x[height]
const path = require('path');
const { chromium } = require(process.env.PW_PATH || 'playwright');
(async () => {
  const [outDir, size = '1280x800'] = process.argv.slice(2);
  const [w, h] = size.split('x').map(Number);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: h }, hasTouch: w < 700 });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  const base = process.env.BASE;
  let n = 0;
  // French typography: narrow no-break space before ? ! ;  no-break space before :  curly apostrophes
  const typo = async (where) => {
    const bad = await page.evaluate(() => {
      const out = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const el = node.parentElement;
        if (!el || el.closest('[lang="ar"], script, style, title') || !el.offsetParent && getComputedStyle(el).position !== 'fixed') continue;
        const t = node.textContent;
        if (/[^\u202F?!]\s*[?!;]/.test(t) && /(^|[^\u202F?!])[?!;]/.test(t)) out.push('space before ?!; -> ' + JSON.stringify(t));
        if (/(^|[^\u00A0]):/.test(t) && !/https?:/.test(t)) out.push('space before : -> ' + JSON.stringify(t));
        if (/'/.test(t)) out.push('straight apostrophe -> ' + JSON.stringify(t));
      }
      return out;
    });
    bad.forEach((b) => typoErrors.add(where + ': ' + b));
  };
  const typoErrors = new Set();
  const shot = async (name) => { await typo(name); const f = path.join(outDir, `${w}_${String(++n).padStart(2, '0')}_${name}.png`); await page.screenshot({ path: f }); console.log(f); };
  // click the visible centre of a part (or of another part)
  const tapPart = (part, other) => page.evaluate(([part, other]) => {
    const svg = document.querySelector('.scene-card svg');
    const groups = [...svg.querySelectorAll('[data-part]')].filter((g) => other ? g.dataset.part !== part : g.dataset.part === part);
    for (const g of groups) {
      for (const shape of [...g.querySelectorAll('*')].filter((e) => e.getBBox)) {
        const r = shape.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) continue;
        for (const [fx, fy] of [[0.5, 0.5], [0.3, 0.5], [0.7, 0.5], [0.5, 0.3], [0.5, 0.7]]) {
          const x = r.left + r.width * fx, y = r.top + r.height * fy;
          const hit = document.elementFromPoint(x, y);
          const p = hit && hit.closest && hit.closest('[data-part]');
          if (p && p === g) {
            hit.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: x, clientY: y }));
            return g.dataset.part;
          }
        }
      }
    }
    return null;
  }, [part, other]);

  // ---- Découverte
  await page.goto(base + '#/animal/elephant'); await page.waitForTimeout(600);
  await page.click('.hotspot >> nth=0', { force: true }); await page.waitForTimeout(500);
  await shot('discover-elephant');
  await page.goto(base + '#/animal/girafe'); await page.waitForTimeout(500);
  for (let i = 0; i < 3; i++) { await page.click(`.hotspot >> nth=${i}`, { force: true }); await page.waitForTimeout(250); }
  await page.waitForTimeout(400);
  await shot('discover-girafe-all');

  // ---- Montre-moi
  await page.goto(base + '#/point'); await page.waitForTimeout(700);
  await shot('point-q1');
  for (let q = 0; q < 8; q++) {
    const target = await page.evaluate(() => PR.debug.card.part);
    if (q === 0 || q === 3) {
      const wrong = await tapPart(target, true); await page.waitForTimeout(400);
      if (q === 0) await shot('point-wrong-' + wrong);
      await tapPart(target, true); await page.waitForTimeout(1400);
      if (q === 0) await shot('point-hint');
    }
    const ok = await tapPart(target, false);
    if (!ok) errors.push('could not tap part ' + target + ' on ' + (await page.evaluate(() => PR.debug.card.animal)));
    await page.waitForTimeout(500);
    if (q === 0) await shot('point-right');
    await page.waitForTimeout(2000);
  }
  await page.waitForTimeout(600);
  await shot('point-finish');

  // ---- Écris le mot
  await page.goto(base + '#/spell'); await page.waitForTimeout(700);
  await shot('spell-q1');
  const answers = [(w) => w.replace(/é|è|ê/g, 'e').replace(/^(les |le |la |l')/, ''), () => 'xyz', (w) => w, (w) => w.slice(0, -1), (w) => w, (w) => w, (w) => w, (w) => w];
  for (let q = 0; q < 8; q++) {
    const has = await page.$('.spell-input:not([disabled])'); if (!has) break;
    if (q === 0) { await page.click('text=Indice'); await page.waitForTimeout(200); }
    const word = await page.evaluate(() => PR.debug.card.word);
    await page.fill('.spell-input', answers[q](word));
    await page.click('button:has-text("Valider")'); await page.waitForTimeout(600);
    if (q < 2) await shot('spell-answer-' + q);
    await page.click('button:has-text("Continuer")'); await page.waitForTimeout(400);
  }
  await page.waitForTimeout(800);
  await shot('spell-finish');

  // ---- Quiz
  await page.goto(base + '#/quiz'); await page.waitForTimeout(800);
  for (let q = 0; q < 8; q++) {
    const info = await page.evaluate(() => ({ type: PR.debug.q.type, word: PR.debug.q.card.word, animal: PR.debug.q.type === 'sound' ? PR.cap(PR.debug.q.animal.name) : PR.cap(PR.data.animal(PR.debug.q.card.animal).name) }));
    const right = info.type === 'name' ? info.word : info.animal;
    const buttons = await page.$$('.choice');
    let rightBtn = null;
    for (const b of buttons) { const t = (await b.innerText()).split('\n')[0].replace(/’/g, "'"); if (t === right.replace(/’/g, "'")) rightBtn = b; }
    if (!rightBtn) { errors.push('quiz: no right button for ' + JSON.stringify(info)); break; }
    if (q < 3) await shot('quiz-' + info.type);
    if (q === 1) { for (const b of buttons) if (b !== rightBtn) { await b.click(); break; } await page.waitForTimeout(400); await shot('quiz-wrong'); }
    await rightBtn.click(); await page.waitForTimeout(500);
    if (q === 0) await shot('quiz-right');
    await page.click('.quiz-card .btn.sun'); await page.waitForTimeout(500);
  }
  await page.waitForTimeout(700);
  await shot('quiz-finish');

  // ---- Mémoire
  await page.goto(base + '#/memory'); await page.waitForTimeout(800);
  await shot('memory-start');
  const order = await page.evaluate(() => { const t = PR.debug.tiles; const idx = (x) => t.indexOf(x); const out = []; const done = {};
    t.forEach((a, i) => { if (done[i]) return; const j = t.findIndex((b, k) => k !== i && b.c.id === a.c.id); out.push([i, j]); done[i] = done[j] = 1; }); return out; });
  // one miss first
  await page.click(`.mem-card >> nth=${order[0][0]}`, { force: true }); await page.waitForTimeout(300);
  await page.click(`.mem-card >> nth=${order[1][0]}`, { force: true }); await page.waitForTimeout(500);
  await shot('memory-miss');
  await page.waitForTimeout(1200);
  for (const [a, b] of order) {
    await page.click(`.mem-card >> nth=${a}`, { force: true }); await page.waitForTimeout(250);
    await page.click(`.mem-card >> nth=${b}`, { force: true }); await page.waitForTimeout(900);
    if (a === order[2][0]) await shot('memory-progress');
  }
  await page.waitForTimeout(2200);
  await shot('memory-finish');

  for (const hash of ['', '#/home', '#/discover', '#/credits']) { await page.goto(base + hash); await page.waitForTimeout(500); await typo(hash || 'title'); }
  for (const a of ['lion', 'gazelle', 'elephant', 'girafe', 'loup', 'perruche']) {
    await page.goto(base + '#/animal/' + a); await page.waitForTimeout(400); await typo(a);
    const spots = await page.$$('.hotspot');
    for (const s of spots) { await s.click({ force: true }); await page.waitForTimeout(150); await typo(a + '-part'); }
  }
  console.log(typoErrors.size ? 'TYPOGRAPHY:\n' + [...typoErrors].join('\n') : 'typography ok');
  console.log(errors.length ? 'ERRORS:\n' + [...new Set(errors)].join('\n') : 'no errors');
  process.exitCode = typoErrors.size || errors.length ? 1 : 0;
  await browser.close();
})();
