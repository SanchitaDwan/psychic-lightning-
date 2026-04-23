/*
 * SIDMA DECOR — Main Script
 * Handles: Config-driven WhatsApp links, Feather icons, navbar, mobile menu,
 *          scroll reveals, parallax backgrounds, sticky mobile CTA,
 *          smooth scroll, product filter tabs, gallery lightbox,
 *          stats counter animation, contact info injection.
 */

// ═══════════════════════════════════════════
// STEP 1: CONFIGURATION OBJECT
// ═══════════════════════════════════════════
const SIDMA = {
  phone: "919876543210",
  phoneDisplay: "+91 98765 43210",
  email: "info@sidmadecor.com",
  whatsappBase: "https://wa.me/",
  instagram: "https://instagram.com/sidmadecor",
  location: "Mumbai, Maharashtra, India",
  defaultMsg: "Hi%2C%20I%27m%20interested%20in%20SIDMA%20DECOR%20lighting%20products"
};


document.addEventListener('DOMContentLoaded', () => {

  // ── Feather Icons ─────────────────────────
  if (typeof feather !== 'undefined') {
    feather.replace({ 'stroke-width': 2 });
  }

  // ── Copyright Year ────────────────────────
  const yearEl = document.getElementById('copyrightYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  // ═══════════════════════════════════════════
  // STEP 1: DYNAMIC WHATSAPP LINK INJECTION
  // ═══════════════════════════════════════════
  document.querySelectorAll('[data-wa]').forEach(el => {
    const context = el.getAttribute('data-wa');
    let msg = SIDMA.defaultMsg;

    if (context && context !== 'general') {
      msg = encodeURIComponent(`Hi, I'm interested in ${context}`);
    }

    el.href = `${SIDMA.whatsappBase}${SIDMA.phone}?text=${msg}`;
  });

  // ── Inject contact info ───────────────────
  document.querySelectorAll('[data-contact]').forEach(el => {
    const type = el.getAttribute('data-contact');
    if (type === 'phone')    el.textContent = SIDMA.phoneDisplay;
    if (type === 'email')    el.textContent = SIDMA.email;
    if (type === 'location') el.textContent = SIDMA.location;
  });


  // ═══════════════════════════════════════════
  // ELEMENT REFERENCES
  // ═══════════════════════════════════════════
  const navbar        = document.getElementById('navbar');
  const hamburger     = document.getElementById('hamburger');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks   = document.querySelectorAll('.mobile-link');
  const stickyMobile  = document.getElementById('stickyMobileCta');
  const reveals       = document.querySelectorAll('.reveal');
  const parallaxBgs   = document.querySelectorAll('[data-parallax-bg]');
  const contactSection = document.getElementById('contact');


  // ═══════════════════════════════════════════
  // MOBILE MENU (Step 8: aria-expanded toggle)
  // ═══════════════════════════════════════════
  function toggleMenu() {
    const isOpen = hamburger.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileOverlay.classList.contains('active')) toggleMenu();
    });
  });


  // ═══════════════════════════════════════════
  // NAVBAR SCROLL
  // ═══════════════════════════════════════════
  function handleNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }


  // ═══════════════════════════════════════════
  // SCROLL REVEAL
  // ═══════════════════════════════════════════
  function handleReveals() {
    const trigger = window.innerHeight * 0.88;

    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < trigger && !el.classList.contains('visible')) {
        const delay = parseInt(el.dataset.delay || 0, 10);
        setTimeout(() => el.classList.add('visible'), delay);
      }
    });
  }


  // ═══════════════════════════════════════════
  // PARALLAX BACKGROUNDS
  // ═══════════════════════════════════════════
  function handleParallax() {
    parallaxBgs.forEach(el => {
      const speed = parseFloat(el.dataset.parallaxBg) || 0.3;
      const rect  = el.parentElement.getBoundingClientRect();
      const vh    = window.innerHeight;

      if (rect.bottom > 0 && rect.top < vh) {
        const progress = (vh - rect.top) / (vh + rect.height);
        const offset   = (progress - 0.5) * rect.height * speed;
        el.style.transform = `translateY(${offset}px)`;
      }
    });
  }


  // ═══════════════════════════════════════════
  // STICKY MOBILE CTA (Step 7: hide when #contact visible)
  // ═══════════════════════════════════════════
  let contactVisible = false;

  if (contactSection && 'IntersectionObserver' in window) {
    const contactObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        contactVisible = entry.isIntersecting;
      });
    }, { threshold: 0.2 });
    contactObserver.observe(contactSection);
  }

  function handleStickyCta() {
    if (!stickyMobile) return;
    const pastHero = window.scrollY > window.innerHeight * 0.6;

    if (pastHero && !contactVisible) {
      stickyMobile.classList.add('visible');
      stickyMobile.classList.remove('hidden');
    } else if (contactVisible) {
      stickyMobile.classList.add('hidden');
      stickyMobile.classList.remove('visible');
    } else {
      stickyMobile.classList.remove('visible');
    }
  }


  // ═══════════════════════════════════════════
  // UNIFIED SCROLL HANDLER
  // ═══════════════════════════════════════════
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleNavbar();
        handleReveals();
        handleParallax();
        handleStickyCta();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  // ═══════════════════════════════════════════
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ═══════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return; // skip bare # links
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 10;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ═══════════════════════════════════════════
  // PRODUCT FILTER TABS (Step 3b)
  // ═══════════════════════════════════════════
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card[data-category]');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      productCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.classList.remove('filter-hide');
          card.classList.add('filter-show');
          card.style.position = '';
          card.style.visibility = '';
        } else {
          card.classList.add('filter-hide');
          card.classList.remove('filter-show');
        }
      });
    });
  });

  // ── Footer Smart Filter Links ──────────────
  const footerFilterLinks = document.querySelectorAll('.footer-col ul li a[data-filter]');
  
  footerFilterLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const filter = link.dataset.filter;
      const targetTab = document.querySelector(`.filter-tab[data-filter="${filter}"]`);
      
      if (targetTab) {
        // The smooth scroll logic above will handle the jump to #products
        // We just need to trigger the filter click
        setTimeout(() => targetTab.click(), 100);
      }
    });
  });


  // ═══════════════════════════════════════════
  // GALLERY LIGHTBOX (Step 4a)
  // ═══════════════════════════════════════════
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxCap   = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const lightboxPrev  = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
  const lightboxNext  = lightbox ? lightbox.querySelector('.lightbox-next') : null;
  const galleryItems  = document.querySelectorAll('[data-lightbox]');
  let currentLightboxIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !galleryItems.length) return;
    currentLightboxIndex = index;
    const item = galleryItems[index];
    lightboxImg.src = item.dataset.lightbox;
    lightboxImg.alt = item.dataset.caption || 'Gallery image';
    if (lightboxCap) lightboxCap.textContent = item.dataset.caption || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    let newIndex = currentLightboxIndex + direction;
    if (newIndex < 0) newIndex = galleryItems.length - 1;
    if (newIndex >= galleryItems.length) newIndex = 0;
    openLightbox(newIndex);
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(i);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

  // Close on click outside image
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // Step 4a: Touch swipe support for lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        navigateLightbox(diff > 0 ? 1 : -1);
      }
    }, { passive: true });
  }


  // ═══════════════════════════════════════════
  // STATS COUNTER ANIMATION (Step 6.2)
  // ═══════════════════════════════════════════
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;

    statNumbers.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1500; // 1.5s
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(easedProgress * target);

        el.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // Observe the stats row
  const statsRow = document.querySelector('.stats-row');
  if (statsRow && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(statsRow);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsRow);
  }


  // ═══════════════════════════════════════════
  // AGGREGATE RATING SCHEMA (Step 5b)
  // ═══════════════════════════════════════════
  const reviewCards = document.querySelectorAll('.review-card');
  if (reviewCards.length) {
    let totalStars = 0;
    reviewCards.forEach(card => {
      const filled = card.querySelectorAll('.star-fill').length;
      totalStars += filled;
    });
    const avgRating = (totalStars / reviewCards.length).toFixed(1);

    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "SIDMA DECOR",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": avgRating,
        "reviewCount": reviewCards.length.toString()
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

});
