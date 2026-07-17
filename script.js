/* ================================================================
   Portfolio � scroll reveal, active nav, burger
   ================================================================ */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element && value != null) {
    element.textContent = value;
  }
}

function setHtml(selector, value) {
  const element = document.querySelector(selector);
  if (element && value != null) {
    element.innerHTML = value;
  }
}

function setAttr(selector, attribute, value) {
  const element = document.querySelector(selector);
  if (element && value != null) {
    element.setAttribute(attribute, value);
  }
}

function renderMarquee(items) {
  const track = document.querySelector('.hero-marquee__track');
  if (!track || !Array.isArray(items)) return;

  const groupMarkup = items
    .map((item) => `<span class="hero-marquee__item">${escapeHtml(item)}</span>`)
    .join('');

  track.innerHTML = `
    <div class="hero-marquee__group" aria-hidden="false">${groupMarkup}</div>
    <div class="hero-marquee__group" aria-hidden="true">${groupMarkup}</div>
  `;
}

function renderTagRow(items) {
  const row = document.querySelector('.tag-row');
  if (!row || !Array.isArray(items)) return;

  row.innerHTML = items.map((item) => `<span>${escapeHtml(item)}</span>`).join('');
}

function getEducationIconMarkup(label) {
  const normalizedLabel = String(label || '').trim().toLowerCase();

  if (normalizedLabel.includes('cert')) {
    return `
      <span class="edu-icon edu-icon--laptop" aria-label="Certifications">
        <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <rect x="11" y="10" width="26" height="18" rx="4"></rect>
          <path d="M8 33h32"></path>
          <path d="M17 37h14"></path>
          <path d="M19 20h10"></path>
          <path d="M24 16v8"></path>
        </svg>
      </span>
    `;
  }

  return `
    <span class="edu-icon edu-icon--college" aria-label="Education">
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path d="M7 19 24 10l17 9-17 9-17-9Z"></path>
        <path d="M13 22v9.5c0 1.2 5 4.5 11 4.5s11-3.3 11-4.5V22"></path>
        <path d="M39 21v10"></path>
        <circle cx="39" cy="33.5" r="2.5"></circle>
      </svg>
    </span>
  `;
}

function renderInterests(items) {
  const container = document.querySelector('.interests-timeline');
  if (!container || !Array.isArray(items)) return;
  const rows = [];
  items.forEach((item, gi) => {
    if (item.category) {
      rows.push(`<div class="interests-category">${escapeHtml(item.category)}</div>`);
    }
    (item.points || []).forEach((p, pi) => {
      const isFirst = gi === 0 && pi === 0;
      rows.push(`<div class="awards-item fade-up${isFirst ? '' : ' delay-' + Math.min(gi + pi, 3)}">${p}</div>`);
    });
    if (item.linkUrl) {
      // link intentionally hidden
    }
  });
  container.innerHTML = rows.join('');
}

function renderAwards(items) {
  const timeline = document.querySelector('.awards-timeline');
  if (!timeline || !Array.isArray(items)) return;
  timeline.innerHTML = items.map((item, i) => {
    const link = item.linkUrl
      ? `<a href="${escapeHtml(item.linkUrl)}" target="_blank" rel="noreferrer" class="awards-link">&ndash;&ndash; ${escapeHtml(item.linkText || 'See Here')}</a>`
      : item.linkText
        ? `<span class="awards-link awards-link--placeholder">&ndash;&ndash; ${escapeHtml(item.linkText)}</span>`
        : '';
    return `<div class="awards-item fade-up${i > 0 ? ' delay-' + Math.min(i, 3) : ''}">${item.html || escapeHtml(item.text || '')}${link ? ' ' + link : ''}</div>`;
  }).join('');
}

function renderEducation(items) {
  const list = document.querySelector('.edu-list');
  if (!list || !Array.isArray(items)) return;

  list.innerHTML = items
    .map((item) => {
      const bulletItems = Array.isArray(item.bullets) && item.bullets.length > 0
        ? `<ul class="edu-bullets">${item.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>`
        : (item.copy ? `<p>${escapeHtml(item.copy)}</p>` : '');

      const embedBlock = item.linkedinEmbed
        ? `
          <a
            class="edu-embed edu-embed--link"
            href="${escapeHtml(item.linkedinPostUrl || item.linkedinEmbed)}"
            target="_blank"
            rel="noreferrer"
            aria-label="Open LinkedIn post for ${escapeHtml(item.title)}"
          >
            <iframe
              src="${escapeHtml(item.linkedinEmbed)}"
              title="LinkedIn post preview for ${escapeHtml(item.title)}"
              loading="lazy"
              scrolling="no"
              allowfullscreen
            ></iframe>
          </a>
        `
        : '';

      return `
        <div class="edu-row">
          ${getEducationIconMarkup(item.label)}
          <div>
            <strong>${escapeHtml(item.title)}</strong>
            ${bulletItems}
            ${embedBlock}
          </div>
        </div>
      `;
    })
    .join('');
}

function renderCertifications(items) {
  const grid = document.querySelector('.certifications-grid');
  if (!grid || !Array.isArray(items)) return;

  const createCardMarkup = (item) => {
    const provider = String(item.title || '').toLowerCase().includes('google')
      ? 'Google'
      : String(item.title || '').toLowerCase().includes('azure') || String(item.title || '').toLowerCase().includes('microsoft')
        ? 'Microsoft'
        : 'Professional Certificate';

    const linkMarkup = item.linkedinUrl
      ? `
        <a class="cert-card__link" href="${escapeHtml(item.linkedinUrl)}" target="_blank" rel="noreferrer" aria-label="Open LinkedIn post for ${escapeHtml(item.title)}">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M14 5h5v5"></path>
            <path d="M10 14 19 5"></path>
            <path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"></path>
          </svg>
        </a>
      `
      : '';

    return `
      <article class="cert-card">
        <div class="cert-card__media">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)} certificate" loading="lazy">
        </div>
        <div class="cert-card__body">
          <p class="cert-card__eyebrow">${escapeHtml(provider)}</p>
          <h3 class="cert-card__title">${escapeHtml(item.title)}</h3>
          <div class="cert-card__footer">
            <span class="cert-card__meta">View credential</span>
            ${linkMarkup}
          </div>
        </div>
      </article>
    `;
  };

  grid.innerHTML = items.map(createCardMarkup).join('');
}

function renderExpertise(items) {
  const grid = document.querySelector('.expertise-grid');
  if (!grid || !Array.isArray(items)) return;

  grid.innerHTML = items
    .map((item, index) => {
      const delayClass = index === 0 ? '' : ` delay-${Math.min(index, 3)}`;
      const detailItems = Array.isArray(item.pills) ? item.pills : (item.bullets || []);
      const details = `<div class="tech-pill-row">${detailItems.map((detail) => `<span>${escapeHtml(detail)}</span>`).join('')}</div>`;

      return `
        <div class="e-card fade-up${delayClass}">
          <div class="e-card__num">${escapeHtml(item.number)}</div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.copy)}</p>
          ${details}
        </div>
      `;
    })
    .join('');
}

function renderCases(items) {
  const grid = document.querySelector('.cases-grid');
  if (!grid || !Array.isArray(items)) return;

  grid.innerHTML = items
    .map((item, index) => {
      const impactMarkup = item.impact
        ? `<p class="case-impact">${escapeHtml(item.impact)}</p>`
        : '';

      return `
      <button type="button" class="case-card fade-up${index % 2 === 0 ? '' : ' delay-1'}" data-case-index="${index}">
        <span class="case-tag">${escapeHtml(item.tag)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.copy)}</p>
        <div class="case-stack">${escapeHtml(item.stack)}</div>
        ${impactMarkup}
        <span class="case-cta"><i>Read More &#8599;</i></span>
      </button>
    `;
    })
    .join('');
}

function initializeCaseModal(caseItems) {
  const modal = document.getElementById('case-modal');
  const grid = document.querySelector('.cases-grid');
  if (!modal || !grid || !Array.isArray(caseItems)) return;

  const tag = document.getElementById('case-modal-tag');
  const title = document.getElementById('case-modal-title');
  const problem = document.getElementById('case-modal-problem');
  const solution = document.getElementById('case-modal-solution');
  const impact = document.getElementById('case-modal-impact');
  const closeSelectors = modal.querySelectorAll('[data-case-modal-close]');

  const setModalBlockContent = (element, value) => {
    if (!element) return;

    if (Array.isArray(value)) {
      element.innerHTML = `<ul class="case-modal__list">${value.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
      return;
    }

    element.innerHTML = `<p>${escapeHtml(value || '')}</p>`;
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  const openModal = (caseItem) => {
    if (!caseItem) return;

    tag.textContent = caseItem.tag || '';
    title.textContent = caseItem.title || '';
    setModalBlockContent(problem, caseItem.problem);
    setModalBlockContent(solution, caseItem.solution);
    setModalBlockContent(impact, caseItem.impactDetail || caseItem.impact);

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };

  grid.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-case-index]');
    if (!trigger) return;

    const caseIndex = Number(trigger.getAttribute('data-case-index'));
    openModal(caseItems[caseIndex]);
  });

  closeSelectors.forEach((element) => {
    element.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

function renderProjects(items) {
  const grid = document.querySelector('.projects-grid');
  if (!grid || !Array.isArray(items)) return;

  grid.innerHTML = items
    .map((item, index) => `
      <div class="p-card fade-up${index === 0 ? '' : ` delay-${Math.min(index, 2)}`}">
        <div class="p-card__top">
          <div class="p-card__dot">
            <svg viewBox="0 0 24 24" aria-hidden="true" class="p-card__dot-icon"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
          </div>
          <a href="${escapeHtml(item.href)}" target="_blank" rel="noreferrer" class="p-card__link">${escapeHtml(item.linkLabel)}</a>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.copy)}</p>
      </div>
    `)
    .join('');
}

function initializePublicationsCarousel() {
  const track    = document.querySelector('.pub-carousel__track');
  const viewport = document.querySelector('.pub-carousel__viewport');
  const prevBtn  = document.querySelector('.pub-carousel__btn--prev');
  const nextBtn  = document.querySelector('.pub-carousel__btn--next');
  const dotsWrap = document.querySelector('.pub-carousel__dots');
  if (!track || !viewport || !prevBtn || !nextBtn) return;

  let current = 0;

  function getPerPage() {
    if (window.innerWidth <= 640)  return 1;
    if (window.innerWidth <= 1100) return 2;
    return 3;
  }

  function buildDots(totalPages) {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = totalPages > 1
      ? Array.from({ length: totalPages }, (_, i) =>
          `<span class="pub-carousel__dot${i === 0 ? ' is-active' : ''}"></span>`
        ).join('')
      : '';
  }

  function go(page) {
    const perPage    = getPerPage();
    const totalCards = track.children.length;
    const totalPages = Math.ceil(totalCards / perPage);
    current = Math.max(0, Math.min(page, totalPages - 1));
    track.style.transform = `translateX(-${current * (viewport.offsetWidth + 18)}px)`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= totalPages - 1;
    if (dotsWrap) {
      dotsWrap.querySelectorAll('.pub-carousel__dot')
        .forEach((d, i) => d.classList.toggle('is-active', i === current));
    }
    const nav = document.querySelector('.pub-carousel__nav');
    if (nav) nav.style.display = totalPages <= 1 ? 'none' : '';
  }

  function rebuild() {
    const perPage    = getPerPage();
    const totalCards = track.children.length;
    buildDots(Math.ceil(totalCards / perPage));
    current = 0;
    go(0);
  }

  prevBtn.addEventListener('click', () => go(current - 1));
  nextBtn.addEventListener('click', () => go(current + 1));

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(rebuild, 150);
  });

  rebuild();
}

function getLinkedInEmbedUrl(href) {
  if (!href || !href.includes('linkedin.com/posts')) return null;
  const match = href.match(/activity[_-](\d+)/);
  return match ? `https://www.linkedin.com/embed/feed/update/urn:li:activity:${match[1]}` : null;
}

function renderPublications(items) {
  const grid = document.querySelector('.publications-grid');
  if (!grid || !Array.isArray(items)) return;

  grid.innerHTML = items.map((item, index) => {
    const delay = index === 0 ? '' : ` delay-${Math.min(index, 3)}`;
    const embedUrl = getLinkedInEmbedUrl(item.href);

    if (embedUrl) {
      return `
        <div class="pub-card pub-card--embed fade-up${delay}">
          <div class="pub-card__header">
            <span class="pub-tag">${escapeHtml(item.tag || 'BLOG')}</span>
            <h3>${escapeHtml(item.title)}</h3>
          </div>
          <div class="pub-card__embed">
            <iframe
              src="${embedUrl}"
              frameborder="0"
              scrolling="no"
              allowfullscreen
              title="${escapeHtml(item.title)}"
            ></iframe>
          </div>
          <a href="${escapeHtml(item.href)}" target="_blank" rel="noreferrer" class="pub-card__cta pub-card__cta--link">
            &#8599; Read on LinkedIn
          </a>
        </div>
      `;
    }

    return `
      <a href="${escapeHtml(item.href || '#')}" target="_blank" rel="noreferrer" class="pub-card fade-up${delay}">
        <span class="pub-tag">${escapeHtml(item.tag || 'BLOG')}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.copy || '')}</p>
        <span class="pub-card__cta">Open blog &#8599;</span>
      </a>
    `;
  }).join('');
}

function populateTextContent(data) {
  if (!data) return;

  if (data.site?.title) {
    document.title = data.site.title;
  }

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && data.site?.description) {
    metaDescription.setAttribute('content', data.site.description);
  }

  setText('.header-profile__name', data.header?.name);
  setAttr('.header-profile', 'href', data.header?.homeHref);
  setAttr('.header-profile', 'aria-label', data.header?.homeAriaLabel);
  setAttr('.burger', 'aria-label', data.header?.menuAriaLabel);

  setText('.mobile-item[data-section="hero"]', data.mobileMenu?.home);
  setText('.mobile-item[data-section="expertise"]', data.mobileMenu?.expertise);
  setText('.mobile-item[data-section="cases"]', data.mobileMenu?.cases);
  setText('.mobile-item[data-section="publications"]', data.mobileMenu?.publications);
  setText('.mobile-item[data-section="certifications"]', data.mobileMenu?.certifications);
  setText('.mobile-item[data-section="education"]', data.mobileMenu?.education);
  setText('.mobile-item[data-section="awards"]', data.mobileMenu?.awards);
  setText('.mobile-item[data-section="projects"]', data.mobileMenu?.projects);
  setText('.mobile-item[data-section="contact"]', data.mobileMenu?.contact);

  setHtml('#hero .heading__light', data.hero?.headingLight);
  setHtml('#hero .heading__bold', data.hero?.headingBoldHtml);
  setText('#hero .tagline', data.hero?.tagline);
  setText('#hero .hero-body1', data.hero?.body1);
  setText('#hero .hero-body2', data.hero?.body);
  setAttr('.hero-marquee', 'aria-label', data.hero?.marqueeAriaLabel);
  renderMarquee(data.hero?.marqueeItems);
  setAttr('.hero-video', 'src', data.hero?.videoSrc);
  setAttr('.btn-resume', 'href', data.hero?.resumeHref);
  setText('.btn-resume > span:first-child', data.hero?.resumeLabel);
  setAttr('#hero .btn-outline', 'href', data.hero?.connectHref);
  setText('#hero .btn-outline', data.hero?.connectLabel);

  setText('.section-sidebar__link[data-section="hero"]', data.sidebar?.home);
  setText('.section-sidebar__link[data-section="expertise"]', data.sidebar?.expertise);
  setText('.section-sidebar__link[data-section="cases"]', data.sidebar?.cases);
  setText('.section-sidebar__link[data-section="publications"]', data.sidebar?.publications);
  setText('.section-sidebar__link[data-section="certifications"]', data.sidebar?.certifications);
  setText('.section-sidebar__link[data-section="education"]', data.sidebar?.education);
  setText('.section-sidebar__link[data-section="awards"]', data.sidebar?.awards);
  setText('.section-sidebar__link[data-section="projects"]', data.sidebar?.projects);
  setText('.section-sidebar__link[data-section="contact"]', data.sidebar?.contact);

  setText('#education .eyebrow', data.about?.eyebrow);
  renderEducation(data.about?.educationItems);

  setText('#awards .eyebrow', data.awards?.eyebrow);
  setText('#awards .heading__bold', data.awards?.headingBold);
  renderAwards(data.awards?.items);
  setText('#certifications .about-certifications__eyebrow', data.about?.certificationsEyebrow);
  renderCertifications(data.about?.certifications);

  setText('#expertise .eyebrow', data.expertise?.eyebrow);
  setText('#expertise .heading__light', data.expertise?.headingLight);
  setText('#expertise .heading__bold', data.expertise?.headingBold);
  setText('#expertise .tagline', data.expertise?.tagline);
  setText('#expertise .expertise-body--primary', data.expertise?.body1);
  setHtml('#expertise .expertise-body--secondary', data.expertise?.body2);
  renderExpertise(data.expertise?.cards);

  setText('#cases .eyebrow', data.cases?.eyebrow);
  setText('#cases .heading__light', data.cases?.headingLight);
  setText('#cases .heading__bold', data.cases?.headingBold);
  setText('#cases .cases-body', data.cases?.body);
  setText('#cases .tagline', data.cases?.tagline);
  renderCases(data.cases?.cards);
  initializeCaseModal(data.cases?.cards);

  setText('#projects .eyebrow', data.projects?.eyebrow);
  setText('#projects .heading__light', data.projects?.headingLight);
  setText('#projects .heading__bold', data.projects?.headingBold);
  setText('#projects .tagline', data.projects?.tagline);
  renderProjects(data.projects?.cards);

  setText('#interests .eyebrow', data.interests?.eyebrow);
  setText('#interests .heading__bold', data.interests?.headingBold);
  renderInterests(data.interests?.items);

  setText('.mobile-item[data-section="interests"]', data.mobileMenu?.interests || 'INTERESTS & VOLUNTEER');
  setText('.section-sidebar__link[data-section="interests"]', data.sidebar?.interests || 'Interests');

  setText('#publications .eyebrow', data.publications?.eyebrow);
  setText('#publications .heading__light', data.publications?.headingLight);
  setHtml('#publications .heading__bold', data.publications?.headingBoldHtml);
  setText('#publications .tagline', data.publications?.tagline);
  setText('#publications .publications-body', data.publications?.body);
  renderPublications(data.publications?.items);
  initializePublicationsCarousel();

  setText('#contact .eyebrow', data.contact?.eyebrow);
  setText('#contact .heading__light', data.contact?.headingLight);
  setHtml('#contact .heading__bold', data.contact?.headingBoldHtml);
  setText('#contact .tagline', data.contact?.tagline);
  setText('#contact .contact-body', data.contact?.body);
  setAttr('#contact .btn-filled', 'href', data.contact?.emailHref);
  // email label + address inside button
  const emailBtn = document.querySelector('#contact .btn-filled');
  if (emailBtn) {
    const labelEl = emailBtn.querySelector('.btn-filled__label');
    const emailEl = emailBtn.querySelector('.btn-filled__email');
    if (labelEl) labelEl.textContent = data.contact?.emailLabel || 'Send an Email';
    if (emailEl) emailEl.textContent = (data.contact?.emailHref || '').replace('mailto:', '');
  }
  setAttr('#contact .btn-outline', 'href', data.contact?.linkedinHref);
  setText('#contact .btn-outline', data.contact?.linkedinLabel);
}

async function loadTextContent() {
  const response = await fetch('text_data.json');
  if (!response.ok) {
    throw new Error(`Failed to load text_data.json: ${response.status}`);
  }

  return response.json();
}

function initializeScrollReveal() {
  const revealEls = document.querySelectorAll('.fade-up');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const siblings = Array.from(entry.target.parentElement?.querySelectorAll('.fade-up') || []);
        const revealIndex = siblings.indexOf(entry.target);

        if (!entry.target.style.transitionDelay && revealIndex >= 0 && !entry.target.classList.contains('delay-1') && !entry.target.classList.contains('delay-2') && !entry.target.classList.contains('delay-3')) {
          entry.target.style.transitionDelay = `${Math.min(revealIndex * 90, 240)}ms`;
        }

        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
  );

  const revealInViewport = () => {
    revealEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 80 && rect.bottom > -80) {
        el.classList.add('is-visible');
      }
    });
  };

  revealEls.forEach((el) => revealObserver.observe(el));
  revealInViewport();
  window.addEventListener('load', revealInViewport);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(revealInViewport);
  }
}

function initializeHeroVideo() {
  const heroVideo = document.querySelector('.hero-video');
  if (!heroVideo) return;

  const setHeroVideoRate = () => {
    heroVideo.playbackRate = 0.82;
  };

  heroVideo.addEventListener('loadedmetadata', setHeroVideoRate);
  setHeroVideoRate();
}

function initializeSectionTracking() {
  const allSections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = document.querySelectorAll('.nav-item, .mobile-item, .section-sidebar__link');

  // Keep is-current for ambient glow effects via IntersectionObserver
  const glowObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-current', entry.isIntersecting);
      });
    },
    { threshold: 0.15 }
  );
  allSections.forEach((section) => glowObserver.observe(section));

  // Reliable scroll-based active nav tracking
  function updateActiveLink() {
    const triggerY = window.scrollY + window.innerHeight * 0.38;
    let active = allSections[0];
    for (const section of allSections) {
      if (section.offsetTop <= triggerY) active = section;
    }
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.section === active.id);
    });
  }

  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink, { passive: true });
}

function initializeSidebar() {
  const firstFlowSection = document.getElementById('expertise');
  const sidebar = document.getElementById('section-sidebar');
  const sidebarProgressFill = document.getElementById('section-progress-fill');
  const sectionFlowContent = document.querySelector('.section-flow__content');

  function updateSidebarState() {
    if (!firstFlowSection || !sidebar) return;

    const firstSectionTop = firstFlowSection.getBoundingClientRect().top;
    const shouldShowSidebar = window.innerWidth > 960 && firstSectionTop <= window.innerHeight * 0.34;
    sidebar.classList.toggle('is-visible', shouldShowSidebar);

    if (!sidebarProgressFill || !sectionFlowContent) return;

    const viewportHeight = window.innerHeight;
    const start = firstFlowSection.offsetTop - viewportHeight * 0.34;
    const end = sectionFlowContent.offsetTop + sectionFlowContent.offsetHeight - viewportHeight * 0.7;
    const rawProgress = (window.scrollY - start) / Math.max(end - start, 1);
    const progress = Math.max(0, Math.min(rawProgress, 1));

    sidebarProgressFill.style.height = `${progress * 100}%`;
  }

  updateSidebarState();
  window.addEventListener('scroll', updateSidebarState, { passive: true });
  window.addEventListener('resize', updateSidebarState);
  window.addEventListener('load', updateSidebarState);
}

function initializeDrawer() {
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('mobile-drawer');
  if (!burger || !drawer) return;

  const setDrawerState = (isOpen) => {
    drawer.classList.toggle('is-open', isOpen);
    burger.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    drawer.setAttribute('aria-hidden', String(!isOpen));
  };

  burger.addEventListener('click', () => {
    setDrawerState(!drawer.classList.contains('is-open'));
  });

  document.querySelectorAll('.mobile-item').forEach((item) => {
    item.addEventListener('click', () => setDrawerState(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer.classList.contains('is-open')) {
      setDrawerState(false);
    }
  });
}

async function bootstrapPage() {
  try {
    const textData = await loadTextContent();
    populateTextContent(textData);
  } catch (error) {
    console.warn('Using inline fallback content because text_data.json could not be loaded.', error);
  }

  initializeScrollReveal();
  initializeHeroVideo();
  initializeSectionTracking();
  initializeSidebar();
  initializeDrawer();
}

bootstrapPage();
