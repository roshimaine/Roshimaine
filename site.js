(function () {
  'use strict';


  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


  const typed = document.getElementById('typed-text');
  if (typed) {
    const titleText = 'Roshimaine Arpon';
    let ci = 0;
    (function typeOnce() {
      if (ci < titleText.length) {
        typed.textContent += titleText.charAt(ci++);
        setTimeout(typeOnce, 100);
      }
    })();
  }


  const wordEl = document.getElementById('rotating-word');
  if (wordEl) {
    const words = (wordEl.dataset.words || wordEl.textContent).split('|').map(w => w.trim()).filter(Boolean);
    let wi = 0;
    if (words.length > 1) {
      setInterval(() => {
        wordEl.classList.add('out');
        setTimeout(() => {
          wi = (wi + 1) % words.length;
          wordEl.textContent = words[wi];
          wordEl.classList.remove('out');
        }, 350);
      }, 2200);
    }
  }

  const container = document.getElementById('project-container');
  if (container) {
    fetch('projects.xml')
      .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(data => {
        const xml = new DOMParser().parseFromString(data, 'text/xml');
        const get = (el, name) => {
          const n = el.getElementsByTagName(name)[0];
          return n ? n.textContent.trim() : '';
        };
        container.textContent = '';
        [...xml.getElementsByTagName('project')].forEach((p, i) => {
          const card = document.createElement('article');
          card.className = 'project-item';
          card.style.setProperty('--i', i);

          const top = document.createElement('div');
          top.className = 'project-top';
          const emoji = document.createElement('span');
          emoji.className = 'project-emoji';
          emoji.textContent = get(p, 'emoji') || '✦';
          const date = document.createElement('span');
          date.className = 'project-date';
          date.textContent = get(p, 'date');
          top.append(emoji, date);

          const title = document.createElement('h3');
          title.className = 'project-title';
          title.textContent = get(p, 'title');

          const badges = document.createElement('div');
          badges.className = 'badges';
          const tag = get(p, 'tag');
          if (tag) { const b = document.createElement('span'); b.className = 'badge'; b.textContent = tag; badges.append(b); }
          const status = get(p, 'status');
          if (status) { const b = document.createElement('span'); b.className = 'badge badge-status'; b.textContent = status; badges.append(b); }

          const desc = document.createElement('p');
          desc.className = 'project-desc';
          desc.textContent = get(p, 'description');

          card.append(top, title, badges, desc);
          container.append(card);
          observer.observe(card);
        });
      })
      .catch(err => {
        console.error('Error loading XML file:', err);
        container.innerHTML = '<p class="loading">Projects will appear here once the site is hosted ✦</p>';
      });
  }

  const links = [...document.querySelectorAll('.nav-menu a[data-target]')];
  if (links.length) {
    const sections = links.map(a => document.getElementById(a.dataset.target)).filter(Boolean);
    const setActive = () => {
      let current = 'top';
      sections.forEach(s => { if (s.id !== 'top' && s.getBoundingClientRect().top < window.innerHeight * 0.4) current = s.id; });
      links.forEach(a => a.classList.toggle('active', a.dataset.target === current));
    };
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }

  const topBtn = document.getElementById('to-top');
  if (topBtn) {
    const t = () => topBtn.classList.toggle('show', window.scrollY > 400);
    window.addEventListener('scroll', t, { passive: true });
    t();
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  if (!reduce && fine) {
    const glyphs = ['✦', '✧', '♡', '·'];
    const colors = ['#d3567e', '#f4a6c0', '#7fbfe8', '#a1cbee'];
    let last = 0;
    document.addEventListener('pointermove', e => {
      const now = performance.now();
      if (now - last < 45) return;
      last = now;
      const s = document.createElement('span');
      s.className = 'sparkle';
      s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      s.style.left = e.clientX + 'px';
      s.style.top = e.clientY + 'px';
      s.style.color = colors[Math.floor(Math.random() * colors.length)];
      s.style.setProperty('--dx', (Math.random() * 30 - 15) + 'px');
      s.style.setProperty('--sz', (10 + Math.random() * 12) + 'px');
      document.body.append(s);
      setTimeout(() => s.remove(), 900);
    });
    document.addEventListener('click', e => {
      for (let i = 0; i < 8; i++) {
        const s = document.createElement('span');
        s.className = 'sparkle burst';
        s.textContent = '♡';
        s.style.left = e.clientX + 'px';
        s.style.top = e.clientY + 'px';
        s.style.color = colors[i % colors.length];
        const a = (Math.PI * 2 * i) / 8;
        s.style.setProperty('--bx', Math.cos(a) * 40 + 'px');
        s.style.setProperty('--by', Math.sin(a) * 40 + 'px');
        document.body.append(s);
        setTimeout(() => s.remove(), 700);
      }
    });
  }

  function burst(x, y, glyphs, count, dist) {
    if (reduce) return;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle burst';
      s.textContent = glyphs[i % glyphs.length];
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      const a = (Math.PI * 2 * i) / count;
      const d = dist * (0.6 + Math.random() * 0.6);
      s.style.setProperty('--bx', Math.cos(a) * d + 'px');
      s.style.setProperty('--by', Math.sin(a) * d + 'px');
      document.body.append(s);
      setTimeout(() => s.remove(), 800);
    }
  }

  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    const root = document.documentElement;
    const apply = night => {
      if (night) root.setAttribute('data-theme', 'night'); else root.removeAttribute('data-theme');
      toggle.textContent = night ? '☀️' : '🌙';
      toggle.setAttribute('aria-pressed', String(night));
    };
    apply(root.getAttribute('data-theme') === 'night');
    toggle.addEventListener('click', () => {
      const night = root.getAttribute('data-theme') !== 'night';
      apply(night);
      try { localStorage.setItem('theme', night ? 'night' : 'day'); } catch (err) { /* ignore */ }
    });
  }


  const bar = document.getElementById('progress');
  if (bar) {
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }


  const hi = document.getElementById('greeting');
  if (hi) {
    const h = new Date().getHours();
    const g = h < 5 ? 'hi, night owl! ' : h < 12 ? 'good morning! ' : h < 18 ? 'good afternoon! ' : 'good evening! ';
    hi.textContent = '✧ ' + g + "i'm ✧";
  }


  const counters = [...document.querySelectorAll('[data-count]')];
  if (counters.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        const end = Number(en.target.dataset.count);
        const node = en.target.firstChild;
        const t0 = performance.now();
        const step = t => {
          const p = Math.min((t - t0) / 1200, 1);
          node.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(c => { if (!reduce) c.firstChild.textContent = '0'; io.observe(c); });
  }


  document.querySelectorAll('.love-icon.cat').forEach(cat => {
    const faces = ['😺', '😸', '😻', '😽', '🐱'];
    const sounds = ['meow ♡', 'purr~', 'mew!', 'nyaa ♡'];
    let i = 0;
    const pet = e => {
      e.stopPropagation();
      i = (i + 1) % faces.length;
      cat.textContent = faces[i];
      const r = cat.getBoundingClientRect();
      const m = document.createElement('span');
      m.className = 'meow';
      m.textContent = sounds[Math.floor(Math.random() * sounds.length)];
      m.style.left = r.left + r.width / 2 + 'px';
      m.style.top = r.top + 'px';
      document.body.append(m);
      setTimeout(() => m.remove(), 1000);
      burst(r.left + r.width / 2, r.top + r.height / 2, ['♡', '🐾', '✦'], 9, 55);
    };
    cat.addEventListener('click', pet);
    cat.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pet(e); } });
  });


  document.querySelectorAll('.love-icon[data-hover]').forEach(icon => {
    const card = icon.closest('.love-card');
    const original = icon.textContent;
    card.addEventListener('mouseenter', () => { icon.textContent = icon.dataset.hover; });
    card.addEventListener('mouseleave', () => { icon.textContent = original; });
  });


  const photo = document.querySelector('.profile-photo');
  if (photo) {
    photo.addEventListener('click', e => {
      e.stopPropagation();
      burst(e.clientX, e.clientY, ['🌸', '✦', '♡', '🐾', '✧'], 16, 75);
    });
  }


  (function liveCat() {
    const svg = `
<svg viewBox="0 0 100 100" aria-hidden="true">
  <ellipse cx="50" cy="96" rx="27" ry="4" fill="rgba(0,0,0,.14)"/>
  <g class="tail">
    <path d="M72 86 C94 86 98 62 85 54" fill="none" stroke="#7a4b5a" stroke-width="10" stroke-linecap="round"/>
    <path d="M72 86 C94 86 98 62 85 54" fill="none" stroke="#fff3ea" stroke-width="6" stroke-linecap="round"/>
    <path d="M89 58 C86 55 85 54 85 54" fill="none" stroke="#f4c7a8" stroke-width="6" stroke-linecap="round"/>
  </g>
  <ellipse cx="50" cy="78" rx="24" ry="19" fill="#fff3ea" stroke="#7a4b5a" stroke-width="2.5"/>
  <path d="M63 64 q9 5 6 15 q-9 -2 -6 -15z" fill="#f4c7a8"/>
  <ellipse cx="39" cy="92" rx="8.5" ry="5" fill="#fff3ea" stroke="#7a4b5a" stroke-width="2.5"/>
  <ellipse cx="61" cy="92" rx="8.5" ry="5" fill="#fff3ea" stroke="#7a4b5a" stroke-width="2.5"/>
  <path d="M26 30 L23 7 L43 20 Z" fill="#fff3ea" stroke="#7a4b5a" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M74 30 L77 7 L57 20 Z" fill="#fff3ea" stroke="#7a4b5a" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M29 25 L27.5 14 L37 20 Z" fill="#ffb3cd"/>
  <path d="M71 25 L72.5 14 L63 20 Z" fill="#ffb3cd"/>
  <ellipse cx="50" cy="40" rx="28" ry="22" fill="#fff3ea" stroke="#7a4b5a" stroke-width="2.5"/>
  <path d="M33 27 q7 -8 15 -8 q-3 9 -15 8z" fill="#f4c7a8"/>
  <path d="M44 63 l-9 -6 v12 z" fill="#ff8fb3"/><path d="M56 63 l9 -6 v12 z" fill="#ff8fb3"/><circle cx="50" cy="63" r="3.6" fill="#e0457b"/>
  <ellipse cx="29.5" cy="50" rx="5" ry="3" fill="#ffb3cd" opacity=".75"/>
  <ellipse cx="70.5" cy="50" rx="5" ry="3" fill="#ffb3cd" opacity=".75"/>
  <g class="eyes"><g class="pupils">
    <circle cx="39" cy="42" r="6" fill="#2b1d2b"/><circle cx="41.2" cy="39.6" r="2.2" fill="#fff"/><circle cx="37.2" cy="44.4" r="1" fill="#fff"/>
    <circle cx="61" cy="42" r="6" fill="#2b1d2b"/><circle cx="63.2" cy="39.6" r="2.2" fill="#fff"/><circle cx="59.2" cy="44.4" r="1" fill="#fff"/>
  </g></g>
  <g class="closed" fill="none" stroke="#2b1d2b" stroke-width="2.6" stroke-linecap="round">
    <path d="M33 42 q6 6 12 0"/><path d="M55 42 q6 6 12 0"/>
  </g>
  <g class="joy" fill="none" stroke="#2b1d2b" stroke-width="2.6" stroke-linecap="round">
    <path d="M33 45 q6 -8 12 0"/><path d="M55 45 q6 -8 12 0"/>
  </g>
  <path d="M47 49.5 h6 l-3 3.6z" fill="#ff8fb3"/>
  <path d="M50 53 q-3 4 -6.5 1.5 M50 53 q3 4 6.5 1.5" fill="none" stroke="#7a4b5a" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M21 46 l-10 -2 M21 51 l-10 2 M79 46 l10 -2 M79 51 l10 2" stroke="#7a4b5a" stroke-width="1.3" stroke-linecap="round" opacity=".55"/>
</svg>`;

    const cat = document.createElement('div');
    cat.className = 'live-cat';
    cat.setAttribute('role', 'button');
    cat.setAttribute('tabindex', '0');
    cat.setAttribute('aria-label', 'Pet the cat');
    cat.innerHTML = svg + '<span class="zzz" aria-hidden="true">z<small>z</small></span>';
    document.body.append(cat);

    const pupils = cat.querySelector('.pupils');
    const sounds = ['meow ♡', 'purr~', 'mrrp!', 'nyaa ♡', 'pet me more!'];
    let x = Math.max(20, window.innerWidth * 0.25);
    let state = 'idle';
    let timer = null;
    let lastActive = Date.now();

    const place = (nx, ms) => {
      cat.style.transitionDuration = ms + 'ms';
      cat.style.transform = 'translateX(' + nx + 'px)';
      x = nx;
    };
    const setState = st => {
      state = st;
      cat.classList.toggle('sleep', st === 'sleep');
      cat.classList.toggle('hop', st === 'walk');
      if (st === 'sleep') pupils.style.transform = '';
    };
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(decide, 2500 + Math.random() * 4500);
    };
    const wake = () => { if (state === 'sleep') { setState('idle'); schedule(); } };
    function decide() {
      if (state === 'sleep') return;
      if (Date.now() - lastActive > 20000) { setState('sleep'); return; }
      if (Math.random() < 0.65) walk(); else schedule();
    }
    function walk() {
      const room = Math.max(0, window.innerWidth - cat.offsetWidth - 16);
      const nx = 8 + Math.random() * room;
      const ms = Math.max(900, (Math.abs(nx - x) / 55) * 1000);
      cat.style.setProperty('--lean', nx > x ? '6deg' : '-6deg');
      setState('walk');
      place(nx, ms);
      clearTimeout(timer);
      timer = setTimeout(() => { setState('idle'); schedule(); }, ms + 50);
    }

    place(x, 0);
    if (!reduce) schedule();


    document.addEventListener('pointermove', e => {
      lastActive = Date.now();
      wake();
      if (state === 'sleep') return;
      const r = cat.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height * 0.4);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 200);
      pupils.style.transform = 'translate(' + (dx / d) * 2.6 * k + 'px,' + (dy / d) * 2.2 * k + 'px)';
    });
    window.addEventListener('scroll', () => { lastActive = Date.now(); wake(); }, { passive: true });
    window.addEventListener('resize', () => {
      const max = Math.max(8, window.innerWidth - cat.offsetWidth - 8);
      if (x > max) place(max, 0);
    });


    const pet = e => {
      e.stopPropagation();
      lastActive = Date.now();
      if (state === 'walk') { place(cat.getBoundingClientRect().left, 0); clearTimeout(timer); }
      setState('idle');
      cat.classList.add('happy');
      setTimeout(() => cat.classList.remove('happy'), 900);
      const r = cat.getBoundingClientRect();
      const m = document.createElement('span');
      m.className = 'meow';
      m.textContent = sounds[Math.floor(Math.random() * sounds.length)];
      m.style.left = r.left + r.width / 2 + 'px';
      m.style.top = r.top + 'px';
      document.body.append(m);
      setTimeout(() => m.remove(), 1000);
      burst(r.left + r.width / 2, r.top + r.height * 0.35, ['♡', '🐾', '✦', '♡'], 10, 60);
      if (!reduce) schedule();
    };
    cat.addEventListener('click', pet);
    cat.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pet(e); }
    });
  })();

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
