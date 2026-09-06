/* =========================================================
   Best Of Kebab — main.js
   Every feature below checks that its DOM elements exist
   before wiring up, so this single file can be safely
   included on every page (home + legal pages) without
   throwing errors where a feature's markup isn't present.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------
     STATUS PILL + OPENING HOURS
     Every day 11:00 - 00:00 (confirmed via Google / heures.be)
  --------------------------------------------------------- */
  function initHours() {
    const list = document.getElementById('hoursList');
    const dot = document.getElementById('statusDot');
    const text = document.getElementById('statusText');
    if (!dot || !text) return; // status pill not on this page

    const schedule = [
      { d: 0, open: "11:00", close: "24:00" },
      { d: 1, open: "11:00", close: "24:00" },
      { d: 2, open: "11:00", close: "24:00" },
      { d: 3, open: "11:00", close: "24:00" },
      { d: 4, open: "11:00", close: "24:00" },
      { d: 5, open: "11:00", close: "24:00" },
      { d: 6, open: "11:00", close: "24:00" },
    ];
    const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

    function toMinutes(t) {
      const [h, m] = t.split(":").map(Number);
      return (h === 24 ? 24 * 60 : h * 60 + m);
    }

    const now = new Date();
    const today = now.getDay();

    if (list) {
      list.innerHTML = "";
      schedule.forEach(row => {
        const div = document.createElement('div');
        div.className = 'hours-row' + (row.d === today ? ' today' : '');
        div.innerHTML = `<span>${dayNames[row.d]}</span><span>${row.open} – ${row.close === "24:00" ? "00:00" : row.close}</span>`;
        list.appendChild(div);
      });
    }

    const nowMin = now.getHours() * 60 + now.getMinutes();
    const todayRow = schedule.find(r => r.d === today);
    const isOpen = nowMin >= toMinutes(todayRow.open) && nowMin < toMinutes(todayRow.close);
    if (isOpen) {
      dot.classList.remove('closed');
      text.textContent = "Ouvert · ferme à minuit";
    } else {
      dot.classList.add('closed');
      text.textContent = "Fermé · ouvre à 11h";
    }
  }

  /* ---------------------------------------------------------
     MENU TABS
  --------------------------------------------------------- */
  let tabs = [];
  let panels = [];
  function initMenuTabs() {
    tabs = Array.from(document.querySelectorAll('.menu-tab'));
    panels = Array.from(document.querySelectorAll('.menu-panel'));
    if (tabs.length === 0 || panels.length === 0) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const search = document.getElementById('menuSearch');
        if (search && search.value.trim().length > 0) {
          search.value = '';
          search.dispatchEvent(new Event('input'));
        }
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const target = document.querySelector(`.menu-panel[data-panel="${tab.dataset.tab}"]`);
        if (target) target.classList.add('active');
      });
    });
  }

  /* ---------------------------------------------------------
     MODALS (cookie preferences, etc.)
  --------------------------------------------------------- */
  window.openModal = function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('show');
    document.body.style.overflow = 'hidden';
  };
  window.closeModal = function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('show');
    document.body.style.overflow = '';
  };
  function initModals() {
    document.querySelectorAll('.modal-overlay').forEach(ov => {
      ov.addEventListener('click', (e) => { if (e.target === ov) window.closeModal(ov.id); });
    });
  }

  /* ---------------------------------------------------------
     COOKIE CONSENT (localStorage with in-memory fallback,
     so it degrades gracefully in sandboxed previews)
  --------------------------------------------------------- */
  let memoryStore = {};
  function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return memoryStore[key] ?? null; }
  }
  function storageSet(key, val) {
    try { localStorage.setItem(key, val); } catch (e) { memoryStore[key] = val; }
  }
  function getConsent() {
    const raw = storageGet('bok_cookie_consent');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }
  function applyConsent(consent) {
    const a = document.getElementById('prefAnalytics');
    const p = document.getElementById('prefPreferences');
    if (a) a.checked = !!consent.analytics;
    if (p) p.checked = !!consent.preferences;
  }

  window.cookieChoice = function (mode) {
    const banner = document.getElementById('cookieBanner');
    const consent = mode === 'accept'
      ? { analytics: true, preferences: true }
      : { analytics: false, preferences: false };
    storageSet('bok_cookie_consent', JSON.stringify(consent));
    applyConsent(consent);
    if (banner) banner.classList.remove('show');
    window.closeModal('modalPrefs');
  };

  window.openCookiePrefs = function () {
    const consent = getConsent() || { analytics: false, preferences: false };
    applyConsent(consent);
    window.openModal('modalPrefs');
  };

  window.saveCookiePrefs = function () {
    const a = document.getElementById('prefAnalytics');
    const p = document.getElementById('prefPreferences');
    const banner = document.getElementById('cookieBanner');
    const consent = {
      analytics: a ? a.checked : false,
      preferences: p ? p.checked : false
    };
    storageSet('bok_cookie_consent', JSON.stringify(consent));
    if (banner) banner.classList.remove('show');
    window.closeModal('modalPrefs');
  };

  function initCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (!banner) return; // banner markup only lives on pages that include it
    const existing = getConsent();
    if (!existing) {
      setTimeout(() => banner.classList.add('show'), 900);
    }
  }

  /* ---------------------------------------------------------
     MENU SEARCH
  --------------------------------------------------------- */
  function initMenuSearch() {
    const menuSearch = document.getElementById('menuSearch');
    const menuTabsBar = document.getElementById('menuTabs');
    if (!menuSearch || !menuTabsBar || tabs.length === 0) return;

    let lastActiveTab = (tabs.find(t => t.classList.contains('active')) || tabs[0]).dataset.tab;

    function clearSearchUI() {
      panels.forEach(p => {
        p.querySelectorAll('.menu-row').forEach(r => r.classList.remove('hidden'));
        const nr = p.querySelector('.no-results'); if (nr) nr.remove();
        p.classList.remove('active');
      });
      const tabBtn = document.querySelector(`.menu-tab[data-tab="${lastActiveTab}"]`);
      tabs.forEach(t => t.classList.remove('active'));
      if (tabBtn) tabBtn.classList.add('active');
      const panelToShow = document.querySelector(`.menu-panel[data-panel="${lastActiveTab}"]`);
      if (panelToShow) panelToShow.classList.add('active');
    }

    menuSearch.addEventListener('input', () => {
      const q = menuSearch.value.trim().toLowerCase();

      if (q.length === 0) {
        menuTabsBar.style.display = '';
        clearSearchUI();
        return;
      }

      const currentActive = document.querySelector('.menu-tab.active');
      if (currentActive) lastActiveTab = currentActive.dataset.tab;

      menuTabsBar.style.display = 'none';
      tabs.forEach(t => t.classList.remove('active'));

      let anyMatchGlobal = false;
      panels.forEach(p => {
        let panelHasMatch = false;
        const rows = p.querySelectorAll('.menu-row');
        rows.forEach(row => {
          const nameEl = row.querySelector('.name');
          const name = nameEl ? nameEl.textContent.toLowerCase() : '';
          const match = name.includes(q);
          row.classList.toggle('hidden', !match);
          if (match) { panelHasMatch = true; anyMatchGlobal = true; }
        });

        let nr = p.querySelector('.no-results');
        if (rows.length > 0) {
          if (panelHasMatch) {
            p.classList.add('active');
            if (nr) nr.classList.remove('show');
          } else {
            p.classList.remove('active');
          }
        } else {
          p.classList.remove('active');
        }
      });

      if (!anyMatchGlobal && panels[0]) {
        const first = panels[0];
        first.classList.add('active');
        let nr = first.querySelector('.no-results');
        if (!nr) {
          nr = document.createElement('p');
          nr.className = 'no-results';
          first.appendChild(nr);
        }
        nr.textContent = "Aucun plat ne correspond à « " + menuSearch.value.trim() + " ». Essayez un autre mot-clé.";
        nr.classList.add('show');
      }
    });
  }

  /* ---------------------------------------------------------
     ACCORDION (allergens, FAQ, etc.)
  --------------------------------------------------------- */
  function initAccordion() {
    document.querySelectorAll('.accordion-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.accordion-item');
        if (!item) return;
        const panel = item.querySelector('.accordion-panel');
        if (!panel) return;
        const isOpen = item.classList.contains('open');
        if (isOpen) {
          panel.style.maxHeight = null;
          item.classList.remove('open');
        } else {
          item.classList.add('open');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---------------------------------------------------------
     SCROLL REVEAL
  --------------------------------------------------------- */
  function initScrollReveal() {
    const revealTargets = document.querySelectorAll('.section');
    if (revealTargets.length === 0 || !('IntersectionObserver' in window)) return;
    revealTargets.forEach(el => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => io.observe(el));
  }

  /* ---------------------------------------------------------
     BACK TO TOP
  --------------------------------------------------------- */
  function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 700);
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------------------------------------------------------
     ANIMATED COUNT-UP (rating score & review count)
     Any element with a [data-target] attribute counts up from 0
     to that value once its containing .rating-hero scrolls into
     view. Decimal targets (e.g. "4.3") are detected automatically.
  --------------------------------------------------------- */
  function initCountUp() {
    const targets = Array.from(document.querySelectorAll('[data-target]'));
    if (targets.length === 0) return;

    let played = false;
    function play() {
      if (played) return;
      played = true;
      const duration = 1100;
      const start = performance.now();
      function frame(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        targets.forEach(el => {
          const target = parseFloat(el.dataset.target);
          const isDecimal = el.dataset.target.includes('.');
          const val = target * eased;
          el.textContent = isDecimal ? val.toFixed(1).replace('.', ',') : Math.round(val).toString();
        });
        if (p < 1) {
          requestAnimationFrame(frame);
        } else {
          targets.forEach(el => {
            const target = parseFloat(el.dataset.target);
            const isDecimal = el.dataset.target.includes('.');
            el.textContent = isDecimal ? target.toFixed(1).replace('.', ',') : target.toString();
          });
        }
      }
      requestAnimationFrame(frame);
    }

    const hero = document.querySelector('.rating-hero');
    if (hero && 'IntersectionObserver' in window) {
      const countIo = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { play(); countIo.unobserve(entry.target); } });
      }, { threshold: 0.4 });
      countIo.observe(hero);
    } else {
      play();
    }
  }

  /* ---------------------------------------------------------
     TESTIMONIALS
     The infinite scroll is handled entirely by a CSS animation
     on .testi-carousel (see css/style.css) — the markup already
     contains a duplicated, aria-hidden set of cards for a seamless
     loop. No JavaScript is needed here, which means it can never
     be paused, stalled, or broken by a window resize.
  --------------------------------------------------------- */

  /* ---------------------------------------------------------
     CONTACT FORM (mailto — this is a static site, no backend)
  --------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('cf-name')?.value || '';
      const email = document.getElementById('cf-email')?.value || '';
      const message = document.getElementById('cf-message')?.value || '';
      const subject = encodeURIComponent('Message depuis le site — ' + name);
      const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
      window.location.href = `mailto:contact@bestofkebabetterbeek.be?subject=${subject}&body=${body}`;
      const status = document.getElementById('formStatus');
      if (status) status.classList.add('show');
    });
  }

  /* ---------------------------------------------------------
     INIT — every function guards its own DOM requirements,
     so it's safe to call all of them on every page.
  --------------------------------------------------------- */
  initHours();
  initMenuTabs();
  initModals();
  initCookieBanner();
  initMenuSearch();
  initAccordion();
  initScrollReveal();
  initBackToTop();
  initCountUp();
  initContactForm();
});
