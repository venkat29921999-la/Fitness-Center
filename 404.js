/* ==========================================================================
   STACKLY ATHLETIC CLUB — 404 page script (standalone)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- GO TO PREVIOUS PAGE ----------------
     Uses browser history when there's somewhere to go back to
     (and that history isn't just this same 404 page on loop).
     Falls back to the homepage when there's no usable history —
     e.g. the visitor landed here directly from a bookmark or search engine. */
  const nfGoBack = document.getElementById('nfGoBack');
  if (nfGoBack) {
    nfGoBack.addEventListener('click', () => {
      const cameFromSameSite = document.referrer && document.referrer.indexOf(window.location.origin) === 0;
      if (window.history.length > 1 && cameFromSameSite) {
        window.history.back();
      } else {
        window.location.href = 'index.html';
      }
    });
  }

  /* ---------------- MAGNETIC HOVER ON BUTTONS (desktop only) ---------------- */
  const nfIsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (nfIsFinePointer) {
    document.querySelectorAll('.nf-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35 - 3}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ---------------- SLIGHT RANDOM DRIFT VARIATION ON FLOATING ICONS ----------------
     Keeps the icon field from feeling too mechanically identical. */
  document.querySelectorAll('.nf-float-icons i').forEach(icon => {
    const jitter = (Math.random() * 1.4 - 0.7).toFixed(2);
    icon.style.animationDuration = `calc(${getComputedStyle(icon).getPropertyValue('--fd') || '10s'} + ${jitter}s)`;
  });

});