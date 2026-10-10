/* Le Petit Ranger — start-up and navigation (hash based, so the phone's back button works). */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});
  var root;

  PR.go = function (name, arg) {
    var h = '#/' + name + (arg ? '/' + arg : '');
    if (location.hash === h) render(); else location.hash = h;
  };

  function render() {
    var bits = location.hash.replace(/^#\/?/, '').split('/');
    var name = bits[0] || 'title', arg = bits[1];
    if (!PR.screens[name]) name = 'title';
    if (PR.currentOverlay) { PR.currentOverlay.remove(); PR.currentOverlay = null; }
    Array.prototype.forEach.call(document.querySelectorAll('.overlay, canvas.fx-layer, .spark'), function (o) { o.remove(); });
    PR.audio.stopAll();
    root.textContent = '';
    root.className = '';
    void root.offsetWidth;
    // the title screen is fixed full-screen: no transform animation on its parent
    root.className = name === 'title' ? '' : 'screen-enter';
    document.body.setAttribute('data-screen', name);
    PR.screens[name](root, arg);
    window.scrollTo(0, 0);
  }

  function setAr(on) {
    document.documentElement.classList.toggle('show-ar', on);
    var b = document.getElementById('btn-ar');
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    PR.settings.set('arabic', on);
  }
  function setSound(on) {
    PR.audio.setOn(on);
    var b = document.getElementById('btn-sound');
    b.innerHTML = on ? PR.icons.soundOn : PR.icons.soundOff;
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.setAttribute('aria-label', PR.fr(on ? 'Couper le son' : 'Activer le son'));
  }

  // Fetch every painting once, with a loading screen if it takes more than a moment
  // (slow connections); afterwards the offline cache makes this instant.
  function preload() {
    var urls = ['img/title/' + (matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape') + '.webp'];
    Object.keys(PR.plates).forEach(function (k) { urls.push(PR.plates[k].img); });
    PR.SURI_MOODS.forEach(function (m) { urls.push('img/suri/' + m + '.webp'); });
    var loader = document.getElementById('loader'), bar = loader.querySelector('.bar i'), done = 0, shown = false;
    var showTimer = setTimeout(function () { shown = true; loader.hidden = false; }, 350);
    function finish() {
      clearTimeout(showTimer);
      if (!shown) return;
      loader.classList.add('done');
      setTimeout(function () { loader.hidden = true; }, 600);
    }
    var safety = setTimeout(finish, 20000);
    urls.forEach(function (u) {
      var img = new Image();
      img.onload = img.onerror = function () {
        done++;
        bar.style.width = Math.round((done / urls.length) * 100) + '%';
        if (done === urls.length) { clearTimeout(safety); setTimeout(finish, shown ? 250 : 0); }
      };
      img.src = u;
    });
  }

  function boot() {
    root = document.getElementById('screen');
    var home = document.getElementById('btn-home');
    home.innerHTML = PR.icons.home;
    home.addEventListener('click', function () { PR.audio.sfx('tap'); PR.go('home'); });
    document.getElementById('btn-ar').addEventListener('click', function () {
      var on = !document.documentElement.classList.contains('show-ar');
      setAr(on);
      PR.audio.sfx('tap');
    });
    document.getElementById('btn-sound').addEventListener('click', function () {
      setSound(!PR.audio.isOn());
      PR.audio.sfx('tap');
    });
    setAr(!!PR.settings.get('arabic', false));
    setSound(PR.audio.isOn());
    PR.suri.mount();
    preload();
    window.addEventListener('hashchange', render);
    document.addEventListener('pointerdown', PR.audio.unlock, { once: true });
    render();

    if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
      navigator.serviceWorker.register('sw.js').catch(function () { /* offline mode is a bonus */ });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
