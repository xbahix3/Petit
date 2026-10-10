/* Le Petit Ranger — small shared helpers. */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});

  var NNBSP = ' '; // narrow no-break space: before ? ! ;
  var NBSP = ' ';  // no-break space: before : and inside « »

  // French typography for any text shown to the child.
  PR.fr = function (s) {
    if (s == null) return '';
    return String(s)
      .replace(/'/g, '’')
      .replace(/[   ]*([?!;])/g, function (m, p, off, str) {
        // keep « ?! » together: only the first mark gets the space
        var prev = str.charAt(off - 1);
        if (off === 0 || prev === '?' || prev === '!') return p;
        return NNBSP + p;
      })
      .replace(/[   ]*:/g, NBSP + ':')
      .replace(/«[   ]*/g, '«' + NBSP)
      .replace(/[   ]*»/g, NBSP + '»');
  };

  // Tiny DOM builder: el('div.card#id', {attrs}, children...)
  PR.el = function (spec, attrs) {
    var m = spec.match(/^([a-z0-9]+)?((?:[.#][\w-]+)*)$/i);
    var node = document.createElement((m && m[1]) || 'div');
    if (m && m[2]) {
      m[2].replace(/([.#])([\w-]+)/g, function (x, t, v) {
        if (t === '.') node.classList.add(v); else node.id = v;
      });
    }
    var kids = Array.prototype.slice.call(arguments, 2);
    if (attrs && (typeof attrs !== 'object' || attrs.nodeType || Array.isArray(attrs))) { kids.unshift(attrs); attrs = null; }
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var v = attrs[key];
        if (v == null || v === false) return;
        if (key === 'text') node.textContent = PR.fr(v);
        else if (key === 'raw') node.textContent = v;
        else if (key === 'html') node.innerHTML = v;
        else if (key.indexOf('on') === 0) node.addEventListener(key.slice(2), v);
        else if (key === 'style' && typeof v === 'object') Object.assign(node.style, v);
        else node.setAttribute(key, v === true ? '' : v);
      });
    }
    (function add(list) {
      list.forEach(function (c) {
        if (c == null || c === false) return;
        if (Array.isArray(c)) return add(c);
        node.appendChild(c.nodeType ? c : document.createTextNode(PR.fr(c)));
      });
    })(kids);
    return node;
  };

  // Arabic helper text (only rendered when the helper is switched on via CSS).
  PR.arLine = function (text, cls) {
    return PR.el('span.ar' + (cls ? '.' + cls : ''), { lang: 'ar', dir: 'rtl', raw: text });
  };

  PR.shuffle = function (list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  PR.pick = function (list) { return list[Math.floor(Math.random() * list.length)]; };

  // Settings kept on this device only (sound on/off, Arabic helper on/off).
  var store = {};
  try { store = JSON.parse(localStorage.getItem('petit-ranger-settings') || '{}') || {}; } catch (e) { store = {}; }
  PR.settings = {
    get: function (k, d) { return store[k] === undefined ? d : store[k]; },
    set: function (k, v) {
      store[k] = v;
      try { localStorage.setItem('petit-ranger-settings', JSON.stringify(store)); } catch (e) { /* private mode */ }
    }
  };

  // Difficulty: 'facile' | 'moyen' | 'difficile' (remembered on this device)
  PR.LEVELS = [['facile', 'Facile', 'سهل'], ['moyen', 'Moyen', 'متوسط'], ['difficile', 'Difficile', 'صعب']];
  PR.level = function () { return PR.settings.get('level', 'moyen'); };
  PR.byLevel = function (map) { return map[PR.level()]; };

  PR.wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  PR.reducedMotion = function () {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
})();
