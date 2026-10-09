// Run: node --test tests/
const test = require('node:test');
const assert = require('node:assert');
const { check, split } = require('../js/check.js');

test('exact answer is perfect', () => {
  const r = check('la crinière', 'la crinière');
  assert.equal(r.ok, true);
  assert.equal(r.perfect, true);
});

test('case, spaces and curly apostrophes are ignored', () => {
  assert.equal(check('  La   CRINIÈRE ', 'la crinière').perfect, true);
  assert.equal(check('l’éléphant', "l'éléphant").perfect, true);
});

test('missing accents are accepted with a note', () => {
  const r = check('la criniere', 'la crinière');
  assert.equal(r.ok, true);
  assert.equal(r.perfect, false);
  assert.deepEqual(r.notes, ['accents']);
});

test('missing or wrong article is accepted with a note', () => {
  assert.deepEqual(check('crinière', 'la crinière').notes, ['article-missing']);
  assert.deepEqual(check('le crinière', 'la crinière').notes, ['article']);
  assert.equal(check('defenses', 'les défenses').ok, true);
});

test('one small typo is accepted', () => {
  assert.equal(check('la crinier', 'la crinière').ok, true);
  assert.equal(check('la fourure', 'la fourrure').ok, true);
  assert.equal(check('les oreils', 'les oreilles').ok, true);
  assert.ok(check('la fourure', 'la fourrure').notes.includes('typo'));
});

test('singular / plural slip is accepted', () => {
  const r = check('la griffe', 'les griffes');
  assert.equal(r.ok, true);
  assert.ok(r.notes.includes('number'));
});

test('a different word is not accepted', () => {
  assert.equal(check('la queue', 'la trompe').ok, false);
  assert.equal(check('les cornes', 'les crocs').ok, false);
  assert.equal(check('', 'le bec').ok, false);
  assert.equal(check('', 'le bec').empty, true);
});

test('letter marks show which letters were wrong', () => {
  const r = check('la crinere', 'la crinière');
  const wrong = r.marks.filter((m) => !m.ok).map((m) => m.ch).join('');
  assert.equal(r.marks.map((m) => m.ch).join(''), 'crinière');
  assert.equal(wrong, 'iè');
});

test('article splitting', () => {
  assert.deepEqual(split("l'éléphant"), { article: "l'", noun: 'éléphant' });
  assert.deepEqual(split('l éléphant'), { article: "l'", noun: 'éléphant' });
  assert.deepEqual(split('les ailes'), { article: 'les', noun: 'ailes' });
  assert.deepEqual(split('lion'), { article: '', noun: 'lion' });
});
