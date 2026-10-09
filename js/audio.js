/* Le Petit Ranger — sound.
   - Animal calls and French words are real recordings (files under audio/).
   - Feedback sounds are soft marimba-like tones made with Web Audio,
     so mistakes never sound harsh. */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});
  var ctx = null, master = null;
  var channels = {};          // one HTMLAudioElement playing per channel
  var enabled = PR.settings.get('sound', true);

  function ensureCtx() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
    return ctx;
  }

  // Must be called from a user gesture (first tap) to allow sound on phones.
  function unlock() {
    var c = ensureCtx();
    if (c && c.state === 'suspended') c.resume();
  }

  // Marimba-ish note: a sine with a quickly fading overtone.
  function note(freq, start, dur, vol, type) {
    var c = ensureCtx();
    if (!c || !enabled) return;
    var t = c.currentTime + start;
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(master);
    var o = c.createOscillator();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    o.connect(g);
    o.start(t); o.stop(t + dur + 0.05);
    // overtone
    var g2 = c.createGain();
    g2.gain.setValueAtTime(0.0001, t);
    g2.gain.exponentialRampToValueAtTime(vol * 0.35, t + 0.008);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + Math.min(0.12, dur));
    g2.connect(master);
    var o2 = c.createOscillator();
    o2.frequency.setValueAtTime(freq * 4, t);
    o2.connect(g2);
    o2.start(t); o2.stop(t + 0.2);
  }

  function glide(f1, f2, start, dur, vol) {
    var c = ensureCtx();
    if (!c || !enabled) return;
    var t = c.currentTime + start;
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(master);
    var o = c.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(f1, t);
    o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    o.connect(g);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function whoosh(start, dur, vol) {
    var c = ensureCtx();
    if (!c || !enabled) return;
    var t = c.currentTime + start, len = Math.floor(c.sampleRate * dur);
    var buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.sin((i / len) * Math.PI);
    var src = c.createBufferSource(); src.buffer = buf;
    var f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.8;
    f.frequency.setValueAtTime(600, t); f.frequency.exponentialRampToValueAtTime(2400, t + dur);
    var g = c.createGain(); g.gain.value = vol;
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t);
  }

  var SFX = {
    tap: function () { note(1046, 0, 0.12, 0.12); },
    pop: function () { glide(520, 880, 0, 0.12, 0.18); },
    good: function () { note(659, 0, 0.35, 0.3); note(988, 0.09, 0.35, 0.28); note(1319, 0.18, 0.6, 0.26); },
    great: function () { note(784, 0, 0.3, 0.28); note(988, 0.08, 0.3, 0.26); note(1175, 0.16, 0.3, 0.26); note(1568, 0.24, 0.7, 0.24); },
    // gentle « bloop-bloop », soft and low, never a buzzer
    oops: function () { glide(440, 330, 0, 0.22, 0.16); glide(392, 294, 0.2, 0.28, 0.13); },
    flip: function () { whoosh(0, 0.16, 0.12); },
    match: function () { note(880, 0, 0.3, 0.22); note(1320, 0.1, 0.45, 0.2); },
    win: function () {
      [[523, 0], [659, 0.14], [784, 0.28], [1047, 0.42], [784, 0.62], [1047, 0.76]].forEach(function (n, i) {
        note(n[0], n[1], i === 5 ? 0.9 : 0.32, 0.26);
      });
    },
    sparkle: function () { note(1760, 0, 0.18, 0.08); note(2349, 0.06, 0.2, 0.07); note(2637, 0.12, 0.3, 0.06); }
  };

  function stop(channel) {
    var a = channels[channel];
    if (a) { try { a.pause(); a.currentTime = 0; } catch (e) { /* ignore */ } }
    if (channel === 'voice' && window.speechSynthesis) { try { speechSynthesis.cancel(); } catch (e) { /* ignore */ } }
  }

  function playFile(url, channel) {
    channel = channel || 'fx';
    if (!enabled || !url) return Promise.resolve();
    stop(channel);
    var a = new Audio(url);
    channels[channel] = a;
    return new Promise(function (resolve) {
      a.addEventListener('ended', resolve);
      a.addEventListener('error', resolve);
      var p = a.play();
      if (p && p.catch) p.catch(resolve);
    });
  }

  // Device voice as a last resort when no recording exists.
  function speakTTS(text) {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return Promise.resolve();
    return new Promise(function (resolve) {
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'fr-FR'; u.rate = 0.85;
      var fr = speechSynthesis.getVoices().filter(function (v) { return /^fr/i.test(v.lang); })[0];
      if (fr) u.voice = fr;
      u.onend = resolve; u.onerror = resolve;
      speechSynthesis.speak(u);
      setTimeout(resolve, 4000);
    });
  }

  PR.audio = {
    unlock: unlock,
    sfx: function (name) { unlock(); if (SFX[name]) SFX[name](); },
    // Say a French word or phrase (uses the recording when available).
    say: function (text) {
      if (!enabled) return Promise.resolve();
      var file = PR.voices && PR.voices[text];
      if (file) return playFile(file, 'voice');
      return speakTTS(text);
    },
    hasVoice: function (text) { return !!(PR.voices && PR.voices[text]); },
    animal: function (id) {
      var s = PR.sounds && PR.sounds[id];
      return s ? playFile(s.file, 'animal') : Promise.resolve();
    },
    hasAnimal: function (id) { return !!(PR.sounds && PR.sounds[id]); },
    stopAll: function () { Object.keys(channels).forEach(stop); },
    isOn: function () { return enabled; },
    setOn: function (on) { enabled = on; PR.settings.set('sound', on); if (!on) PR.audio.stopAll(); }
  };
})();
