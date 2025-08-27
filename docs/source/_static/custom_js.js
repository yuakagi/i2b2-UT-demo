(function () {
  // Container with the page content in RTD theme:
  const content = document.querySelector('.wy-nav-content');
  if (!content) return;

  // Insert the floating bar at the very top of content
  const bar = document.createElement('div');
  bar.className = 'current-section-bar';
  const link = document.createElement('a');
  link.setAttribute('href', '#');   // will be updated dynamically
  bar.appendChild(link);
  content.prepend(bar);

  // Choose which heading levels define “sections”.
  // Common: h2 (sections) + h3 (subsections). Adjust if you prefer only h2.
  const headings = content.querySelectorAll('h2, h3');
  if (!headings.length) return;

  // Ensure all observed headings have IDs (for the link target)
  headings.forEach((h, i) => {
    if (!h.id) h.id = 'hdr-' + i + '-' + (h.textContent || 'untitled').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
  });

  // Compute top offset for intersection logic (match your sticky offsets)
  function getRootMargin() {
    // Negative bottom margin pushes the observation “top band”
    // We want the header to switch around the top of the viewport.
    // Use the larger (mobile/desktop) offset dynamically by checking viewport width:
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const px = getComputedStyle(document.documentElement)
      .getPropertyValue(isMobile ? '--sticky-offset-mobile' : '--sticky-offset-desktop')
      .trim() || '0px';
    // rootMargin syntax: top right bottom left
    return `${px} 0px -70% 0px`;
  }

  // Track the closest visible heading to the top band
  let currentId = null;
  const observer = new IntersectionObserver((entries) => {
    // Consider only headings that are intersecting the top band
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

    if (visible) {
      const h = visible.target;
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
    rootMargin: getRootMargin(),
    threshold: [0, 1.0]
  });

  headings.forEach(h => observer.observe(h));

  // Recompute rootMargin on resize/orientation change (iOS friendly)
  const rebalance = () => {
    observer.disconnect();
    headings.forEach(h => observer.observe(h));
  };
  window.addEventListener('resize', rebalance);
  window.addEventListener('orientationchange', rebalance);

  // Optional: clicking the bar scrolls to the current section (already a link).
  // If you prefer it to scroll *smoothly*:
  document.addEventListener('click', (e) => {
    if (e.target === link) {
      const target = document.getElementById(currentId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update hash for sharing
        history.replaceState(null, '', '#' + currentId);
      }
    }
  });
})();
