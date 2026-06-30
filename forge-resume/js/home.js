document.addEventListener('DOMContentLoaded', () => {
  const fill = document.getElementById('scoreFill');
  const value = document.getElementById('scoreValue');
  if (!fill || !value) return;

  setTimeout(() => {
    fill.style.width = '87%';
    animateNumber(value, 0, 87, 1800);
  }, 600);

  function animateNumber(el, from, to, duration) {
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);
      el.textContent = current + '%';
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
});
