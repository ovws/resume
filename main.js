/**
 * Deluxe Symmetrical 100vh Timeline Engine with i18n & Rich Aesthetic Polish
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
  const langBtn = document.getElementById('btn-lang');

  // Language State: Default 'zh', persists in localStorage
  let currentLang = localStorage.getItem('lang') || 'zh';

  // i18n Translation Dictionary
  const i18n = {
    zh: {
      name: "齐文崧",
      status: "运维 & 云原生",
      subRowHtml: `<span>男 · 2002.09</span><span class="dot-divider">•</span><span>深圳</span><span class="dot-divider">•</span><span>重庆邮电大学移通学院 · 计算机科学</span>`,
      btnBlog: "个人博客",
      btnPdf: "导出 PDF",
      btnLang: "English",
      nodes: [
        {
          tag: "教育经历",
          title: "重庆移通学院",
          role: "计算机科学与技术 · 专科",
          desc: "GPA 3.85，前 10%。深入学习数据结构、操作系统及计算机网络。",
          pills: ["计算机科学", "GPA 3.85 (前10%)"],
          nav: "重庆移通学院"
        },
        {
          tag: "工作经历",
          title: "深圳市平方科技股份有限公司",
          role: "运维工程师",
          desc: "负责现场网络部署、软件调试、VPN、数据库及系统故障处理。",
          pills: ["现场网络部署", "软件调试", "VPN / 数据库", "故障处理"],
          nav: "平方科技"
        },
        {
          tag: "工作经历",
          title: "河南龙翼信息技术有限公司",
          role: "云运维工程师",
          desc: "负责私有云、Linux、虚拟化、容器、网络、安全、监控和自动化运维。",
          pills: ["私有云 / Linux", "虚拟化 & 容器", "网络与安全", "自动化运维"],
          nav: "龙翼信息"
        },
        {
          tag: "核心经历",
          title: "腾讯",
          role: "运维工程师",
          desc: "负责容器平台、流水线平台、镜像管理平台，以及监控告警、变更发布和故障排查。",
          pills: ["容器平台", "CI/CD 流水线", "镜像管理", "平台稳定性"],
          nav: "腾讯"
        }
      ],
      print: {
        name: "齐文崧 - 个人简历",
        meta: "深圳 | 电话: 13203788795 | 邮箱: work@qiwensong.com | 博客: https://www.qiwensong.com/ | GitHub: https://github.com/ovws",
        sectionTitle: "教育与工作履历"
      }
    },
    en: {
      name: "WenSong Qi", // Pure English name without Chinese in parentheses!
      status: "DevOps & Cloud Native",
      subRowHtml: `<span>Male · Sept 2002</span><span class="dot-divider">•</span><span>Shenzhen, China</span><span class="dot-divider">•</span><span>Chongqing College of Mobile Telecommunications · Computer Science</span>`,
      btnBlog: "Blog",
      btnPdf: "Export PDF",
      btnLang: "中文",
      nodes: [
        {
          tag: "Education",
          title: "Chongqing College of Mobile Telecommunications",
          role: "Computer Science and Technology · Associate Degree",
          desc: "GPA 3.85 (Top 10%). Deep study in computer science fundamentals, data structures, operating systems, and networking.",
          pills: ["Computer Science", "GPA 3.85 (Top 10%)"],
          nav: "CQ Mobile Telecom"
        },
        {
          tag: "Work Experience",
          title: "Shenzhen Pingfang Technology Co., Ltd.",
          role: "Operations & Maintenance Engineer",
          desc: "Responsible for site network deployment, software debugging, VPN, database maintenance, and system troubleshooting.",
          pills: ["Network Deployment", "Software Debugging", "VPN / Database", "Troubleshooting"],
          nav: "Pingfang Tech"
        },
        {
          tag: "Work Experience",
          title: "Henan Longyi Information Technology Co., Ltd.",
          role: "Cloud Operations Engineer",
          desc: "Responsible for private cloud platforms, Linux, virtualization, containers, network security, and automated ops.",
          pills: ["Private Cloud / Linux", "Virtualization & Containers", "Network & Security", "Automated Ops"],
          nav: "Longyi Info"
        },
        {
          tag: "Core Experience",
          title: "Tencent",
          role: "Operations & Maintenance Engineer",
          desc: "Responsible for container platforms, CI/CD pipelines, image registry platforms, monitoring alerting, and incident response.",
          pills: ["Container Platform", "CI/CD Pipeline", "Image Registry", "Platform Stability"],
          nav: "Tencent"
        }
      ],
      print: {
        name: "WenSong Qi - Resume",
        meta: "Shenzhen, China | Tel: 13203788795 | Email: work@qiwensong.com | Blog: https://www.qiwensong.com/ | GitHub: https://github.com/ovws",
        sectionTitle: "Education & Work Experience"
      }
    }
  };

  function applyLanguage(lang) {
    const data = i18n[lang] || i18n.zh;

    // Header
    const heroName = document.getElementById('hero-name');
    const heroStatus = document.getElementById('hero-status');
    const heroSubRow = document.getElementById('hero-sub-row');
    const btnBlogText = document.getElementById('btn-blog-text');
    const btnPdfText = document.getElementById('btn-pdf-text');
    const btnLangText = document.getElementById('btn-lang-text');

    if (heroName) heroName.textContent = data.name;
    if (heroStatus) heroStatus.textContent = data.status;
    if (heroSubRow) heroSubRow.innerHTML = data.subRowHtml;
    if (btnBlogText) btnBlogText.textContent = data.btnBlog;
    if (btnPdfText) btnPdfText.textContent = data.btnPdf;
    if (btnLangText) btnLangText.textContent = data.btnLang;

    // Cards & Nav
    data.nodes.forEach((nodeData, idx) => {
      const tagEl = document.getElementById(`card-${idx}-tag`);
      const titleEl = document.getElementById(`card-${idx}-title`);
      const roleEl = document.getElementById(`card-${idx}-role`);
      const descEl = document.getElementById(`card-${idx}-desc`);
      const pillsEl = document.getElementById(`card-${idx}-pills`);
      const navEl = document.getElementById(`nav-btn-${idx}`);

      if (tagEl) tagEl.textContent = nodeData.tag;
      if (titleEl) titleEl.textContent = nodeData.title;
      if (roleEl) roleEl.textContent = nodeData.role;
      if (descEl) descEl.textContent = nodeData.desc;
      if (navEl) navEl.textContent = nodeData.nav;

      if (pillsEl) {
        pillsEl.innerHTML = '';
        nodeData.pills.forEach(pillText => {
          const span = document.createElement('span');
          span.className = `pill pill-node-${idx}`;
          span.textContent = pillText;
          pillsEl.appendChild(span);
        });
      }

      // Print template
      const printTitle = document.getElementById(`print-item-${idx}-title`);
      const printRole = document.getElementById(`print-item-${idx}-role`);
      const printDesc = document.getElementById(`print-item-${idx}-desc`);

      if (printTitle) printTitle.textContent = nodeData.title;
      if (printRole) printRole.textContent = nodeData.role;
      if (printDesc) printDesc.textContent = nodeData.desc;
    });

    // Print Header
    const printName = document.getElementById('print-name');
    const printMeta = document.getElementById('print-meta');
    const printSec = document.getElementById('print-section-title');

    if (printName) printName.textContent = data.print.name;
    if (printMeta) printMeta.textContent = data.print.meta;
    if (printSec) printSec.textContent = data.print.sectionTitle;

    // Recalculate vector lines after DOM text updates
    setTimeout(renderTimelineVectors, 50);
  }

  // Toggle Language Handler
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      currentLang = currentLang === 'zh' ? 'en' : 'zh';
      localStorage.setItem('lang', currentLang);
      applyLanguage(currentLang);
    });
  }

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

    const colors = ['#f59e0b', '#0d9488', '#0284c7', '#2563eb'];

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
      line.setAttribute('stroke', colors[idx] || '#2563eb');
      line.setAttribute('stroke-width', '1.8');
      line.setAttribute('stroke-dasharray', '4 4');
      svgConnectors.appendChild(line);

      // Node Dot Group centered EXACTLY on axis (dotX, axisY)
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'svg-dot-group');
      g.setAttribute('data-index', idx);

      const color = colors[idx] || '#2563eb';

      // Outer circle
      const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      outerCircle.setAttribute('cx', dotX);
      outerCircle.setAttribute('cy', dotY);
      outerCircle.setAttribute('r', '10');
      outerCircle.setAttribute('fill', '#ffffff');
      outerCircle.setAttribute('stroke', color);
      outerCircle.setAttribute('stroke-width', '3');
      outerCircle.setAttribute('style', 'filter: drop-shadow(0 2px 6px rgba(0,0,0,0.12));');

      // Inner dot
      const innerDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      innerDot.setAttribute('cx', dotX);
      innerDot.setAttribute('cy', dotY);
      innerDot.setAttribute('r', '4.5');
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

  // Initial i18n Application & Vector Render
  applyLanguage(currentLang);
  renderTimelineVectors();
  window.addEventListener('load', renderTimelineVectors);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderTimelineVectors, 80);
  });

  /* --------------------------------------------------------------------------
     2. Instant Drag-to-Scroll (Stops Instantly Wherever Released)
     -------------------------------------------------------------------------- */
  let isDown = false;
  let startX = 0;
  let initialScrollLeft = 0;

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
