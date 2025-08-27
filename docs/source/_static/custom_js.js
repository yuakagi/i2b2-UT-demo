// _static/custom_js.js
document.addEventListener('DOMContentLoaded', () => {
  const content = document.querySelector('.wy-nav-content');
  const body = document.querySelector('.wy-nav-content .rst-content');
  if (!content || !body) return;

  // Insert the floating bar
  const bar = document.createElement('div');
  bar.className = 'current-section-bar';
  bar.style.display = 'none';
  const link = document.createElement('a');
  bar.appendChild(link);
  content.prepend(bar);

  // Which headings to track
  const headings = Array.from(body.querySelectorAll('h2, h3'));
  if (!headings.length) return;

  // Ensure IDs
  headings.forEach((h, i) => {
    if (!h.id) {
      h.id = 'hdr-' + i + '-' + (h.textContent || 'untitled')
        .trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    }
  });

  const cssVar = name =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '0px';
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
  const rootMarginForViewport = () => {
    const top = isMobile() ? cssVar('--sticky-offset-mobile') : cssVar('--sticky-offset-desktop');
    return `${top} 0px -70% 0px`;  // top/right/bottom/left
  };

  let currentId = null;
  let io;

  const buildObserver = () => {
    if (io) io.disconnect();
    io = new IntersectionObserver((entries) => {
      const vis = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) {
        const h = vis.target;
        const text = (h.textContent || '').trim();
        if (text && h.id !== currentId) {
          currentId = h.id;
          link.textContent = text;
          link.href = '#' + currentId;
          bar.style.display = 'block';
        }
      }
    }, { root: null, rootMargin: rootMarginForViewport(), threshold: [0, 1] });
    headings.forEach(h => io.observe(h));
  };

  buildObserver();
  window.addEventListener('resize', buildObserver);
  window.addEventListener('orientationchange', buildObserver);

  // Smooth scroll
  bar.addEventListener('click', (e) => {
    if (e.target === link) {
      const target = document.getElementById(currentId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + currentId);
      }
    }
  });
});
