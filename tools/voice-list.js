// Prints every French text the game can say, one per line (used to generate voice clips).
global.window = {};
require('../js/data.js');
const d = window.PR.data;
const texts = new Set();
d.animals.forEach((a) => texts.add(a.name));
d.cards.forEach((c) => { texts.add(c.word); texts.add(c.full); });
console.log([...texts].join('\n'));
