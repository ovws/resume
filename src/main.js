/**
 * Deluxe Symmetrical 100vh Timeline Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM References
  const timelineWrapper = document.getElementById('timeline-wrapper');
  const timelineViewport = document.getElementById('timeline-viewport');
  const timelineSvg = document.getElementById('timeline-svg');
  const svgAxis = document.getElementById('svg-timeline-axis');
  const svgAxisGlow = document.getElementById('svg-timeline-axis-glow');
  const svgConnectors = document.getElementById('svg-connectors');
  const svgDots = document.getElementById('svg-dots');
  const cardsContainer = document.getElementById('cards-container');
  const cardWrappers = document.querySelectorAll('.card-wrapper');
  const navBtns = document.querySelectorAll('.nav-node-btn');
  const pdfBtn = document.getElementById('btn-pdf');

  // Drag State
  let isDown = false;
  let startX = 0;
  let initialScrollLeft = 0;

  /* --------------------------------------------------------------------------
     1. Vector Axis Line & Connectors (Symmetrical Geometry)
     -------------------------------------------------------------------------- */
  function renderTimelineVectors() {
    if (!timelineWrapper || !timelineSvg) return;

    const totalWidth = timelineViewport.offsetWidth || 2200;
    const wrapperHeight = timelineWrapper.clientHeight || timelineWrapper.offsetHeight || 380;
    const axisY = wrapperHeight > 0 ? wrapperHeight / 2 : 190;

    timelineSvg.setAttribute('viewBox', `0 0 ${totalWidth} ${wrapperHeight}`);
    
    if (svgAxis) {
      svgAxis.setAttribute('x1', '0');
      svgAxis.setAttribute('y1', axisY);
      svgAxis.setAttribute('x2', totalWidth);
      svgAxis.setAttribute('y2', axisY);
    }

    if (svgAxisGlow) {
      svgAxisGlow.setAttribute('x1', '0');
      svgAxisGlow.setAttribute('y1', axisY);
      svgAxisGlow.setAttribute('x2', totalWidth);
      svgAxisGlow.setAttribute('y2', axisY);
    }

    svgConnectors.innerHTML = '';
    svgDots.innerHTML = '';

    cardWrappers.forEach((node, idx) => {
      const isTopCard = node.classList.contains('card-top');
      const dotX = node.offsetLeft + node.offsetWidth / 2;
      const dotY = axisY; // Centered on timeline axis!

      // Top cards bottom edge sits at (axisY - 28px)
      // Bottom cards top edge sits at (axisY + 28px)
      const cardEdgeY = isTopCard ? axisY - 28 : axisY + 28;

      // Vertical dashed connector line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', dotX);
      line.setAttribute('y1', dotY);
      line.setAttribute('x2', dotX);
      line.setAttribute('y2', cardEdgeY);
      line.setAttribute('stroke', idx === 3 ? '#2563eb' : idx === 0 ? '#d97706' : '#9ca3af');
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('stroke-dasharray', '3 3');
      svgConnectors.appendChild(line);

      // Node Dot Group centered EXACTLY on axis (dotX, axisY)
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'svg-dot-group');
      g.setAttribute('data-index', idx);

      const color = idx === 0 ? '#d97706' : idx === 3 ? '#2563eb' : '#0284c7';

      // Outer circle
      const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      outerCircle.setAttribute('cx', dotX);
      outerCircle.setAttribute('cy', dotY);
      outerCircle.setAttribute('r', '9.5');
      outerCircle.setAttribute('fill', '#ffffff');
      outerCircle.setAttribute('stroke', color);
      outerCircle.setAttribute('stroke-width', '2.5');
      outerCircle.setAttribute('style', 'filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));');

      // Inner dot
      const innerDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      innerDot.setAttribute('cx', dotX);
      innerDot.setAttribute('cy', dotY);
      innerDot.setAttribute('r', '4');
      innerDot.setAttribute('fill', color);

      g.appendChild(outerCircle);
      g.appendChild(innerDot);

      // Hover spotlight
      g.addEventListener('mouseenter', () => {
        cardsContainer.classList.add('has-active');
        cardWrappers.forEach(n => n.classList.remove('is-active'));
        node.classList.add('is-active');
      });

      g.addEventListener('mouseleave', () => {
        cardsContainer.classList.remove('has-active');
        node.classList.remove('is-active');
      });

      svgDots.appendChild(g);
    });
  }

  renderTimelineVectors();
  window.addEventListener('load', renderTimelineVectors);
  setTimeout(renderTimelineVectors, 100);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderTimelineVectors, 80);
  });

  /* --------------------------------------------------------------------------
     2. Instant Drag-to-Scroll (Stops Instantly Wherever Released)
     -------------------------------------------------------------------------- */
  timelineWrapper.addEventListener('mousedown', (e) => {
    if (e.target.closest('a, button, .kbg-card')) return;
    isDown = true;
    startX = e.pageX - timelineWrapper.offsetLeft;
    initialScrollLeft = timelineWrapper.scrollLeft;
  });

  timelineWrapper.addEventListener('mouseleave', () => {
    isDown = false;
  });

  timelineWrapper.addEventListener('mouseup', () => {
    isDown = false;
  });

  timelineWrapper.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - timelineWrapper.offsetLeft;
    const walk = (x - startX) * 1.3;
    timelineWrapper.scrollLeft = initialScrollLeft - walk;
  });

  // Wheel Horizontal Scroll
  timelineWrapper.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      timelineWrapper.scrollLeft += e.deltaY * 0.9;
      updateActiveNavOnScroll();
    }
  }, { passive: false });

  timelineWrapper.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });

  function updateActiveNavOnScroll() {
    const scrollPos = timelineWrapper.scrollLeft;
    const wrapperWidth = timelineWrapper.offsetWidth;
    const centerPos = scrollPos + wrapperWidth / 2;

    let closestIdx = 0;
    let minDistance = Infinity;

    cardWrappers.forEach((node, idx) => {
      const nodeCenter = node.offsetLeft + node.offsetWidth / 2;
      const distance = Math.abs(centerPos - nodeCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = idx;
      }
    });

    navBtns.forEach((btn, idx) => {
      if (idx === closestIdx) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. Spotlight Focus Mode & Navigation
     -------------------------------------------------------------------------- */
  cardWrappers.forEach((node) => {
    node.addEventListener('mouseenter', () => {
      cardsContainer.classList.add('has-active');
      cardWrappers.forEach(n => n.classList.remove('is-active'));
      node.classList.add('is-active');
    });

    node.addEventListener('mouseleave', () => {
      cardsContainer.classList.remove('has-active');
      node.classList.remove('is-active');
    });
  });

  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetIdx = parseInt(btn.getAttribute('data-target'), 10);
      const targetNode = document.getElementById(`node-${targetIdx}`);
      if (!targetNode) return;

      const targetScrollLeft = targetNode.offsetLeft - (timelineWrapper.offsetWidth / 2) + (targetNode.offsetWidth / 2);
      timelineWrapper.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
    });
  });

  if (pdfBtn) {
    pdfBtn.addEventListener('click', () => window.print());
  }
});
