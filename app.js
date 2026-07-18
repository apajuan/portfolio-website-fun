/* ============================================================
   Apa Dilag — /fun
   theme toggle (shared 'apa-theme' key with the main site) +
   hero canvas: letters drifting up out of the typing test below.
   ============================================================ */

(function () {
  'use strict';

  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------------- theme ---------------- */

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    $$('[data-theme-toggle]').forEach(function (btn) {
      btn.textContent = theme === 'dark' ? 'Light' : 'Dark';
    });
  }

  (function initTheme() {
    var stored = null;
    try { stored = localStorage.getItem('apa-theme'); } catch (e) {}
    var theme = stored;
    if (theme !== 'light' && theme !== 'dark') theme = 'light'; // same default as the main site
    applyTheme(theme);

    $$('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem('apa-theme', next); } catch (e) {}
        refreshInk(); // repaint drift glyphs in the new palette
      });
    });
  })();

  /* ---------------- drifting glyphs ---------------- */

  var canvas = document.querySelector('[data-drift]');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var CHARS = 'abcdefghijklmnopqrstuvwxyz';
  var glyphs = [];
  var ink = { faint: '#6e786c', accent: '#7fb487', err: '#d9706b' };
  var W = 0, H = 0, dpr = 1, rafId = 0;

  function refreshInk() {
    var cs = getComputedStyle(document.documentElement);
    ink.faint = cs.getPropertyValue('--faint').trim() || ink.faint;
    ink.accent = cs.getPropertyValue('--accent').trim() || ink.accent;
    ink.err = cs.getPropertyValue('--err').trim() || ink.err;
    if (reduced.matches) drawFrame(); // static frame needs an explicit repaint
  }

  function makeGlyph(anywhere) {
    var roll = Math.random();
    return {
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + 20,
      vy: 0.12 + Math.random() * 0.3,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.004 + Math.random() * 0.008,
      size: 11 + Math.random() * 5,
      alpha: 0.25 + Math.random() * 0.4,
      ch: CHARS[Math.floor(Math.random() * CHARS.length)],
      // mostly quiet, a few accents, the rare typo that slipped upstream
      tone: roll < 0.82 ? 'faint' : roll < 0.96 ? 'accent' : 'err'
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var count = Math.max(14, Math.round(W / 46));
    glyphs = [];
    for (var i = 0; i < count; i++) glyphs.push(makeGlyph(true));
    if (reduced.matches) drawFrame();
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < glyphs.length; i++) {
      var g = glyphs[i];
      ctx.globalAlpha = g.alpha * Math.min(1, g.y / 80); // ease out near the top edge
      ctx.fillStyle = ink[g.tone];
      ctx.font = g.size + 'px "IBM Plex Mono", monospace';
      ctx.fillText(g.ch, g.x + Math.sin(g.sway) * 10, g.y);
    }
    ctx.globalAlpha = 1;
  }

  function tick() {
    for (var i = 0; i < glyphs.length; i++) {
      var g = glyphs[i];
      g.y -= g.vy;
      g.sway += g.swaySpeed;
      if (g.y < -20) glyphs[i] = makeGlyph(false);
    }
    drawFrame();
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    cancelAnimationFrame(rafId);
    if (reduced.matches) { drawFrame(); return; } // scattered but still
    rafId = requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  if (reduced.addEventListener) reduced.addEventListener('change', start);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) cancelAnimationFrame(rafId);
    else start();
  });

  refreshInk();
  resize();
  start();
})();
