/* ==========================================================================
   STACKLY ATHLETIC CLUB — script.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- PRELOADER ---------------- */
  const preloader = document.getElementById('preloader');
  const preloaderFill = document.getElementById('preloaderFill');
  window.addEventListener('load', () => {
    gsap.to(preloaderFill, { width: '100%', duration: 0.9, ease: 'power2.out' });
    setTimeout(() => {
      preloader.classList.add('done');
      runHeroIntro();
    }, 900);
  });
  // fallback in case load event already fired / is slow
  setTimeout(() => {
    if (!preloader.classList.contains('done')) {
      preloaderFill.style.width = '100%';
      preloader.classList.add('done');
      runHeroIntro();
    }
  }, 2600);

  /* ---------------- AOS ---------------- */
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
  });

  /* ---------------- CUSTOM CURSOR ---------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (isFinePointer) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document.querySelectorAll('a, button, .tilt-card, input, textarea, select').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });
  }

  /* ---------------- MAGNETIC BUTTONS ---------------- */
  if (isFinePointer) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(btn, { x: x * 0.28, y: y * 0.5, duration: 0.4, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ---------------- TILT CARDS (program cards) ---------------- */
  if (isFinePointer) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, { rotateX: py * -8, rotateY: px * 8, transformPerspective: 800, duration: 0.5, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
      });
    });
  }

  /* ---------------- HEADER SCROLL STATE ---------------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) { header.classList.add('scrolled'); } else { header.classList.remove('scrolled'); }
    if (window.scrollY > 700) { backToTop.classList.add('show'); } else { backToTop.classList.remove('show'); }
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------------- HAMBURGER / MOBILE NAV ---------------- */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  const navOverlay = document.getElementById('navOverlay');

  function toggleNav(open) {
    const isOpen = open !== undefined ? open : !mainNav.classList.contains('open');
    mainNav.classList.toggle('open', isOpen);
    hamburger.classList.toggle('open', isOpen);
    navOverlay.classList.toggle('show', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  hamburger.addEventListener('click', () => toggleNav());
  navOverlay.addEventListener('click', () => toggleNav(false));
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleNav(false);
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  /* ---------------- HERO SLIDESHOW ---------------- */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDotsWrap = document.getElementById('heroDots');

  if (heroSlides.length && heroDotsWrap) {
    let heroIndex = 0;

    heroSlides.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => setHeroSlide(i));
      heroDotsWrap.appendChild(dot);
    });
    const heroDots = heroDotsWrap.querySelectorAll('span');

    function setHeroSlide(i) {
      heroIndex = (i + heroSlides.length) % heroSlides.length;
      heroSlides.forEach((s, idx) => {
        if (idx === heroIndex) {
          // restart the Ken Burns animation cleanly
          s.classList.remove('is-active');
          void s.offsetWidth;
          s.classList.add('is-active');
        } else {
          s.classList.remove('is-active');
        }
      });
      heroDots.forEach(d => d.classList.remove('active'));
      heroDots[heroIndex].classList.add('active');
    }
    setInterval(() => setHeroSlide(heroIndex + 1), 6000);
  }

  /* ---------------- HERO GSAP INTRO ---------------- */
  function runHeroIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.7 }, 0.1)
      .from('.hero-title .line', { yPercent: 120, opacity: 0, duration: 1, stagger: 0.12 }, 0.15)
      .to('.hero-desc', { opacity: 1, y: 0, duration: 0.8 }, 0.7)
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8 }, 0.85)
      .to('.hero-stats', { opacity: 1, y: 0, duration: 0.8 }, 1)
      .fromTo('.hero-float-badge', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.8 }, 0.6);

    gsap.set(['.hero-eyebrow', '.hero-desc', '.hero-cta', '.hero-stats'], { opacity: 0, y: 24 });
    tl.play();

    startCounters();
  }

  /* ---------------- PARALLAX HERO ON MOUSE ---------------- */
  const heroMedia = document.querySelector('.hero-media');
  const hero = document.querySelector('.hero');
  if (isFinePointer && heroMedia) {
    hero.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      gsap.to(heroMedia, { x: x, y: y, duration: 1, ease: 'power2.out' });
    });
    hero.addEventListener('mouseleave', () => {
      gsap.to(heroMedia, { x: 0, y: 0, duration: 0.8, ease: 'power2.out' });
    });
  }

  /* ---------------- SCROLL-TRIGGERED REVEALS (GSAP) ---------------- */
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.why-card').forEach((card, i) => {
    gsap.fromTo(card, { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, delay: i * 0.05, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 90%' }
    });
  });

  if (document.querySelector('.about-media')) {
    gsap.fromTo('.about-img-main', { clipPath: 'inset(100% 0% 0% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut',
      scrollTrigger: { trigger: '.about-media', start: 'top 75%' }
    });
    gsap.fromTo('.about-img-float', { scale: 0.6, opacity: 0 }, {
      scale: 1, opacity: 1, duration: 1, delay: 0.3, ease: 'back.out(1.6)',
      scrollTrigger: { trigger: '.about-media', start: 'top 70%' }
    });
  }

  if (document.querySelector('.plans')) {
    gsap.fromTo('.plan-card', { y: 60, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.plans', start: 'top 85%' }
    });
  }

  /* ---------------- COUNTERS (Intersection Observer + GSAP) ---------------- */
  function startCounters() {
    const counters = document.querySelectorAll('.count');
    const seen = new WeakSet();
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !seen.has(entry.target)) {
          seen.add(entry.target);
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target, duration: 1.8, ease: 'power2.out',
            onUpdate: () => { el.textContent = Math.floor(obj.val).toLocaleString(); },
          });
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => io.observe(c));
  }

  /* ---------------- TESTIMONIAL SLIDER ---------------- */
  const testiCards = document.querySelectorAll('.testi-card');
  const testiDotsWrap = document.getElementById('testiDots');

  if (testiCards.length && testiDotsWrap) {
    let testiIndex = 0;

    testiCards.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => showTesti(i));
      testiDotsWrap.appendChild(dot);
    });
    const testiDots = testiDotsWrap.querySelectorAll('span');

    function showTesti(i) {
      testiCards.forEach(c => c.classList.remove('active'));
      testiDots.forEach(d => d.classList.remove('active'));
      testiIndex = (i + testiCards.length) % testiCards.length;
      testiCards[testiIndex].classList.add('active');
      testiDots[testiIndex].classList.add('active');
    }
    testiCards[0].classList.add('active');

    const testiNextBtn = document.getElementById('testiNext');
    const testiPrevBtn = document.getElementById('testiPrev');
    if (testiNextBtn) testiNextBtn.addEventListener('click', () => showTesti(testiIndex + 1));
    if (testiPrevBtn) testiPrevBtn.addEventListener('click', () => showTesti(testiIndex - 1));
    setInterval(() => showTesti(testiIndex + 1), 6000);
  }

  /* ---------------- FAQ ACCORDION ---------------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  /* ---------------- CONTACT FORM (demo submit) ---------------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btnText = document.getElementById('formBtnText');
      btnText.textContent = 'Sending…';
      setTimeout(() => {
        btnText.textContent = 'Book a walk-through';
        formSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }, 900);
    });
  }

  /* ---------------- VIDEO MODAL ---------------- */
  const videoModal = document.getElementById('videoModal');
  const playBtn = document.getElementById('playBtn');
  if (videoModal && playBtn) {
    playBtn.addEventListener('click', () => videoModal.classList.add('show'));
    const videoCloseBtn = document.getElementById('videoClose');
    if (videoCloseBtn) videoCloseBtn.addEventListener('click', () => videoModal.classList.remove('show'));
    videoModal.addEventListener('click', (e) => { if (e.target === videoModal) videoModal.classList.remove('show'); });
  }

  /* ---------------- SMOOTH ANCHOR SCROLL OFFSET FOR FIXED HEADER ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = 90;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

});
/* ==========================================================================
   ABOUT PAGE — new interactions (only run where the matching elements exist)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- HERO TITLE : letter-stagger reveal ---------------- */
  const abHeroTitle = document.getElementById('abHeroTitle');
  if (abHeroTitle && window.gsap) {
    const abText = abHeroTitle.textContent;
    abHeroTitle.innerHTML = abText.split('').map(ch =>
      `<span class="ab-char">${ch === ' ' ? '&nbsp;' : ch}</span>`
    ).join('');
    gsap.to('#abHeroTitle .ab-char', {
      opacity: 1, y: 0, rotate: 0, duration: 0.9, ease: 'power4.out',
      stagger: 0.018, delay: 0.9
    });
  }

  /* ---------------- OUR STORY : drag / snap / progress timeline ---------------- */
  const abStoryTrack = document.getElementById('abStoryTrack');
  if (abStoryTrack) {
    const abStoryFill = document.getElementById('abStoryFill');
    const abStoryPrev = document.getElementById('abStoryPrev');
    const abStoryNext = document.getElementById('abStoryNext');
    const firstItem = abStoryTrack.querySelector('.ab-story-item');
    const stepWidth = () => (firstItem ? firstItem.offsetWidth + 24 : 280);

    function updateStoryProgress() {
      const max = abStoryTrack.scrollWidth - abStoryTrack.clientWidth;
      const pct = max > 0 ? (abStoryTrack.scrollLeft / max) * 100 : 0;
      if (abStoryFill) abStoryFill.style.width = Math.min(100, Math.max(6, pct)) + '%';
    }
    abStoryTrack.addEventListener('scroll', updateStoryProgress);
    updateStoryProgress();

    if (abStoryNext) abStoryNext.addEventListener('click', () => abStoryTrack.scrollBy({ left: stepWidth(), behavior: 'smooth' }));
    if (abStoryPrev) abStoryPrev.addEventListener('click', () => abStoryTrack.scrollBy({ left: -stepWidth(), behavior: 'smooth' }));

    // click-and-drag to scroll on desktop
    let abDragging = false, abStartX = 0, abScrollStart = 0;
    abStoryTrack.addEventListener('mousedown', (e) => {
      abDragging = true;
      abStoryTrack.classList.add('dragging');
      abStartX = e.pageX;
      abScrollStart = abStoryTrack.scrollLeft;
    });
    window.addEventListener('mouseup', () => { abDragging = false; abStoryTrack.classList.remove('dragging'); });
    window.addEventListener('mousemove', (e) => {
      if (!abDragging) return;
      e.preventDefault();
      abStoryTrack.scrollLeft = abScrollStart - (e.pageX - abStartX);
    });
  }

  /* ---------------- PHILOSOPHY : tap-to-flip on touch devices ---------------- */
  const abIsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.querySelectorAll('.ab-flip-card').forEach(card => {
    card.addEventListener('click', () => {
      if (!abIsFinePointer) card.classList.toggle('is-flipped');
    });
  });

  /* ---------------- FACILITY : drag compare slider ---------------- */
  const abCompare = document.getElementById('abCompare');
  if (abCompare) {
    const abCompareBefore = document.getElementById('abCompareBefore');
    const abCompareHandle = document.getElementById('abCompareHandle');
    let abCompareDragging = false;

    function setComparePos(clientX) {
      const rect = abCompare.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.min(96, Math.max(4, pct));
      abCompareBefore.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      abCompareHandle.style.left = pct + '%';
    }
    abCompare.addEventListener('mousedown', (e) => { abCompareDragging = true; setComparePos(e.clientX); });
    window.addEventListener('mouseup', () => { abCompareDragging = false; });
    window.addEventListener('mousemove', (e) => { if (abCompareDragging) setComparePos(e.clientX); });
    abCompare.addEventListener('touchstart', (e) => setComparePos(e.touches[0].clientX), { passive: true });
    abCompare.addEventListener('touchmove', (e) => setComparePos(e.touches[0].clientX), { passive: true });
  }

  /* ---------------- NUMBERS : animated ring counters ---------------- */
  const abRings = document.querySelectorAll('.ab-ring');
  if (abRings.length) {
    const abCircumference = 2 * Math.PI * 52;
    const abRingIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const pct = parseFloat(entry.target.getAttribute('data-percent')) || 0;
          const fill = entry.target.querySelector('.ab-ring-fill');
          if (fill) fill.style.strokeDashoffset = abCircumference - (pct / 100) * abCircumference;
          abRingIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    abRings.forEach(r => abRingIO.observe(r));
  }

  /* ---------------- CTA : scroll mask-wipe heading reveal ---------------- */
  const abCtaTitle = document.getElementById('abCtaTitle');
  if (abCtaTitle && window.ScrollTrigger) {
    ScrollTrigger.create({
      trigger: abCtaTitle,
      start: 'top 85%',
      once: true,
      onEnter: () => abCtaTitle.classList.add('is-revealed')
    });
  }

});/* ==========================================================================
   SERVICES PAGE — new interactions (only run where the matching elements exist)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  const svIsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------- 1. HERO TITLE : text-scramble reveal ---------------- */
  const svHeroTitle = document.getElementById('svHeroTitle');
  if (svHeroTitle) {
    const finalText = svHeroTitle.getAttribute('data-text') || svHeroTitle.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&*+=';
    let frame = 0;
    const totalFrames = finalText.length * 3;

    function svScrambleTick() {
      let out = '';
      const revealCount = Math.floor((frame / totalFrames) * finalText.length);
      for (let i = 0; i < finalText.length; i++) {
        const original = finalText[i];
        if (original === ' ') { out += ' '; continue; }
        if (i < revealCount) {
          out += `<span class="sv-scramble-done">${original}</span>`;
        } else {
          out += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      svHeroTitle.innerHTML = out;
      frame++;
      if (frame <= totalFrames) {
        requestAnimationFrame(() => setTimeout(svScrambleTick, 22));
      } else {
        svHeroTitle.textContent = finalText;
      }
    }
    setTimeout(svScrambleTick, 650);
  }

  /* ---------------- 2. SERVICE MENU : expanding accordion (click for touch) ---------------- */
  const svAccordion = document.getElementById('svAccordion');
  if (svAccordion) {
    const svPanels = svAccordion.querySelectorAll('.sv-acc-panel');
    svPanels.forEach(panel => {
      if (svIsFinePointer) {
        panel.addEventListener('mouseenter', () => {
          svPanels.forEach(p => p.classList.remove('is-open'));
          panel.classList.add('is-open');
        });
      } else {
        panel.addEventListener('click', () => {
          const wasOpen = panel.classList.contains('is-open');
          svPanels.forEach(p => p.classList.remove('is-open'));
          if (!wasOpen) panel.classList.add('is-open');
        });
      }
    });
  }

  /* ---------------- 3. HOW IT WORKS : connector line draw + node pop ---------------- */
  const svProcessWrap = document.getElementById('svProcessWrap');
  if (svProcessWrap) {
    const svProcessFill = document.getElementById('svProcessFill');
    const svProcessIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          svProcessWrap.classList.add('is-inview');
          if (svProcessFill) svProcessFill.style.strokeDashoffset = '0';
          svProcessIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    svProcessIO.observe(svProcessWrap);
  }

  /* ---------------- 4. PRICING : toggle switch + deck-deal entrance ---------------- */
  const svToggleBtn = document.getElementById('svToggleBtn');
  const svPriceGrid = document.querySelector('.sv-price-grid');
  if (svToggleBtn && svPriceGrid) {
    svToggleBtn.addEventListener('click', () => {
      const isAnnual = svPriceGrid.classList.toggle('is-annual');
      svToggleBtn.classList.toggle('is-on', isAnnual);
      svToggleBtn.setAttribute('aria-pressed', String(isAnnual));
      document.querySelectorAll('.sv-toggle-label').forEach(label => {
        const isMatch = label.getAttribute('data-label') === (isAnnual ? 'annual' : 'monthly');
        label.classList.toggle('is-active', isMatch);
      });
    });

    const svPriceCards = svPriceGrid.querySelectorAll('.sv-price-card');
    const svPriceIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          svPriceCards.forEach((card, i) => {
            setTimeout(() => card.classList.add('is-dealt'), i * 150);
          });
          svPriceIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    svPriceIO.observe(svPriceGrid);
  }

  /* ---------------- 5. WEEKLY SCHEDULE : day filter + cross-fade grid ---------------- */
  const svDayTabs = document.getElementById('svDayTabs');
  const svScheduleGrid = document.getElementById('svScheduleGrid');
  if (svDayTabs && svScheduleGrid) {
    const SV_SCHEDULE = {
      mon: [
        { time: '6:00 AM', title: 'Strength — Squat Focus', coach: 'Marcus Webb', spots: '3 left', tag: 'strength' },
        { time: '12:00 PM', title: 'HIIT Conditioning', coach: 'Priya Nair', spots: '6 left', tag: 'hiit' },
        { time: '6:30 PM', title: 'Boxing Fundamentals', coach: 'Renata Silva', spots: '2 left', tag: 'box' },
      ],
      tue: [
        { time: '7:00 AM', title: 'Yoga & Mobility', coach: 'Amara Chen', spots: '5 left', tag: 'yoga' },
        { time: '5:30 PM', title: '1:1 Coaching Slot', coach: 'Daniel Ortiz', spots: '1 left', tag: 'pt' },
        { time: '7:00 PM', title: 'Strength — Pull Day', coach: 'Marcus Webb', spots: '4 left', tag: 'strength' },
      ],
      wed: [
        { time: '6:00 AM', title: 'HIIT Conditioning', coach: 'Priya Nair', spots: '7 left', tag: 'hiit' },
        { time: '12:30 PM', title: 'Boxing Pad Rounds', coach: 'Renata Silva', spots: '3 left', tag: 'box' },
        { time: '6:00 PM', title: 'Recovery & Breathwork', coach: 'Amara Chen', spots: '6 left', tag: 'yoga' },
      ],
      thu: [
        { time: '6:00 AM', title: 'Strength — Press Focus', coach: 'Marcus Webb', spots: '2 left', tag: 'strength' },
        { time: '5:00 PM', title: '1:1 Coaching Slot', coach: 'Daniel Ortiz', spots: '1 left', tag: 'pt' },
        { time: '7:00 PM', title: 'HIIT Conditioning', coach: 'Priya Nair', spots: '5 left', tag: 'hiit' },
      ],
      fri: [
        { time: '7:00 AM', title: 'Boxing Fundamentals', coach: 'Renata Silva', spots: '4 left', tag: 'box' },
        { time: '12:00 PM', title: 'Yoga & Mobility', coach: 'Amara Chen', spots: '6 left', tag: 'yoga' },
        { time: '6:00 PM', title: 'Strength — Deadlift Day', coach: 'Marcus Webb', spots: '2 left', tag: 'strength' },
      ],
      sat: [
        { time: '9:00 AM', title: 'HIIT Conditioning', coach: 'Priya Nair', spots: '8 left', tag: 'hiit' },
        { time: '10:30 AM', title: 'Boxing Sparring Prep', coach: 'Renata Silva', spots: '3 left', tag: 'box' },
        { time: '12:00 PM', title: 'Recovery & Breathwork', coach: 'Amara Chen', spots: '7 left', tag: 'yoga' },
      ],
    };
    const svTagClass = { strength: '', box: 'tag-box', yoga: 'tag-yoga', hiit: 'tag-hiit', pt: 'tag-pt' };

    function svRenderSchedule(day) {
      const items = SV_SCHEDULE[day] || [];
      if (!items.length) {
        svScheduleGrid.innerHTML = '<p class="sv-slot-empty">No classes scheduled — the floor is open all day.</p>';
        return;
      }
      svScheduleGrid.innerHTML = items.map(item => `
        <div class="sv-slot-card ${svTagClass[item.tag] || ''}">
          <span class="sv-slot-time">${item.time}</span>
          <span class="sv-slot-title">${item.title}</span>
          <div class="sv-slot-meta">
            <span class="sv-slot-coach">${item.coach}</span>
            <span class="sv-slot-spots">${item.spots}</span>
          </div>
        </div>
      `).join('');
    }

    function svSwitchDay(day) {
      svScheduleGrid.classList.add('is-switching');
      setTimeout(() => {
        svRenderSchedule(day);
        svScheduleGrid.classList.remove('is-switching');
      }, 260);
    }

    svRenderSchedule('mon');

    svDayTabs.querySelectorAll('.sv-day-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        svDayTabs.querySelectorAll('.sv-day-tab').forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        svSwitchDay(tab.getAttribute('data-day'));
      });
    });
  }

  /* ---------------- 6. COMPARE PLANS : mouse spotlight + draw-in checks ---------------- */
  const svCompareWrap = document.getElementById('svCompareWrap');
  if (svCompareWrap) {
    const svSpotlight = document.getElementById('svSpotlight');
    if (svIsFinePointer && svSpotlight) {
      svCompareWrap.addEventListener('mousemove', (e) => {
        const r = svCompareWrap.getBoundingClientRect();
        svSpotlight.style.left = (e.clientX - r.left) + 'px';
        svSpotlight.style.top = (e.clientY - r.top) + 'px';
      });
      svCompareWrap.addEventListener('mouseenter', () => svCompareWrap.classList.add('is-hovering'));
      svCompareWrap.addEventListener('mouseleave', () => svCompareWrap.classList.remove('is-hovering'));
    }
    const svCompareIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          svCompareWrap.classList.add('is-inview');
          svCompareIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    svCompareIO.observe(svCompareWrap);
  }

  /* ---------------- 7. CTA : blob parallax + floating particles ---------------- */
  const svCta = document.querySelector('.sv-cta');
  if (svCta) {
    const svBlob1 = document.getElementById('svBlob1');
    const svBlob2 = document.getElementById('svBlob2');
    if (svIsFinePointer && svBlob1 && svBlob2) {
      svCta.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 40;
        const y = (e.clientY / window.innerHeight - 0.5) * 40;
        gsap.to(svBlob1, { x: x, y: y, duration: 1.2, ease: 'power2.out' });
        gsap.to(svBlob2, { x: -x, y: -y, duration: 1.2, ease: 'power2.out' });
      });
    }

    const svParticlesWrap = document.getElementById('svParticles');
    if (svParticlesWrap) {
      const svIcons = ['fa-solid fa-dumbbell', 'fa-solid fa-fire', 'fa-solid fa-bolt', 'fa-solid fa-heart-pulse'];
      for (let i = 0; i < 10; i++) {
        const span = document.createElement('span');
        span.className = 'sv-particle';
        span.innerHTML = `<i class="${svIcons[i % svIcons.length]}"></i>`;
        span.style.left = Math.random() * 100 + '%';
        span.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
        span.style.animationDuration = (8 + Math.random() * 6) + 's';
        span.style.animationDelay = (Math.random() * 10) + 's';
        svParticlesWrap.appendChild(span);
      }
    }
  }

});
/* ==========================================================================
   BLOG PAGE — new interactions (only run where the matching elements exist)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- HERO TITLE : split-flap kinetic reveal ---------------- */
  const blHeroTitle = document.getElementById('blHeroTitle');
  if (blHeroTitle && window.gsap) {
    const blText = blHeroTitle.textContent;
    blHeroTitle.innerHTML = blText.split('').map(ch =>
      `<span class="bl-flap">${ch === ' ' ? '&nbsp;' : ch}</span>`
    ).join('');
    gsap.to('#blHeroTitle .bl-flap', {
      opacity: 1, rotateX: 0, y: 0, duration: 0.75, ease: 'back.out(1.6)',
      stagger: 0.028, delay: 1.15
    });
  }

  /* ---------------- FEATURED : mouse-follow spotlight + gentle tilt ---------------- */
  const blFeatCard = document.getElementById('blFeatCard');
  const blFeatSpot = document.getElementById('blFeatSpot');
  const blIsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (blFeatCard && blFeatSpot && blIsFinePointer) {
    blFeatCard.addEventListener('mousemove', (e) => {
      const rect = blFeatCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      blFeatSpot.style.left = x + 'px';
      blFeatSpot.style.top = y + 'px';
      const rx = ((y / rect.height) - 0.5) * -4;
      const ry = ((x / rect.width) - 0.5) * 4;
      if (window.gsap) {
        gsap.to(blFeatCard, { rotateX: rx, rotateY: ry, duration: 0.6, ease: 'power2.out', transformPerspective: 1000 });
      }
    });
    blFeatCard.addEventListener('mouseleave', () => {
      if (window.gsap) gsap.to(blFeatCard, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power2.out' });
    });
  }

  /* ---------------- CATEGORIES : filter tabs + staggered entrance ---------------- */
  const blGrid = document.getElementById('blGrid');
  if (blGrid) {
    const blCards = blGrid.querySelectorAll('.bl-card');
    const blFilters = document.querySelectorAll('.bl-filter');
    const blEmpty = document.getElementById('blEmpty');

    const blCardIO = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('bl-in'), i * 70);
          blCardIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    blCards.forEach(c => blCardIO.observe(c));

    function applyBlFilter(filter) {
      let visibleCount = 0;
      blCards.forEach(card => {
        const match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('bl-hide', !match);
        if (match) visibleCount++;
      });
      if (blEmpty) blEmpty.classList.toggle('bl-show', visibleCount === 0);
    }

    blFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        blFilters.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        applyBlFilter(btn.getAttribute('data-filter'));
      });
    });

    // hero floating tags can jump straight to a filtered lane
    document.querySelectorAll('.bl-float-tag[data-filter]').forEach(tag => {
      tag.addEventListener('click', () => {
        const filter = tag.getAttribute('data-filter');
        const matchBtn = document.querySelector(`.bl-filter[data-filter="${filter}"]`);
        if (matchBtn) matchBtn.click();
      });
    });
  }

  /* ---------------- READING LOG : scroll-drawn connecting line + reveal ---------------- */
  const blLogPath = document.getElementById('blLogPath');
  const blLogWrap = document.querySelector('.bl-log-wrap');
  if (blLogPath && blLogWrap) {
    const blPathLength = blLogWrap.offsetHeight || 1000;
    blLogPath.setAttribute('d', `M2,0 L2,${blPathLength}`);
    const blTotalLength = blLogPath.getTotalLength();
    blLogPath.style.strokeDasharray = blTotalLength;
    blLogPath.style.strokeDashoffset = blTotalLength;
    blLogPath.classList.add('bl-draw');

    function updateBlLogLine() {
      const rect = blLogWrap.getBoundingClientRect();
      const winH = window.innerHeight;
      const total = rect.height + winH;
      const scrolled = winH - rect.top;
      const pct = Math.min(1, Math.max(0, scrolled / total));
      blLogPath.style.strokeDashoffset = blTotalLength * (1 - pct);
    }
    window.addEventListener('scroll', updateBlLogLine, { passive: true });
    window.addEventListener('resize', updateBlLogLine);
    updateBlLogLine();

    const blLogItems = document.querySelectorAll('.bl-log-item');
    const blLogIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('bl-seen');
          blLogIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    blLogItems.forEach(item => blLogIO.observe(item));
  }

  /* ---------------- SHELF : coverflow drag carousel ---------------- */
  const blCfTrack = document.getElementById('blCfTrack');
  if (blCfTrack) {
    const blCfCards = Array.from(blCfTrack.querySelectorAll('.bl-cf-card'));
    const blCfPrev = document.getElementById('blCfPrev');
    const blCfNext = document.getElementById('blCfNext');
    const blCfDotsWrap = document.getElementById('blCfDots');

    blCfCards.forEach((card, i) => {
      const dot = document.createElement('span');
      dot.addEventListener('click', () => card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }));
      blCfDotsWrap.appendChild(dot);
    });
    const blCfDots = Array.from(blCfDotsWrap.children);

    function updateCoverflow() {
      const trackRect = blCfTrack.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;
      let closestIdx = 0, closestDist = Infinity;
      blCfCards.forEach((card, i) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const dist = Math.abs(center - cardCenter);
        card.classList.toggle('is-center', dist < cardRect.width / 2);
        if (dist < closestDist) { closestDist = dist; closestIdx = i; }
      });
      blCfDots.forEach((d, i) => d.classList.toggle('is-active', i === closestIdx));
    }
    blCfTrack.addEventListener('scroll', updateCoverflow, { passive: true });
    updateCoverflow();

    const stepW = () => (blCfCards[0] ? blCfCards[0].offsetWidth + 26 : 280);
    if (blCfNext) blCfNext.addEventListener('click', () => blCfTrack.scrollBy({ left: stepW(), behavior: 'smooth' }));
    if (blCfPrev) blCfPrev.addEventListener('click', () => blCfTrack.scrollBy({ left: -stepW(), behavior: 'smooth' }));

    // click-and-drag on desktop
    let blCfDragging = false, blCfStartX = 0, blCfScrollStart = 0;
    blCfTrack.addEventListener('mousedown', (e) => {
      blCfDragging = true;
      blCfTrack.classList.add('dragging');
      blCfStartX = e.pageX;
      blCfScrollStart = blCfTrack.scrollLeft;
    });
    window.addEventListener('mouseup', () => { blCfDragging = false; blCfTrack.classList.remove('dragging'); });
    window.addEventListener('mousemove', (e) => {
      if (!blCfDragging) return;
      e.preventDefault();
      blCfTrack.scrollLeft = blCfScrollStart - (e.pageX - blCfStartX);
    });

    // autoplay, pauses on hover / drag
    let blCfAutoTimer = setInterval(() => {
      const atEnd = blCfTrack.scrollLeft + blCfTrack.clientWidth >= blCfTrack.scrollWidth - 10;
      blCfTrack.scrollBy({ left: atEnd ? -blCfTrack.scrollWidth : stepW(), behavior: 'smooth' });
    }, 3800);
    blCfTrack.addEventListener('mouseenter', () => clearInterval(blCfAutoTimer));
    blCfTrack.addEventListener('touchstart', () => clearInterval(blCfAutoTimer), { passive: true });
  }

  /* ---------------- AUTHORS : orbiting coach ring ---------------- */
  const blOrbit = document.getElementById('blOrbit');
  if (blOrbit) {
    const blSats = blOrbit.querySelectorAll('.bl-sat');
    const blDetailImg = document.getElementById('blOrbitDetailImg');
    const blDetailName = document.getElementById('blOrbitDetailName');
    const blDetailRole = document.getElementById('blOrbitDetailRole');
    const blDetailCount = document.getElementById('blOrbitDetailCount');

    blOrbit.addEventListener('mouseenter', () => blOrbit.classList.add('is-paused'));
    blOrbit.addEventListener('mouseleave', () => blOrbit.classList.remove('is-paused'));

    function selectCoach(sat) {
      blSats.forEach(s => s.classList.remove('is-active'));
      sat.classList.add('is-active');
      const img = sat.querySelector('img');
      if (blDetailImg && img) blDetailImg.src = img.src;
      if (blDetailName) blDetailName.textContent = sat.getAttribute('data-name');
      if (blDetailRole) blDetailRole.textContent = sat.getAttribute('data-role');
      if (blDetailCount) blDetailCount.textContent = sat.getAttribute('data-count');
    }
    blSats.forEach(sat => {
      sat.addEventListener('click', () => selectCoach(sat));
      sat.addEventListener('touchstart', () => { blOrbit.classList.add('is-paused'); }, { passive: true });
    });
    if (blSats.length) selectCoach(blSats[0]);
  }

  /* ---------------- SUBSCRIBE : typewriter headline + floating bubbles + confetti ---------------- */
  const blTypewriter = document.getElementById('blTypewriter');
  if (blTypewriter) {
    const blPhrases = ['No hype.', 'No tips.', 'No spam.', 'Just the note.'];
    let blPhraseI = 0, blCharI = 0, blDeleting = false;

    function typeLoop() {
      const current = blPhrases[blPhraseI];
      if (!blDeleting) {
        blCharI++;
        blTypewriter.textContent = current.slice(0, blCharI);
        if (blCharI === current.length) {
          blDeleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        blCharI--;
        blTypewriter.textContent = current.slice(0, blCharI);
        if (blCharI === 0) {
          blDeleting = false;
          blPhraseI = (blPhraseI + 1) % blPhrases.length;
        }
      }
      setTimeout(typeLoop, blDeleting ? 40 : 80);
    }
    typeLoop();
  }

  const blBubbles = document.getElementById('blBubbles');
  if (blBubbles) {
    const blBubbleWords = ['PR day', 'Deload week', 'Ring notes', 'Rest, actually', 'Bar path', 'Block 6', 'Sunrise floor'];
    for (let i = 0; i < 8; i++) {
      const b = document.createElement('span');
      b.className = 'bl-bubble';
      b.textContent = blBubbleWords[i % blBubbleWords.length];
      b.style.left = Math.random() * 90 + '%';
      b.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
      b.style.animationDuration = (10 + Math.random() * 8) + 's';
      b.style.animationDelay = (Math.random() * 12) + 's';
      blBubbles.appendChild(b);
    }
  }

  const blSubForm = document.getElementById('blSubForm');
  if (blSubForm) {
    const blSubBtn = document.getElementById('blSubBtn');
    const blSubSuccess = document.getElementById('blSubSuccess');
    blSubForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rect = blSubBtn.getBoundingClientRect();
      for (let i = 0; i < 18; i++) {
        const piece = document.createElement('span');
        piece.className = 'bl-confetti';
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 70;
        piece.style.setProperty('--cx', Math.cos(angle) * dist + 'px');
        piece.style.setProperty('--cy', Math.sin(angle) * dist + 'px');
        piece.style.setProperty('--cr', (Math.random() * 360) + 'deg');
        piece.style.background = Math.random() > 0.5 ? 'var(--gold)' : 'var(--gold-2)';
        blSubBtn.appendChild(piece);
        piece.addEventListener('animationend', () => piece.remove());
      }
      if (blSubSuccess) blSubSuccess.classList.add('bl-show');
      blSubForm.reset();
    });
  }

  /* ---------------- COVERFLOW/TIMELINE RESIZE SAFETY ---------------- */
  window.addEventListener('resize', () => {
    const blLogWrapEl = document.querySelector('.bl-log-wrap');
    const blLogPathEl = document.getElementById('blLogPath');
    if (blLogWrapEl && blLogPathEl) {
      const h = blLogWrapEl.offsetHeight || 1000;
      blLogPathEl.setAttribute('d', `M2,0 L2,${h}`);
    }
  });

});
/* ==========================================================================
   CONTACT PAGE — new interactions (only run where the matching elements exist)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- HERO : tile-grid reveal ---------------- */
  const ctTileGrid = document.getElementById('ctTileGrid');
  if (ctTileGrid) {
    const ctTileTotal = 60;
    for (let i = 0; i < ctTileTotal; i++) {
      const tile = document.createElement('span');
      tile.style.setProperty('--tile-i', i);
      ctTileGrid.appendChild(tile);
    }
  }

  /* ---------------- FIND US : reveal address card once map is in view ---------------- */
  const ctMapWrap = document.querySelector('.ct-map-wrap');
  if (ctMapWrap) {
    const ctMapIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ctMapWrap.classList.add('ct-in-view');
          ctMapIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    ctMapIO.observe(ctMapWrap);
  }

   /* ---------------- CONTACT FORM : elastic labels + liquid-fill submit ---------------- */
  const ctForm = document.getElementById('ctForm');
  if (ctForm) {
    const ctSubmit = document.getElementById('ctSubmit');
    const ctFormSuccess = document.getElementById('ctFormSuccess');
    ctForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!ctForm.checkValidity()) {
        ctForm.reportValidity();
        return;
      }
      if (!ctSubmit || ctSubmit.classList.contains('is-sending')) return;
      ctSubmit.classList.add('is-sending');
      setTimeout(() => {
        ctSubmit.classList.add('is-done');
        if (ctFormSuccess) ctFormSuccess.classList.add('ct-show');
        setTimeout(() => {
          window.location.href = '404.html';
        }, 1200);
      }, 900);
    });
  }

    /* ---------------- CONTACT FORM : clear stale values if page is restored from bfcache ---------------- */
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      const ctForm = document.getElementById('ctForm');
      const ctSubmit = document.getElementById('ctSubmit');
      const ctFormSuccess = document.getElementById('ctFormSuccess');
      if (ctForm) ctForm.reset();
      if (ctSubmit) ctSubmit.classList.remove('is-sending', 'is-done');
      if (ctFormSuccess) ctFormSuccess.classList.remove('ct-show');
    }
  });

  /* ---------------- HOURS : live day/night arc dial ---------------- */
  const ctDialTrack = document.querySelector('.ct-dial-track');
  const ctDialIndicator = document.getElementById('ctDialIndicator');
  if (ctDialTrack && ctDialIndicator) {
    const ctDialTime = document.getElementById('ctDialTime');
    const ctDialStatus = document.getElementById('ctDialStatus');
    const ctTotalLength = ctDialTrack.getTotalLength();
    const ctHoursMap = {
      0: [8 * 60, 18 * 60],  // Sunday
      1: [5 * 60, 22 * 60],
      2: [5 * 60, 22 * 60],
      3: [5 * 60, 22 * 60],
      4: [5 * 60, 22 * 60],
      5: [5 * 60, 22 * 60],
      6: [7 * 60, 20 * 60],  // Saturday
    };

    function ctUpdateDial() {
      const now = new Date();
      const day = now.getDay();
      const minutes = now.getHours() * 60 + now.getMinutes();
      const [openM, closeM] = ctHoursMap[day];
      let frac = (minutes - openM) / (closeM - openM);
      const isOpen = frac >= 0 && frac <= 1;
      frac = Math.min(1, Math.max(0, frac));
      const pt = ctDialTrack.getPointAtLength(frac * ctTotalLength);
      ctDialIndicator.style.left = (pt.x / 240 * 100) + '%';
      ctDialIndicator.style.top = (pt.y / 130 * 100) + '%';
      ctDialIndicator.innerHTML = (now.getHours() >= 6 && now.getHours() < 18)
        ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
      if (ctDialTime) ctDialTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (ctDialStatus) {
        ctDialStatus.textContent = isOpen ? 'Open now' : 'Closed now';
        ctDialStatus.classList.toggle('ct-closed', !isOpen);
      }
    }
    ctUpdateDial();
    setInterval(ctUpdateDial, 30000);
  }

  /* ---------------- FAQ : chat-bubble Q&A with typing indicator ---------------- */
  document.querySelectorAll('.ct-chat-item').forEach(item => {
    const q = item.querySelector('.ct-chat-q');
    if (!q) return;
    let built = false;
    q.addEventListener('click', () => {
      if (item.classList.contains('is-open') || item.classList.contains('is-answered')) return;
      if (!built) {
        const typing = document.createElement('div');
        typing.className = 'ct-chat-typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        const answer = document.createElement('div');
        answer.className = 'ct-chat-a';
        answer.textContent = item.getAttribute('data-answer') || '';
        item.appendChild(typing);
        item.appendChild(answer);
        built = true;
      }
      item.classList.add('is-open');
      setTimeout(() => {
        item.classList.remove('is-open');
        item.classList.add('is-answered');
      }, 750);
    });
  });

  /* ---------------- CTA : perforated ticket reveal fallback ---------------- */
  const ctTicket = document.querySelector('.ct-ticket');
  if (ctTicket) {
    const ctTicketIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ctTicket.classList.add('is-open');
          ctTicketIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    ctTicketIO.observe(ctTicket);
  }

});