(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle ---------- */
  var toggle = document.querySelector('[data-theme-toggle]');
  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  function syncToggleLabel() {
    if (!toggle) return;
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }
  if (toggle) {
    syncToggleLabel();
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncToggleLabel();
    });
  }

  /* ---------- Sticky nav state ---------- */
  var nav = document.querySelector('[data-nav]');
  var hero = document.getElementById('top');
  if (nav && hero && 'IntersectionObserver' in window) {
    // A 1px sentinel at the top of the page: once it leaves, the nav gets its surface.
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none;';
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) nav.removeAttribute('data-scrolled');
      else nav.setAttribute('data-scrolled', '');
    }).observe(sentinel);
  }

  /* ---------- Active section in nav ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
  if (links.length && 'IntersectionObserver' in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var sections = Object.keys(byId).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        var link = byId[entry.target.id];
        if (link) link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Terminal ---------- */
  // Lines appear one by one and commands are typed out. Untyped characters stay in the
  // layout (hidden), so the terminal never changes size while it plays.
  var term = document.querySelector('.term');
  var body = term && term.querySelector('[data-term]');
  if (term && body && !reduceMotion) {
    var lines = Array.prototype.slice.call(body.querySelectorAll('.t-line'));
    var caret = body.querySelector('.t-caret');
    term.setAttribute('data-animating', '');

    var queue = [];
    lines.forEach(function (line) {
      var cmd = line.querySelector('.t-cmd');
      if (cmd) {
        var text = cmd.textContent;
        cmd.textContent = '';
        var typed = document.createElement('span');
        var rest = document.createElement('span');
        rest.className = 't-rest';
        rest.textContent = text;
        cmd.appendChild(typed);
        cmd.appendChild(rest);
        queue.push({ line: line, typed: typed, rest: rest, text: text });
      } else {
        queue.push({ line: line });
      }
    });

    var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

    var play = function () {
      var p = wait(700);
      queue.forEach(function (step) {
        p = p.then(function () {
          step.line.classList.add('is-shown');
          if (!step.text) return wait(step.line.classList.contains('t-out') ? 260 : 0);
          // Move the caret onto the line being typed.
          if (caret) step.rest.parentNode.insertBefore(caret, step.rest);
          var i = 0;
          return new Promise(function (resolve) {
            (function tick() {
              i += 1;
              step.typed.textContent = step.text.slice(0, i);
              step.rest.textContent = step.text.slice(i);
              if (i < step.text.length) setTimeout(tick, 28 + Math.random() * 40);
              else setTimeout(resolve, 380);
            })();
          });
        });
      });
      p.then(function () {
        // Park the caret on the final prompt.
        var last = lines[lines.length - 1];
        if (caret && last) last.appendChild(caret);
        term.removeAttribute('data-animating');
      });
    };

    // Only start once the terminal is on screen.
    if ('IntersectionObserver' in window) {
      var termObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { termObserver.disconnect(); play(); }
      }, { threshold: 0.3 });
      termObserver.observe(term);
    } else {
      play();
    }
  }

  /* ---------- Copy email ---------- */
  var copyBtn = document.querySelector('[data-copy]');
  var copyLabel = copyBtn && copyBtn.querySelector('[data-copy-label]');
  var copyStatus = document.querySelector('[data-copy-status]');
  if (copyBtn && copyLabel) {
    var resetTimer;
    copyBtn.addEventListener('click', function () {
      var value = copyBtn.getAttribute('data-copy');
      var done = function (ok) {
        copyLabel.textContent = ok ? 'Copied' : 'Press Ctrl+C to copy';
        if (ok) copyBtn.setAttribute('data-copied', '');
        if (copyStatus) copyStatus.textContent = ok ? 'Email address copied to clipboard.' : 'Could not copy automatically.';
        clearTimeout(resetTimer);
        resetTimer = setTimeout(function () {
          copyLabel.textContent = 'Copy address';
          copyBtn.removeAttribute('data-copied');
          if (copyStatus) copyStatus.textContent = '';
        }, 2200);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
