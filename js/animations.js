/* ============================================
   ANIMATIONS MODULE — Premium Ultra
   ============================================ */

class AnimationController {
  constructor() {
    this.observers = [];
    this.countersAnimated = new Set();
    this.rafId = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  init() {
    if (!this.prefersReducedMotion) {
      this.setupScrollReveal();
      this.setupCounterAnimation();
      this.setupParallax();
      this.setupHeroTilt();
      this.setupCursorGlow();
      this.setupStaggeredReveal();
      this.setupHoverEffects();
      this.setupCardAnimations();
      this.setupCustomCursor();
      this.setupCardSpotlight();
      this.setupMagneticButtons();
      this.setupTechItemGlow();
    } else {
      this.setupAccessibleAnimations();
    }
  }

  /* ── Accessibility: Reduced Motion Support ── */
  setupAccessibleAnimations() {
    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-scale, .reveal-left, .reveal-right'
    );
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ══════════════════════════════════════
     CUSTOM CURSOR (Desktop only)
     ══════════════════════════════════════ */
  setupCustomCursor() {
    if (window.matchMedia('(hover: none)').matches) return;
    
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let cursorX = 0, cursorY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      dot.style.left = cursorX + 'px';
      dot.style.top = cursorY + 'px';
    });

    // Smooth ring follow with lerp
    const animateRing = () => {
      ringX += (cursorX - ringX) * 0.15;
      ringY += (cursorY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    // Hover effect on interactive elements
    const interactiveEls = document.querySelectorAll('a, button, .card, .tech-item, .btn, input, textarea');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('hovering');
        ring.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('hovering');
        ring.classList.remove('hovering');
      });
    });
  }

  /* ══════════════════════════════════════
     CARD SPOTLIGHT (Cursor Follow Glow)
     ══════════════════════════════════════ */
  setupCardSpotlight() {
    const cards = document.querySelectorAll('.card, .service-card, .about-highlight, .about-stat');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
        card.style.setProperty('--spotlight-opacity', '1');
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--spotlight-opacity', '0');
      });
    });
  }

  /* ══════════════════════════════════════
     MAGNETIC BUTTONS
     ══════════════════════════════════════ */
  setupMagneticButtons() {
    if (window.innerWidth < 768) return; // Skip on mobile
    
    const btns = document.querySelectorAll('.btn-primary, .btn-secondary');
    btns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-2px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ══════════════════════════════════════
     TECH ITEM GLOW ON MOUSE
     ══════════════════════════════════════ */
  setupTechItemGlow() {
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(0);
        const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(0);
        item.style.setProperty('--mouse-x', x + '%');
        item.style.setProperty('--mouse-y', y + '%');
      });
    });
  }

  /* ── Scroll Reveal via IntersectionObserver ── */
  setupScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-scale, .reveal-left, .reveal-right'
    );

    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('revealed');
              entry.target.style.animation = 'none';
            }, 0);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));
    this.observers.push(observer);
  }

  /* ── Staggered Reveal for Groups ── */
  setupStaggeredReveal() {
    const heroStats = document.querySelectorAll('.hero-stat');
    heroStats.forEach((stat, i) => {
      stat.style.opacity = '0';
      stat.style.transform = 'translateY(20px)';
      stat.style.transition = `opacity 0.6s var(--ease-out-expo) ${0.5 + i * 0.15}s, transform 0.6s var(--ease-out-expo) ${0.5 + i * 0.15}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stats = entry.target.querySelectorAll('.hero-stat');
            stats.forEach((stat) => {
              stat.style.opacity = '1';
              stat.style.transform = 'translateY(0)';
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) observer.observe(statsContainer);
    this.observers.push(observer);
  }

  /* ── Counter Animation ── */
  setupCounterAnimation() {
    const counters = document.querySelectorAll('[data-counter]');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.countersAnimated.has(entry.target)) {
            this.countersAnimated.add(entry.target);
            this.animateCounterEnhanced(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach((counter) => observer.observe(counter));
    this.observers.push(observer);
  }

  animateCounter(element) {
    const target = element.getAttribute('data-counter');
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';
    const duration = 2000;
    const startTime = performance.now();
    
    const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ''));
    const isDecimal = target.includes('.');

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      let current;
      if (isDecimal) {
        current = (eased * numericTarget).toFixed(1);
      } else {
        current = Math.floor(eased * numericTarget);
      }

      element.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = prefix + target + suffix;
        element.style.textShadow = '0 0 20px rgba(99, 102, 241, 0.5)';
        setTimeout(() => {
          element.style.transition = 'text-shadow 0.8s ease-out';
          element.style.textShadow = 'none';
        }, 300);
      }
    };

    requestAnimationFrame(animate);
  }

  /* ── Enhanced Parallax on Hero ── */
  setupParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const orbs = hero.querySelectorAll('.hero-orb');
    const heroContent = hero.querySelector('.hero-content');
    const grid = hero.querySelector('.hero-grid');
    
    let ticking = false;
    window.addEventListener('mousemove', (e) => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        orbs.forEach((orb, i) => {
          const speed = (i + 1) * 18;
          orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });

        if (heroContent) {
          heroContent.style.transform = `translate(${x * 3}px, ${y * 2}px)`;
        }

        if (grid) {
          grid.style.transform = `translate(${x * -5}px, ${y * -5}px)`;
        }

        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        ticking = false;
      });
    });
  }

  /* ── Hero Image Magnetic Tilt ── */
  setupHeroTilt() {
    const wrapper = document.querySelector('.hero-image-wrapper');
    if (!wrapper) return;

    const image = wrapper.querySelector('.hero-image');
    const glow = wrapper.querySelector('.hero-image-glow');
    
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const rotateX = y * -12;
      const rotateY = x * 12;

      if (image) {
        image.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      }

      if (glow) {
        glow.style.transform = `translate(${x * 20}px, ${y * 20}px) scale(1.05)`;
      }
    });

    wrapper.addEventListener('mouseleave', () => {
      if (image) {
        image.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        image.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
        setTimeout(() => { image.style.transition = ''; }, 600);
      }
      if (glow) {
        glow.style.transition = 'transform 0.6s ease-out';
        glow.style.transform = 'translate(0, 0) scale(1)';
        setTimeout(() => { glow.style.transition = ''; }, 600);
      }
    });
  }

  /* ── Cursor Glow Spotlight on Hero ── */
  setupCursorGlow() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const glowEl = document.createElement('div');
    glowEl.className = 'hero-cursor-glow';
    glowEl.style.cssText = `
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
      opacity: 0;
    `;
    hero.appendChild(glowEl);

    hero.addEventListener('mouseenter', () => {
      glowEl.style.opacity = '1';
    });

    hero.addEventListener('mouseleave', () => {
      glowEl.style.opacity = '0';
    });

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glowEl.style.left = x + 'px';
      glowEl.style.top = y + 'px';
    });
  }

  /* ── Dashboard Chart Animation ── */
  animateDashboardBars() {
    const bars = document.querySelectorAll('.chart-bar');
    bars.forEach((bar, i) => {
      const height = bar.getAttribute('data-height');
      bar.style.height = '0%';
      setTimeout(() => {
        bar.style.height = height + '%';
      }, 100 + i * 80);
    });
  }

  /* ── Cleanup ── */
  destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  /* ── Enhanced Hover Effects ── */
  setupHoverEffects() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
        card.style.boxShadow = '0 20px 60px rgba(99, 102, 241, 0.15)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';
      });
    });
  }

  /* ── Card Grid Animations with Stagger ── */
  setupCardAnimations() {
    const cardGroups = document.querySelectorAll('.services-grid, .projects-grid, .tech-grid');

    cardGroups.forEach(group => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const cards = entry.target.querySelectorAll('.card, .tech-item, .service-card');
              cards.forEach((card, i) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = `all 0.6s var(--ease-out-expo) ${i * 0.08}s`;

                setTimeout(() => {
                  card.style.opacity = '1';
                  card.style.transform = 'translateY(0)';
                }, 50);
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(group);
      this.observers.push(observer);
    });
  }

  /* ── Button Ripple Effect ── */
  setupButtonRipples() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          left: ${x}px;
          top: ${y}px;
          animation: ripple-anim 0.6s ease-out;
          pointer-events: none;
        `;

        if (!button.style.position) button.style.position = 'relative';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  /* ── Section Title Animations ── */
  setupSectionTitleAnimations() {
    const titles = document.querySelectorAll('.section-title, .hero-title');

    titles.forEach(title => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );

      title.style.opacity = '0';
      title.style.transform = 'translateY(20px)';
      title.style.transition = 'all 0.8s var(--ease-out-expo)';
      observer.observe(title);
      this.observers.push(observer);
    });
  }

  /* ── Enhanced Counter with Bounce ── */
  animateCounterEnhanced(element) {
    const target = element.getAttribute('data-counter');
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';
    const duration = 2500;
    const startTime = performance.now();

    const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ''));
    const isDecimal = target.includes('.');

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easing
      const eased = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

      let current;
      if (isDecimal) {
        current = (eased * numericTarget).toFixed(1);
      } else {
        current = Math.floor(eased * numericTarget);
      }

      element.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = prefix + target + suffix;
        element.classList.add('counter-done');
        // Glow flash on completion
        element.style.textShadow = '0 0 30px rgba(99, 102, 241, 0.6)';
        setTimeout(() => {
          element.style.transition = 'text-shadow 1s ease-out';
          element.style.textShadow = 'none';
        }, 400);
      }
    };

    requestAnimationFrame(animate);
  }
}
