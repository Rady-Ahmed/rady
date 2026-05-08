/* ============================================
   MAIN APPLICATION — Premium
   ============================================ */

class Portfolio {
  constructor() {
    this.header = document.querySelector('.header');
    this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    this.mobileNav = document.querySelector('.mobile-nav');
    this.themeToggle = document.querySelectorAll('.theme-toggle');
    this.animations = new AnimationController();
    this.currentTheme = 'dark';
  }

  init() {
    this.setupPreloader();
    this.setupTheme();
    this.setupHeader();
    this.setupMobileMenu();
    this.setupSmoothScroll();
    this.setupContactForm();
    this.setupImageFallback();
    this.setupScrollProgress();
    this.setupScrollToTop();
    this.animations.init();
    this.animations.setupButtonRipples();
    this.animations.setupSectionTitleAnimations();
    this.setupFloatingActions();

    // Small delay to ensure everything is rendered
    requestAnimationFrame(() => {
      document.body.classList.add('loaded');
    });
  }

  /* ══════════════════════════════════════
     PRELOADER
     ══════════════════════════════════════ */
  setupPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Hide preloader after content is loaded
    const hidePreloader = () => {
      setTimeout(() => {
        preloader.classList.add('hide');
        // Remove from DOM after transition
        setTimeout(() => {
          preloader.remove();
        }, 600);
      }, 1200); // Show preloader for at least 1.2s for effect
    };

    if (document.readyState === 'complete') {
      hidePreloader();
    } else {
      window.addEventListener('load', hidePreloader);
    }
  }

  /* ══════════════════════════════════════
     SCROLL PROGRESS BAR
     ══════════════════════════════════════ */
  setupScrollProgress() {
    const progressFill = document.getElementById('scroll-progress-fill');
    if (!progressFill) return;

    let ticking = false;

    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressFill.style.width = progress + '%';
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });

    updateProgress();
  }

  /* ══════════════════════════════════════
     SCROLL TO TOP
     ══════════════════════════════════════ */
  setupScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) return;

    // Show/hide based on scroll position
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
          } else {
            scrollBtn.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Smooth scroll to top on click
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ══════════════════════════════════════
     FLOATING ACTIONS (FAB): contact, tour, CV
     ══════════════════════════════════════ */
  setupFloatingActions() {
    const fab = document.querySelector('.fab');
    if (!fab) return;

    const main = fab.querySelector('.fab-main');
    const actions = fab.querySelector('.fab-actions');

    const closeFab = () => fab.classList.remove('open');

    main.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = fab.classList.toggle('open');
      actions.setAttribute('aria-hidden', String(!isOpen));
      main.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!fab.contains(e.target)) closeFab();
    });

    fab.addEventListener('click', (e) => {
      const actionEl = e.target.closest('[data-action]');
      if (!actionEl) return;
      const action = actionEl.dataset.action;
      if (action === 'tour') {
        this.startSiteTour();
        closeFab();
        return;
      }
      if (action === 'whatsapp' || action === 'cv') {
        closeFab();
      }
    });

    // Hide FAB when footer is visible
    const footer = document.querySelector('footer.footer');
    if (footer && 'IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) fab.classList.add('fab-hidden'); else fab.classList.remove('fab-hidden');
        });
      }, { root: null, threshold: 0 });
      obs.observe(footer);
      this._fabObserver = obs;
    }

    // Hide FAB on scroll down, show on scroll up
    let lastY = window.scrollY || 0;
    let scrollTicking = false;
    const delta = 10;

    const onScroll = () => {
      const currentY = window.scrollY || 0;
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          if (fab.classList.contains('open')) {
            fab.classList.remove('fab-hidden-scroll');
            main.setAttribute('aria-expanded', 'true');
          } else if (currentY - lastY > delta) {
            fab.classList.add('fab-hidden-scroll');
          } else if (lastY - currentY > delta) {
            fab.classList.remove('fab-hidden-scroll');
          }

          lastY = currentY;
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // FAB positioning
    const updateFabPosition = () => {
      const container = document.querySelector('.container');
      const vw = window.innerWidth;

      if (vw <= 820) {
        fab.style.left = '50%';
        fab.style.right = 'auto';
        fab.style.transform = 'translateX(-50%)';
        fab.style.bottom = 'calc(env(safe-area-inset-bottom, 12px) + 2px)';
        return;
      }

      if (container) {
        const rect = container.getBoundingClientRect();
        const gap = Math.max(22, vw - rect.right + 22);
        fab.style.right = gap + 'px';
        fab.style.left = 'auto';
        const outset = vw > 1400 ? 28 : 16;
        fab.style.transform = `translateX(${outset}px)`;
      } else {
        fab.style.right = '22px';
        fab.style.left = 'auto';
        const outset = vw > 1400 ? 28 : 16;
        fab.style.transform = `translateX(${outset}px)`;
      }

      fab.style.bottom = window.innerHeight > 720 ? '-12px' : '8px';
    };

    let fabTick = false;
    const scheduleFabUpdate = () => {
      if (!fabTick) {
        window.requestAnimationFrame(() => {
          updateFabPosition();
          fabTick = false;
        });
        fabTick = true;
      }
    };

    scheduleFabUpdate();
    window.addEventListener('resize', scheduleFabUpdate, { passive: true });
    window.addEventListener('scroll', scheduleFabUpdate, { passive: true });
  }

  startSiteTour() {
    if (this.tourRunning) return;
    this.tourRunning = true;
    const sections = ['#hero', '#about', '#services', '#projects', '#contact'];
    let idx = 0;

    const overlay = document.createElement('div');
    overlay.className = 'tour-overlay';
    overlay.innerHTML = `<div class="tour-step">رحلة: <span class="tour-count">1/${sections.length}</span></div><button class="btn btn-ghost tour-stop">إيقاف</button>`;
    document.body.appendChild(overlay);

    const stop = () => {
      this.tourRunning = false;
      clearTimeout(this.tourTimeout);
      document.body.classList.remove('tour-active');
      document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
      overlay.remove();
    };

    overlay.querySelector('.tour-stop').addEventListener('click', stop);

    const step = () => {
      if (!this.tourRunning) return stop();
      if (idx >= sections.length) return stop();

      const sel = sections[idx];
      const el = document.querySelector(sel);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('tour-highlight');
        setTimeout(() => el.classList.remove('tour-highlight'), 1600);
      }

      idx += 1;
      const count = overlay.querySelector('.tour-count');
      if (count) count.textContent = `${Math.min(idx, sections.length)}/${sections.length}`;

      this.tourTimeout = setTimeout(step, 2200);
    };

    document.body.classList.add('tour-active');
    step();
  }

  /* ══════════════════════════════════════
     THEME MANAGEMENT
     ══════════════════════════════════════ */

  setupTheme() {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved) {
      this.currentTheme = saved;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? 'dark' : 'light';
    }

    this.applyTheme(this.currentTheme);

    this.themeToggle.forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('portfolio-theme', this.currentTheme);

        // Add a subtle flash effect on theme change
        const flash = document.createElement('div');
        flash.style.cssText = `
          position: fixed;
          inset: 0;
          background: var(--accent-glow);
          z-index: 9997;
          pointer-events: none;
          opacity: 0.3;
          animation: fadeIn 0.1s ease forwards, fadeOut 0.4s ease 0.1s forwards;
        `;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 600);
      });
    });

    // Add the fadeOut keyframe if it doesn't exist
    if (!document.querySelector('#theme-flash-styles')) {
      const style = document.createElement('style');
      style.id = 'theme-flash-styles';
      style.textContent = `@keyframes fadeOut { to { opacity: 0; } }`;
      document.head.appendChild(style);
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  /* ══════════════════════════════════════
     HEADER / SCROLL
     ══════════════════════════════════════ */

  setupHeader() {
    let lastScroll = 0;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > 50) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }

      this.updateActiveNavLink();

      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  /* ══════════════════════════════════════
     MOBILE MENU
     ══════════════════════════════════════ */

  setupMobileMenu() {
    if (!this.mobileMenuBtn) return;

    this.mobileMenuBtn.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileNav.classList.contains('open')) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    const isOpen = this.mobileNav.classList.contains('open');
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.mobileMenuBtn.classList.add('active');
    this.mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Stagger animate mobile links
    const links = this.mobileNav.querySelectorAll('.mobile-nav-link');
    links.forEach((link, i) => {
      link.style.opacity = '0';
      link.style.transform = 'translateX(-20px)';
      link.style.transition = `all 0.4s var(--ease-out-expo) ${i * 0.05}s`;
      setTimeout(() => {
        link.style.opacity = '1';
        link.style.transform = 'translateX(0)';
      }, 50);
    });
  }

  closeMobileMenu() {
    this.mobileMenuBtn.classList.remove('active');
    this.mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ══════════════════════════════════════
     SMOOTH SCROLL
     ══════════════════════════════════════ */

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* ══════════════════════════════════════
     CONTACT FORM
     ══════════════════════════════════════ */

  setupContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit-btn');
    const formStatus = document.getElementById('form-status');
    const formSuccess = document.querySelector('.form-success');
    const successIcon = document.querySelector('.form-success-icon');
    const endpoint = 'https://formsubmit.co/ajax/radyahmed117@gmail.com';
    if (!form) return;

    if (successIcon) {
      successIcon.textContent = '\u2713';
    }

    // Add floating label behavior
    const inputs = form.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      input.addEventListener('blur', () => {
        if (!input.value) {
          input.parentElement.classList.remove('focused');
        }
      });
      // Check on load if there's a value
      if (input.value) {
        input.parentElement.classList.add('focused');
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      let isValid = true;

      if (!data.name?.trim()) isValid = false;
      if (!data.email?.trim() || !this.isValidEmail(data.email)) isValid = false;
      if (!data.message?.trim()) isValid = false;

      if (!isValid) {
        this.setFormStatus(formStatus, 'Please enter your name, a valid email, and your message.', 'error');
        return;
      }

      formData.set('_subject', data.subject?.trim()
        ? `Portfolio contact: ${data.subject.trim()}`
        : `Portfolio contact from ${data.name.trim()}`);
      formData.set('_replyto', data.email.trim());
      formData.set('_url', window.location.href);

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
          <span class="loading"></span>
          Sending...
        `;
      }

      form.classList.add('is-submitting');
      this.setFormStatus(formStatus, 'Sending your message...', 'success');

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Request failed');
        }

        const result = await response.json();
        if (result.success !== 'true' && result.success !== true && result.message?.toLowerCase().includes('success') !== true) {
          throw new Error('Submission was not accepted');
        }

        form.reset();
        form.style.display = 'none';
        formSuccess?.classList.add('show');
        this.setFormStatus(formStatus, '');
      } catch (error) {
        this.setFormStatus(
          formStatus,
          'The message could not be sent right now. Check your FormSubmit activation email, then try again.',
          'error'
        );
      } finally {
        form.classList.remove('is-submitting');

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = submitBtn.dataset.originalText || submitBtn.innerHTML;
        }
      }
    });
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  setFormStatus(element, message, type) {
    if (!element) return;

    element.textContent = message;
    element.className = 'form-status';

    if (!message) return;

    element.classList.add('show');
    element.classList.add(type === 'error' ? 'is-error' : 'is-success');
  }

  /* ══════════════════════════════════════
     IMAGE FALLBACK — Graceful Error Handling
     ══════════════════════════════════════ */

  setupImageFallback() {
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function () {
        this.style.opacity = '0.3';
        this.style.filter = 'grayscale(1)';
        // Prevent infinite loop if fallback also fails
        this.onerror = null;
      });

      // Add draggable=false for security
      img.setAttribute('draggable', 'false');
    });
  }
}

/* ── Initialize on DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  const app = new Portfolio();
  app.init();
});
