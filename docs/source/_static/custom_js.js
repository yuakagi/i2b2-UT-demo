(function () {
  // Prefer the inner content area as the host for the sticky bar
  const content = document.querySelector('.wy-nav-content .rst-content');
  if (!content) return;

  // Build & insert the bar as the very first child of .rst-content
  const bar = document.createElement('div');
  bar.className = 'current-section-bar';
  const link = document.createElement('a');
  bar.appendChild(link);
  content.prepend(bar);

  // Choose which heading levels define “sections”
  const headings = Array.from(content.querySelectorAll('h2, h3'));
  if (!headings.length) return;

  // Ensure each heading has an ID (so the bar can link to it)
  headings.forEach((h, i) => {
    if (!h.id) {
      h.id = 'hdr-' + i + '-' +
        (h.textContent || 'untitled').trim()
        .toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    }
  });

  // Helper to read CSS vars
  const cssVar = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '0px';

  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  // IntersectionObserver tuned so the “top band” sits just below your sticky navbar
  const rootMarginForViewport = () => {
    const top = isMobile() ? cssVar('--sticky-offset-mobile') : cssVar('--sticky-offset-desktop');
    // top right bottom left — negative bottom narrows the band from below
    return `${top} 0px -70% 0px`;
  };

  let currentId = null;

  function setCurrent(h) {
    const text = (h.textContent || '').trim();
    if (text && h.id !== currentId) {
      currentId = h.id;
      link.textContent = text;
      link.href = '#' + currentId;
      bar.style.display = 'block';
    }
  }

  // Show the first heading immediately (so you see the bar even before scrolling)
  setCurrent(headings[0]);

  // Observe headings to update the bar as you scroll
  let io = null;
  function buildObserver() {
    if (io) io.disconnect();
    io = new IntersectionObserver((entries) => {
      // Pick the heading nearest the top within our band
      const vis = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) setCurrent(vis.target);
    }, {
      root: null,
      rootMargin: rootMarginForViewport(),
      threshold: [0, 1]
    });
    headings.forEach(h => io.observe(h));
  }

  buildObserver();
  // Rebalance on resize/orientation to keep iOS happy
  window.addEventListener('resize', buildObserver);
  window.addEventListener('orientationchange', buildObserver);

  // Optional smooth scroll when tapping the bar
  bar.addEventListener('click', (e) => {
    if (e.target === link && currentId) {
      const target = document.getElementById(currentId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + currentId);
      }
    }
  });
})();
