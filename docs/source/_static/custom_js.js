(function () {
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

  // Choose heading levels
  const headings = Array.from(body.querySelectorAll('h2, h3'));
  if (headings.length === 0) return;

  // Ensure IDs
  headings.forEach((h, i) => {
    if (!h.id) {
      h.id = 'hdr-' + i + '-' + (h.textContent || 'untitled')
        .trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    }
  });

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '0px';
  }
  function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  }
  function rootMarginForViewport() {
    const top = isMobile() ? cssVar('--sticky-offset-mobile') : cssVar('--sticky-offset-desktop');
    // top right bottom left
    return `${top} 0px -70% 0px`;
  }

  let currentId = null;
  let io = null;

  function buildObserver() {
    if (io) io.disconnect();
    io = new IntersectionObserver((entries) => {
      // pick the closest visible heading near the top
      const vis = entries.filter(e => e.isIntersecting)
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
    }, {
      root: null,
      rootMargin: rootMarginForViewport(),
      threshold: [0, 1]
    });
    headings.forEach(h => io.observe(h));
  }

  buildObserver();
  window.addEventListener('resize', buildObserver);
  window.addEventListener('orientationchange', buildObserver);

  // Optional smooth scroll
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
})();
