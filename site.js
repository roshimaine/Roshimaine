const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


(function () {
  const topBtn = document.getElementById('to-top');
  if (topBtn) {
    const t = () => topBtn.classList.toggle('show', window.scrollY > 400);
    window.addEventListener('scroll', t, { passive: true }); t();
  }
})();


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


const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


    fetch('projects.xml')
      .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(data => {
        const xml = new DOMParser().parseFromString(data, 'text/xml');
        const get = (el, name) => {
          const n = el.getElementsByTagName(name)[0];
          return n ? n.textContent.trim() : '';
        };
        const container = document.getElementById('project-container');
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
        document.getElementById('project-container').innerHTML =
          '<p class="loading">Projects will appear here once the site is hosted ✦ (browsers block XML loading from a local file).</p>';
      });


    const titleText = 'Roshimaine Arpon';
    const typed = document.getElementById('typed-text');
    let ci = 0;
    (function typeOnce() {
      if (ci < titleText.length) {
        typed.textContent += titleText.charAt(ci++);
        setTimeout(typeOnce, 100);
      }
    })();


    const words = ['emerging technology exploration', 'digital layouts', 'motion', 'animation', 'creative multimedia', 'cats ♡'];
    const wordEl = document.getElementById('rotating-word');
    let wi = 0;
    setInterval(() => {
      wordEl.classList.add('out');
      setTimeout(() => {
        wi = (wi + 1) % words.length;
        wordEl.textContent = words[wi];
        wordEl.classList.remove('out');
      }, 350);
    }, 2200);


    const links = [...document.querySelectorAll('.nav-menu a')];
    const sections = ['about', 'things-i-love', 'passion-projects', 'contact'].map(id => document.getElementById(id));
    function setActive() {
      let current = 'top';
      sections.forEach(s => { if (s.getBoundingClientRect().top < window.innerHeight * 0.4) current = s.id; });
      links.forEach(a => a.classList.toggle('active', a.dataset.target === current));
      document.getElementById('to-top').classList.toggle('show', window.scrollY > 400);
    }
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();

