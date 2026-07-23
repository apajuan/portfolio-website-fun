/* ============================================================
   Bananaaah — progressive enhancement only.
   The page is fully rendered HTML/CSS; this just adds the two
   interactive touches the prototype had, in plain vanilla JS:
     - hover style swaps (ported from the old style-hover attr)
     - tap/click the logo to spin it
   ============================================================ */

(function () {
  'use strict';

  // hover: append the data-hover declarations on enter, restore on leave.
  // (mirrors how the original swapped inline styles, so it beats the
  // element's own inline base style without needing !important.)
  document.querySelectorAll('[data-hover]').forEach(function (el) {
    var base = el.getAttribute('style') || '';
    var hover = el.getAttribute('data-hover');
    el.addEventListener('mouseenter', function () { el.setAttribute('style', base + ';' + hover); });
    el.addEventListener('mouseleave', function () { el.setAttribute('style', base); });
  });

  // logo: replay the spin360 keyframe on click / Enter / Space
  document.querySelectorAll('[data-spin]').forEach(function (el) {
    function spin() {
      el.style.animation = 'none';
      void el.offsetWidth;           // force reflow so the animation restarts
      el.style.animation = 'spin360 .7s ease';
    }
    el.addEventListener('click', spin);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); spin(); }
    });
  });
})();
