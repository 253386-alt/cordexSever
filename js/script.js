document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarToggleMenu = document.getElementById('sidebarToggleMenu');
  const sidebarClose = document.getElementById('sidebarClose');

  function setSidebar(open) {
    if (!sidebar || !overlay) return;

    sidebar.classList.toggle('sidebar--open', open);
    overlay.classList.toggle('overlay--show', open);
    sidebar.setAttribute('aria-hidden', !open);
    if (sidebarToggle) {
      sidebarToggle.setAttribute('aria-expanded', open);
    }
    if (sidebarToggleMenu) {
      sidebarToggleMenu.setAttribute('aria-expanded', open);
    }
    document.body.classList.toggle('no-scroll', open);
  }

  function toggleSidebar(e) {
    if (e) e.stopPropagation();
    const isOpen = sidebar.classList.contains('sidebar--open');
    setSidebar(!isOpen);
  }

  if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
  if (sidebarToggleMenu) sidebarToggleMenu.addEventListener('click', toggleSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', () => setSidebar(false));
  if (overlay) overlay.addEventListener('click', () => setSidebar(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setSidebar(false);
  });

  if (sidebar) {
    sidebar.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        setSidebar(false);
      });
    });
  }

  // Enhanced motion (inspired by premium scroll-driven sites)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const cards = Array.from(document.querySelectorAll('.plan-card, .card, section .border.border-white\\/10.rounded-\\[28px\\], section .border.border-white\\/10.rounded-3xl'));
  const images = Array.from(document.querySelectorAll('main img, .viture-hero-bg'));

  if (hasGSAP) {
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    // Hero parallax (skip video backgrounds with CSS motion to avoid conflicts)
    document.querySelectorAll('.viture-hero').forEach((hero) => {
      const bg = hero.querySelector('.viture-hero-bg, video.viture-hero-bg');
      const copy = hero.querySelector('.hero-copy, .relative.z-10');
      if (bg && !(bg.tagName === 'VIDEO')) {
        gsap.to(bg, {
          yPercent: 14,
          scale: 1.06,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
        });
      } else if (bg && bg.tagName === 'VIDEO') {
        gsap.to(bg, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
        });
      }
      if (copy) {
        gsap.fromTo(copy.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: 'power3.out', delay: 0.1 });
      }
    });

    // Rich reveals (complements inline reveal scripts)
    gsap.utils.toArray('.reveal').forEach((el) => {
      if (el.dataset.enhanced) return;
      el.dataset.enhanced = '1';
      gsap.fromTo(el, { y: 50, opacity: 0, filter: 'blur(6px)' }, {
        y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    // Section headings / intros
    gsap.utils.toArray('main section').forEach((section) => {
      const targets = section.querySelectorAll('.eyebrow, h2:not(.reveal), .viture-h2:not(.reveal), p.text-center.text-white\\/50');
      if (targets.length) {
        gsap.fromTo(targets, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 82%' }
        });
      }
    });

    // Cards stagger
    gsap.utils.toArray('main section').forEach((section) => {
      const group = section.querySelectorAll('.plan-card, .border.border-white\\/10.rounded-\\[28px\\], .border.border-white\\/10.rounded-3xl');
      if (group.length > 1) {
        gsap.fromTo(group, { y: 50, opacity: 0, scale: 0.98 }, {
          y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 78%' }
        });
      }
    });

    // Image reveal/zoom
    images.forEach((img) => {
      if (img.closest('.viture-hero')) return;
      gsap.fromTo(img, { scale: 1.08 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: img, start: 'top 95%', end: 'bottom 70%', scrub: true }
      });
    });
  } else {
    // Fallback: IntersectionObserver
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal, main section, .plan-card').forEach((el) => { el.classList.add('motion-ready'); io.observe(el); });
  }

  // Hover tilt for cards
  cards.forEach((card) => {
    card.style.transition = 'transform .35s ease, border-color .35s ease, box-shadow .35s ease';
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
});
