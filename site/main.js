/* ==========================================================================
   bywadoo.life — rendering from data.js, live GitHub details, and motion.
   ========================================================================== */
(function () {
  'use strict';

  var SITE = window.SITE || { projects: [], freelance: [], experience: [], stack: [], categories: [] };
  var root = document.documentElement;
  var page = document.body.getAttribute('data-page');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  var ARROW = '<svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var EXT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';
  var PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z"/></svg>';

  // One glyph per project, drawn as simple line icons.
  var GLYPHS = {
    avt: '<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    shs: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18"/><path d="m9 14 2 2 4-4"/>',
    receptionist: '<path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z"/><path d="M19 11a7 7 0 0 1-14 0M12 18v3"/>',
    heart: '<path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 1 1 12 6a5 5 0 1 1 7.5 6.6Z"/><path d="M3.5 12h4l2-3 3 5 2-2h6"/>',
    finance: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-7"/><circle cx="17" cy="7" r="1.5"/>',
    crop: '<path d="M12 21V11"/><path d="M12 11C12 7 9 4 4 4c0 4 3 7 8 7Z"/><path d="M12 14c0-4 3-7 8-7 0 4-3 7-8 7Z"/>',
    gpa: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M8 18h2M12 18h2M16 15v3"/>',
    pyramid: '<path d="M3 20 12 4l9 16H3Z"/><path d="M12 4v16"/>',
    aksa: '<path d="M3 20h18M5 20V10l7-5 7 5v10"/><path d="M10 20v-5h4v5"/>',
    firdoos: '<path d="M12 21c-4-3-7-6.5-7-10.5A7 7 0 0 1 12 3a7 7 0 0 1 7 7.5c0 4-3 7.5-7 10.5Z"/><circle cx="12" cy="10" r="2.5"/>'
  };
  function glyph(id) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (GLYPHS[id] || GLYPHS.shs) + '</svg>';
  }

  var KIND = { mern: 'Full stack · MERN', ai: 'AI & machine learning', web: 'Web tool' };

  function linkButtons(links, name, small) {
    var out = [];
    var size = small ? ' btn--sm' : '';
    if (links.live) out.push('<a class="btn btn--primary' + size + '" href="' + esc(links.live) + '">Visit site<span class="sr-only">: ' + esc(name) + '</span>' + EXT + '</a>');
    if (links.demo) out.push('<a class="btn btn--primary' + size + '" href="' + esc(links.demo) + '">Live demo<span class="sr-only">: ' + esc(name) + '</span>' + EXT + '</a>');
    if (links.code) out.push('<a class="btn btn--ghost' + size + '" href="' + esc(links.code) + '">Code<span class="sr-only">: ' + esc(name) + '</span></a>');
    return out.join('');
  }
  function tags(list) {
    return '<ul class="tags" aria-label="Built with">' + list.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
  }
  function meta(repo) {
    return repo ? '<p class="meta is-loading" data-gh="' + esc(repo) + '"></p>' : '';
  }

  /* ---------- Rendering: home ---------- */
  function renderHome() {
    var tl = $('[data-timeline-list]');
    if (tl) {
      tl.insertAdjacentHTML('beforeend', SITE.experience.map(function (e) {
        return '<li class="exp' + (e.current ? ' exp--current' : '') + '" data-reveal="left">' +
          '<span class="exp__dot" aria-hidden="true"></span>' +
          '<p class="exp__when">' + esc(e.when) + '</p>' +
          '<h3>' + esc(e.role) + (e.current ? '<span class="badge-now">Now</span>' : '') + '</h3>' +
          '<p class="exp__org">' + esc(e.org) + '</p>' +
          '<p>' + esc(e.text) + '</p>' +
          (e.link ? '<a class="link" href="' + esc(e.link.href) + '">' + esc(e.link.label) + ARROW + '</a>' : '') +
          '</li>';
      }).join(''));
    }

    var tiles = $('[data-featured]');
    if (tiles) {
      tiles.innerHTML = SITE.projects.filter(function (p) { return p.featured; }).map(function (p, i) {
        var media = p.image
          ? '<div class="tile__media" data-parallax="0.06"><img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || '') + '" loading="lazy" decoding="async" width="1440" height="900" /></div>'
          : '<div class="tile__glyph" data-parallax="0.08">' + glyph(p.id) + '</div>';
        return '<article class="tile" data-tint="' + esc(p.tint) + '" data-reveal="scale" style="--d:' + (i % 2) * 100 + 'ms">' +
          '<a class="tile__overlay" href="projects.html#' + esc(p.id) + '" aria-label="' + esc(p.name) + ': details on the projects page"></a>' +
          '<p class="tile__kind">' + esc(KIND[p.category] || '') + '</p>' +
          '<h3>' + esc(p.name) + '</h3>' +
          '<p class="tile__tagline">' + esc(p.tagline) + '</p>' +
          '<div class="tile__foot">' + linkButtons(p.links, p.name, true) + meta(p.repo) + '</div>' +
          media + '</article>';
      }).join('');
    }

    var band = $('[data-band-clients]');
    if (band) {
      band.innerHTML = SITE.freelance.map(function (c) {
        return '<a href="' + esc(c.links.live || 'freelance.html') + '">' + esc(c.name) + EXT + '</a>';
      }).join('');
    }

    var mq = $('[data-marquee]');
    if (mq) {
      var tints = ['blue', 'purple', 'pink', 'orange', 'green', 'teal', 'indigo', 'yellow'];
      var half = Math.ceil(SITE.stack.length / 2);
      var rows = [SITE.stack.slice(0, half), SITE.stack.slice(half)];
      mq.innerHTML = rows.map(function (row, r) {
        var chips = row.map(function (t, i) {
          return '<li class="chip" data-tint="' + tints[(i + r * 3) % tints.length] + '"><i aria-hidden="true"></i>' + esc(t) + '</li>';
        }).join('');
        // The second copy makes the loop seamless; it is hidden from screen readers.
        return '<ul class="marquee__row" data-dir="' + (r ? 1 : -1) + '">' + chips + '</ul>';
      }).join('');
      $$('.marquee__row', mq).forEach(function (row) {
        var clone = row.innerHTML;
        row.insertAdjacentHTML('beforeend', clone.replace(/<li /g, '<li aria-hidden="true" '));
        row.insertAdjacentHTML('beforeend', clone.replace(/<li /g, '<li aria-hidden="true" '));
      });
    }
  }

  /* ---------- Rendering: projects ---------- */
  function cardHTML(p, i) {
    var cover = p.image
      ? '<img src="' + esc(p.image) + '" alt="" loading="lazy" decoding="async" />'
      : '<span class="glyph">' + glyph(p.id) + '</span>';
    var details = '';
    if (p.points && p.points.length) {
      details = '<details class="details"><summary>How it works' + PLUS + '</summary><div class="details__body">' +
        '<ul>' + p.points.map(function (pt) { return '<li>' + esc(pt) + '</li>'; }).join('') + '</ul>' +
        (p.stats ? '<dl class="stats">' + p.stats.map(function (s) { return '<div><dt>' + esc(s[1]) + '</dt><dd>' + esc(s[0]) + '</dd></div>'; }).join('') + '</dl>' : '') +
        '</div></details>';
    }
    return '<article class="card" id="' + esc(p.id) + '" data-tint="' + esc(p.tint) + '" data-category="' + esc(p.category) + '" data-reveal="scale" style="--d:' + (i % 3) * 80 + 'ms">' +
      '<div class="card__cover">' + cover + '<span class="card__shine" aria-hidden="true"></span></div>' +
      '<div class="card__body">' +
      '<p class="card__kind">' + esc(KIND[p.category] || '') + '</p>' +
      '<h3>' + esc(p.name) + '</h3>' +
      '<p>' + esc(p.summary) + '</p>' +
      tags(p.stack) + meta(p.repo) + details +
      '<div class="card__links">' + linkButtons(p.links, p.name, true) + '</div>' +
      '</div></article>';
  }

  function renderProjects() {
    var grid = $('[data-grid]');
    if (!grid) return;
    grid.innerHTML = SITE.projects.map(cardHTML).join('');
    var total = $('[data-count-total]');
    if (total) total.setAttribute('data-count-to', SITE.projects.length);

    var seg = $('[data-filters]');
    var thumb = $('.seg__thumb', seg);
    var status = $('[data-filter-status]');
    SITE.categories.forEach(function (c) {
      var n = c.id === 'all' ? SITE.projects.length : SITE.projects.filter(function (p) { return p.category === c.id; }).length;
      if (!n) return;
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('data-filter', c.id);
      b.setAttribute('aria-pressed', 'false');
      b.innerHTML = esc(c.label) + '<span>' + n + '</span>';
      seg.appendChild(b);
    });

    function moveThumb(btn, instant) {
      if (!btn || !thumb) return;
      if (instant) thumb.style.transition = 'none';
      thumb.style.width = btn.offsetWidth + 'px';
      thumb.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
      if (instant) { void thumb.offsetWidth; thumb.style.transition = ''; }
    }

    function apply(filter, animate) {
      var cards = $$('.card', grid);
      var first = new Map();
      if (animate && !reduceMotion) cards.forEach(function (c) { if (!c.hidden) first.set(c, c.getBoundingClientRect()); });

      var shown = 0;
      cards.forEach(function (c) {
        var show = filter === 'all' || c.getAttribute('data-category') === filter;
        c.hidden = !show;
        if (show) { shown++; c.classList.add('is-in'); }
      });
      $$('button', seg).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === filter)); });
      moveThumb($('button[aria-pressed="true"]', seg), !animate);
      if (status) status.textContent = 'Showing ' + shown + ' project' + (shown === 1 ? '' : 's') + '.';

      // FLIP: cards that stay glide to their new spot; new ones pop in.
      if (animate && !reduceMotion && grid.animate) {
        cards.forEach(function (c) {
          if (c.hidden) return;
          var last = c.getBoundingClientRect();
          var f = first.get(c);
          if (f) {
            var dx = f.left - last.left, dy = f.top - last.top;
            if (dx || dy) c.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
          } else {
            c.animate([{ opacity: 0, transform: 'scale(0.92) translateY(20px)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
          }
        });
      }
      try {
        var url = new URL(location.href);
        if (filter === 'all') url.searchParams.delete('filter'); else url.searchParams.set('filter', filter);
        history.replaceState(null, '', url);
      } catch (e) {}
    }

    seg.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-filter]');
      if (b) apply(b.getAttribute('data-filter'), true);
    });
    var initial = 'all';
    try { initial = new URL(location.href).searchParams.get('filter') || 'all'; } catch (e) {}
    if (!$('button[data-filter="' + initial + '"]', seg)) initial = 'all';
    apply(initial, false);
    window.addEventListener('resize', function () { moveThumb($('button[aria-pressed="true"]', seg), true); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveThumb($('button[aria-pressed="true"]', seg), true); });

    // Deep link from the home page, e.g. projects.html#avt
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target && target.classList.contains('card')) {
        if (target.hidden) apply('all', false);
        setTimeout(function () {
          target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
          target.classList.add('is-in');
          var d = $('details', target); if (d) d.open = true;
          if (target.animate && !reduceMotion) target.animate([{ boxShadow: '0 0 0 0 var(--tint)' }, { boxShadow: '0 0 0 6px var(--tint)' }, { boxShadow: '0 0 0 0 var(--tint)' }], { duration: 1400, delay: 500, easing: 'ease-out' });
        }, 350);
      }
    }
  }

  /* ---------- Rendering: freelance ---------- */
  function renderFreelance() {
    var wrap = $('[data-clients]');
    if (!wrap) return;
    wrap.innerHTML = SITE.freelance.map(function (c) {
      var host = '';
      try { host = new URL(c.links.live).host + new URL(c.links.live).pathname.replace(/\/$/, ''); } catch (e) {}
      return '<article class="client" data-tint="' + esc(c.tint) + '" data-reveal="scale">' +
        '<a class="browser" href="' + esc(c.links.live || '#') + '" tabindex="-1" aria-hidden="true">' +
        '<span class="browser__bar"><i></i><i></i><i></i><span>' + esc(host) + '</span></span>' +
        '<span class="browser__mark" data-parallax="0.05"><strong>' + esc(c.name) + '</strong><span>' + esc(c.kind) + '</span></span>' +
        '</a>' +
        '<div class="client__body">' +
        '<p class="card__kind">' + esc(c.kind) + '</p>' +
        '<h2>' + esc(c.name) + '</h2>' +
        '<p>' + esc(c.summary) + '</p>' +
        tags(c.stack) + meta(c.repo) +
        '<div class="client__links">' + linkButtons(c.links, c.name, false) + '</div>' +
        '</div></article>';
    }).join('');
  }

  if (page === 'home') renderHome();
  if (page === 'projects') renderProjects();
  if (page === 'freelance') renderFreelance();

  /* ---------- Live GitHub details ---------- */
  var LANG_COLORS = { JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', HTML: '#e34c26', CSS: '#663399', 'Jupyter Notebook': '#DA5B0B', Java: '#b07219' };
  function timeAgo(iso) {
    var diff = (new Date(iso).getTime() - Date.now()) / 1000;
    var units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
    var rtf = window.Intl && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' }) : null;
    for (var i = 0; i < units.length; i++) {
      if (Math.abs(diff) >= units[i][1] || units[i][0] === 'minute') {
        var v = Math.round(diff / units[i][1]);
        return rtf ? rtf.format(v, units[i][0]) : Math.abs(v) + ' ' + units[i][0] + 's ago';
      }
    }
    return '';
  }
  function fillGitHub(repos) {
    var byName = {};
    repos.forEach(function (r) { byName[r.name.toLowerCase()] = r; });
    $$('[data-gh]').forEach(function (el) {
      var r = byName[el.getAttribute('data-gh').toLowerCase()];
      el.classList.remove('is-loading');
      if (!r) { el.remove(); return; }
      var parts = [];
      if (r.language) parts.push('<span><i class="dot" style="--c:' + (LANG_COLORS[r.language] || 'var(--label-3)') + '" aria-hidden="true"></i>' + esc(r.language) + '</span>');
      if (r.stargazers_count) parts.push('<span>' + STAR + r.stargazers_count + '<span class="sr-only"> stars</span></span>');
      if (r.pushed_at) parts.push('<span>Updated ' + esc(timeAgo(r.pushed_at)) + '</span>');
      el.innerHTML = parts.join('');
      if (el.animate && !reduceMotion) el.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: 'ease-out' });
    });
  }
  function loadGitHub() {
    if (!$('[data-gh]')) return;
    var KEY = 'gh-repos-v1';
    try {
      var cached = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      if (cached && Date.now() - cached.t < 30 * 60 * 1000) { fillGitHub(cached.data); return; }
    } catch (e) {}
    fetch('https://api.github.com/users/' + encodeURIComponent(SITE.github) + '/repos?per_page=100&sort=pushed', { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (res) { if (!res.ok) throw new Error(res.status); return res.json(); })
      .then(function (data) {
        var slim = data.map(function (r) { return { name: r.name, language: r.language, stargazers_count: r.stargazers_count, pushed_at: r.pushed_at }; });
        try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), data: slim })); } catch (e) {}
        fillGitHub(slim);
      })
      .catch(function () { $$('[data-gh]').forEach(function (el) { el.remove(); }); });
  }
  loadGitHub();

  /* ---------- Split text ---------- */
  $$('[data-split]').forEach(function (el) {
    var mode = el.getAttribute('data-split');
    var label = el.textContent.replace(/\s+/g, ' ').trim();
    var nodes = Array.prototype.slice.call(el.childNodes);
    var holder = document.createElement('span');
    holder.setAttribute('aria-hidden', 'true');
    var i = 0;
    function unit(content, isNode) {
      var s = document.createElement('span');
      if (isNode) s.appendChild(content); else s.textContent = content;
      if (mode === 'words') {
        var w = document.createElement('span');
        w.className = 'w';
        s.style.setProperty('--i', i++);
        w.appendChild(s);
        return w;
      }
      s.className = 'c';
      s.style.setProperty('--i', i++);
      return s;
    }
    nodes.forEach(function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(function (tok) {
          if (!tok) return;
          if (/^\s+$/.test(tok)) { holder.appendChild(document.createTextNode(' ')); return; }
          if (mode === 'words') { holder.appendChild(unit(tok)); return; }
          var word = document.createElement('span');
          word.style.display = 'inline-block';
          word.style.whiteSpace = 'nowrap';
          Array.from(tok).forEach(function (ch) { word.appendChild(unit(ch)); });
          holder.appendChild(word);
        });
      } else if (n.nodeName === 'BR') {
        holder.appendChild(document.createElement('br'));
      } else {
        holder.appendChild(unit(n, true));
      }
    });
    el.textContent = '';
    el.appendChild(holder);
    el.setAttribute('aria-label', label);
    el.classList.add('split');
  });

  /* ---------- Reveal on scroll ---------- */
  var revealables = $$('[data-reveal], .split, [data-route]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Count-up ---------- */
  $$('[data-count-to]').forEach(function (el) {
    var to = parseInt(el.getAttribute('data-count-to'), 10) || 0;
    if (reduceMotion) { el.textContent = to; return; }
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = clamp((ts - start) / 1200, 0, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    setTimeout(function () { requestAnimationFrame(step); }, 300);
  });

  /* ---------- Theme ---------- */
  var toggle = $('[data-theme-toggle]');
  function currentTheme() {
    return root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  function syncToggle() { if (toggle) toggle.setAttribute('aria-label', 'Switch to ' + (currentTheme() === 'dark' ? 'light' : 'dark') + ' theme'); }
  if (toggle) {
    syncToggle();
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      var swap = function () {
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
        syncToggle();
      };
      if (document.startViewTransition && !reduceMotion) document.startViewTransition(swap); else swap();
    });
  }

  /* ---------- Nav: sliding pill, hide on scroll down ---------- */
  var nav = $('[data-nav]');
  var pill = $('.nav__pill');
  var navLinks = $$('.nav__links a');
  function placePill(a) {
    if (!pill) return;
    if (!a || a.offsetParent === null) { pill.style.opacity = '0'; return; }
    pill.style.opacity = '1';
    pill.style.width = a.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + a.offsetLeft + 'px)';
  }
  var activeLink = $('.nav__links a[aria-current="page"]');
  placePill(activeLink);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { placePill(activeLink); });
  window.addEventListener('resize', function () { placePill(activeLink); });
  navLinks.forEach(function (a) {
    a.addEventListener('mouseenter', function () { placePill(a); });
    a.addEventListener('focus', function () { placePill(a); });
  });
  var linksBox = $('.nav__links');
  if (linksBox) linksBox.addEventListener('mouseleave', function () { placePill(activeLink); });

  /* ---------- Scroll-linked effects (one rAF per frame) ---------- */
  var progress = $('.progress');
  var timeline = $('[data-timeline]');
  var fill = $('.timeline__fill');
  var parallaxEls = $$('[data-parallax]');
  var lastY = window.scrollY;
  var velocity = 0;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    velocity = y - lastY;

    if (progress) progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);

    if (nav) {
      if (y > 400 && velocity > 4) nav.setAttribute('data-hidden', '');
      else if (velocity < -4 || y < 400) nav.removeAttribute('data-hidden');
    }

    if (timeline && fill) {
      var r = timeline.getBoundingClientRect();
      fill.style.setProperty('--fill', clamp((vh * 0.65 - r.top) / r.height, 0, 1).toFixed(4));
    }

    if (!reduceMotion) {
      parallaxEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > vh + 100) return;
        var f = parseFloat(el.getAttribute('data-parallax')) || 0.05;
        var offset = clamp((rect.top + rect.height / 2 - vh / 2) * f, -24, 24);
        el.style.setProperty('--py', offset.toFixed(1));
      });
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Marquee (speeds up with scroll) ---------- */
  var rows = $$('.marquee__row');
  if (rows.length && !reduceMotion) {
    var offsets = rows.map(function () { return 0; });
    var running = false;
    var boost = 0;
    function frame() {
      if (!running) return;
      boost += (Math.abs(velocity) * 0.25 - boost) * 0.08;
      rows.forEach(function (row, i) {
        var dir = parseFloat(row.getAttribute('data-dir')) || -1;
        var w = row.scrollWidth / 3;
        offsets[i] += (0.5 + boost) * dir;
        if (offsets[i] <= -w) offsets[i] += w;
        if (offsets[i] > 0) offsets[i] -= w;
        row.style.transform = 'translate3d(' + offsets[i].toFixed(2) + 'px,0,0)';
      });
      velocity *= 0.9;
      requestAnimationFrame(frame);
    }
    rows.forEach(function (row, i) {
      if (parseFloat(row.getAttribute('data-dir')) > 0) offsets[i] = -row.scrollWidth / 3;
    });
    new IntersectionObserver(function (en) {
      var vis = en.some(function (e) { return e.isIntersecting; });
      if (vis && !running) { running = true; requestAnimationFrame(frame); }
      else if (!vis) running = false;
    }).observe($('[data-marquee]'));
  }

  /* ---------- Pointer effects (mouse and trackpad only) ---------- */
  if (finePointer && !reduceMotion) {
    // Magnetic buttons
    $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width;
        var y = (e.clientY - r.top - r.height / 2) / r.height;
        el.style.transform = 'translate(' + (x * 10).toFixed(1) + 'px,' + (y * 8).toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });

    // Spotlight on tiles
    $$('.tile').forEach(function (t) {
      t.addEventListener('pointermove', function (e) {
        var r = t.getBoundingClientRect();
        t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        t.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });

    // 3D tilt and shine on project cards
    $$('.card').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        c.classList.add('is-tilting');
        c.style.setProperty('--ry', ((x - 0.5) * 7).toFixed(2) + 'deg');
        c.style.setProperty('--rx', ((0.5 - y) * 7).toFixed(2) + 'deg');
        c.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        c.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
      c.addEventListener('pointerleave', function () {
        c.classList.remove('is-tilting');
        c.style.setProperty('--rx', '0deg');
        c.style.setProperty('--ry', '0deg');
      });
    });

    // Aurora drifts toward the pointer
    var aurora = $('.aurora__inner');
    if (aurora) {
      window.addEventListener('pointermove', function (e) {
        var x = (e.clientX / window.innerWidth - 0.5) * 40;
        var y = (e.clientY / window.innerHeight - 0.5) * 40;
        aurora.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      }, { passive: true });
    }
  }

  /* ---------- Expandable details with height animation ---------- */
  $$('.details').forEach(function (d) {
    var summary = $('summary', d);
    var body = $('.details__body', d);
    summary.addEventListener('click', function (e) {
      if (reduceMotion || !body.animate) return;
      e.preventDefault();
      if (d.open) {
        var h = body.offsetHeight;
        body.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 320, easing: 'cubic-bezier(0.2, 0, 0, 1)' }).onfinish = function () { d.open = false; };
      } else {
        d.open = true;
        var full = body.offsetHeight;
        body.animate([{ height: '0px', opacity: 0 }, { height: full + 'px', opacity: 1 }], { duration: 480, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
      }
    });
  });

  /* ---------- Bus route on the "Now" card ---------- */
  var route = $('[data-route]');
  if (route) {
    var path = $('.route__line', route);
    var stopsG = $('[data-stops]', route);
    var bus = $('[data-bus]', route);
    var glow = $('[data-bus-glow]', route);
    var len = path.getTotalLength();
    var stopsAt = [0, 0.27, 0.52, 0.76, 1];
    var ns = 'http://www.w3.org/2000/svg';
    var stopEls = stopsAt.map(function (f) {
      var pt = path.getPointAtLength(f * len);
      var c = document.createElementNS(ns, 'circle');
      c.setAttribute('class', 'route__stop');
      c.setAttribute('r', '6');
      c.setAttribute('cx', pt.x);
      c.setAttribute('cy', pt.y);
      stopsG.appendChild(c);
      return c;
    });
    function placeBus(f) {
      var pt = path.getPointAtLength(clamp(f, 0, 1) * len);
      bus.setAttribute('cx', pt.x); bus.setAttribute('cy', pt.y);
      glow.setAttribute('cx', pt.x); glow.setAttribute('cy', pt.y);
    }
    if (reduceMotion) {
      placeBus(stopsAt[2]);
      stopEls.slice(0, 3).forEach(function (s) { s.classList.add('is-hit'); });
    } else {
      // Drive between stops with ease-in-out, dwell briefly at each one, then loop.
      var leg = 0, legStart = null, MOVE = 1500, DWELL = 650, active = false;
      var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
      stopEls[0].classList.add('is-hit');
      function tick(ts) {
        if (!active) return;
        if (legStart === null) legStart = ts;
        var t = ts - legStart;
        var from = stopsAt[leg], to = stopsAt[leg + 1];
        placeBus(from + (to - from) * ease(clamp(t / MOVE, 0, 1)));
        if (t >= MOVE) stopEls[leg + 1].classList.add('is-hit');
        if (t >= MOVE + DWELL) {
          leg++; legStart = ts;
          if (leg >= stopsAt.length - 1) {
            leg = 0;
            stopEls.forEach(function (s, i) { s.classList.toggle('is-hit', i === 0); });
          }
        }
        requestAnimationFrame(tick);
      }
      new IntersectionObserver(function (en) {
        var vis = en[0].isIntersecting;
        if (vis && !active) { active = true; legStart = null; setTimeout(function () { requestAnimationFrame(tick); }, 1600); }
        else if (!vis) active = false;
      }).observe(route);
    }
  }

  /* ---------- Copy email ---------- */
  $$('[data-copy]').forEach(function (btn) {
    var label = $('[data-copy-label]', btn);
    var statusEl = $('[data-copy-status]');
    var timer;
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy');
      function done(ok) {
        if (label) label.textContent = ok ? 'Copied' : 'Press Ctrl+C to copy';
        if (ok) btn.setAttribute('data-copied', '');
        if (statusEl) statusEl.textContent = ok ? 'Email address copied.' : 'Could not copy automatically.';
        clearTimeout(timer);
        timer = setTimeout(function () {
          if (label) label.textContent = 'Copy email';
          btn.removeAttribute('data-copied');
          if (statusEl) statusEl.textContent = '';
        }, 2200);
      }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(value).then(function () { done(true); }, function () { done(false); });
      else done(false);
    });
  });

  var year = $('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
