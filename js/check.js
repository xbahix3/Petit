/* Le Petit Ranger — forgiving answer checking for « Écris le mot ».
   Accepts missing or wrong articles, missing accents, a small typo and
   singular/plural slips, and always reports the correct spelling. */
(function (root) {
  'use strict';

  var ARTICLES = ['les', 'le', 'la', "l'", 'un', 'une', 'des'];

  function basic(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[‘’ʼ`´]/g, "'")
      .replace(/[.!?;:,«»"]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function noAccents(s) {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/œ/g, 'oe').replace(/æ/g, 'ae');
  }
  // Split « la crinière » into { article: 'la', noun: 'crinière' }.
  function split(s) {
    s = basic(s);
    for (var i = 0; i < ARTICLES.length; i++) {
      var a = ARTICLES[i];
      if (a === "l'" && s.indexOf("l'") === 0) return { article: "l'", noun: s.slice(2).trim() };
      if (s.indexOf(a + ' ') === 0) return { article: a, noun: s.slice(a.length + 1).trim() };
    }
    // « l » typed without the apostrophe before a vowel: « l éléphant »
    if (/^l [aeiouyhéèêàâîôû]/.test(s)) return { article: "l'", noun: s.slice(2).trim() };
    return { article: '', noun: s };
  }

  function lev(a, b) {
    var m = a.length, n = b.length, d = [];
    for (var i = 0; i <= m; i++) { d[i] = [i]; }
    for (var j = 0; j <= n; j++) { d[0][j] = j; }
    for (i = 1; i <= m; i++) {
      for (j = 1; j <= n; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    }
    return d[m][n];
  }

  // Marks which letters of the expected word the child got right, for display.
  // Returns [{ch, ok}] over the expected noun.
  function letterMarks(typed, expected) {
    var a = noAccents(typed), b = noAccents(expected), m = a.length, n = b.length, d = [];
    for (var i = 0; i <= m; i++) { d[i] = [i]; }
    for (var j = 0; j <= n; j++) { d[0][j] = j; }
    for (i = 1; i <= m; i++) {
      for (j = 1; j <= n; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    }
    var marks = [];
    i = m; j = n;
    while (j > 0) {
      if (i > 0 && d[i][j] === d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) {
        marks.unshift({ ch: expected[j - 1], ok: a[i - 1] === b[j - 1] && typed[i - 1] === expected[j - 1] });
        i--; j--;
      } else if (d[i][j] === d[i][j - 1] + 1) {
        marks.unshift({ ch: expected[j - 1], ok: false });
        j--;
      } else {
        i--;
      }
    }
    return marks;
  }

  /* check(typed, expected) -> {
       ok: accepted?, perfect: exactly right?,
       notes: ['accents' | 'article' | 'typo' | 'number' ...],
       expected: the correct spelling, marks: per-letter feedback } */
  function check(typed, expected) {
    var t = split(typed), e = split(expected);
    var res = { ok: false, perfect: false, notes: [], expected: expected, marks: letterMarks(t.noun, e.noun), empty: !t.noun };
    if (!t.noun) return res;

    var tn = t.noun, en = e.noun, tnA = noAccents(tn), enA = noAccents(en);
    if (tn === en) {
      res.ok = true;
    } else if (tnA === enA) {
      res.ok = true; res.notes.push('accents');
    } else if (tnA.replace(/[sx]$/, '') === enA.replace(/[sx]$/, '')) {
      res.ok = true; res.notes.push('number');
    } else {
      var dist = lev(tnA, enA);
      var allowed = enA.length <= 4 ? 1 : enA.length <= 7 ? 1 : 2;
      if (dist <= allowed && tnA.length >= 2) { res.ok = true; res.notes.push('typo'); }
    }
    if (res.ok) {
      if (!t.article) res.notes.push('article-missing');
      else if (t.article !== e.article) res.notes.push('article');
      res.perfect = res.notes.length === 0;
    }
    return res;
  }

  var api = { check: check, split: split, noAccents: noAccents, lev: lev, letterMarks: letterMarks };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) { root.PR = root.PR || {}; root.PR.answer = api; }
})(typeof window !== 'undefined' ? window : null);
