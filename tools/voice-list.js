// Prints every French text the game can say, one per line (used to generate voice clips).
global.window = {};
global.localStorage = { getItem: () => null, setItem: () => {} };
require('../js/core.js');
require('../js/data.js');
require('../js/check.js');
require('../js/phrases.js');
const d = window.PR.data;
const texts = new Set();
d.animals.forEach((a) => texts.add(a.name));
d.cards.forEach((c) => { texts.add(c.word); texts.add(c.full); });
window.PR.phrasesTexts().forEach((t) => texts.add(t));
console.log([...texts].join('\n'));
