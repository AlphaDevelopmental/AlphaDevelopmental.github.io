/* =========================================================
   Ajani Taiwo Micheal — portfolio interactions
   Everything here is progressive enhancement: the page is fully
   usable (content, navigation, links) without JavaScript.
   ========================================================= */
'use strict';

const EMAIL = 'micheal.techservices@gmail.com';
const LINKS = {
  github: 'https://github.com/AlphaDevelopmental',
  linkedin: 'https://www.linkedin.com/in/ajani-taiwo-493520195/',
  hackerone: 'https://hackerone.com/glassglow_sec',
  academy: 'https://alphadevelopmental-website.netlify.app/academy',
  technologies: 'https://alphadevelopmental-website.netlify.app/technologies',
};

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const reducedMotion = () => motionQuery.matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const yearEl = $('#year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* A single, cancellable deferred navigation (used by the terminal so its output is
   visible before the page scrolls). Any other navigation, or interaction elsewhere,
   cancels it so a stale timer can never pull focus away from the user. */
let pendingNav = null;
function cancelPendingNav() {
  if (pendingNav) { clearTimeout(pendingNav); pendingNav = null; }
}
function goToSoon(id, delay = 350) {
  cancelPendingNav();
  pendingNav = setTimeout(() => { pendingNav = null; goTo(id); }, delay);
}
['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((type) => {
  document.addEventListener(type, (e) => {
    if (pendingNav && !(e.target instanceof Element && e.target.closest('#terminal'))) cancelPendingNav();
  }, { capture: true, passive: true });
});

/* Navigate to a section and move keyboard focus to its heading. */
function goTo(id) {
  cancelPendingNav();
  const section = document.getElementById(id);
  if (!section) return;
  section.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  const heading = section.querySelector('h2') || section;
  if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
  if (history.replaceState) history.replaceState(null, '', '#' + id);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/* ================= MOBILE NAVIGATION ================= */
(function mobileNav() {
  const toggle = $('#navToggle');
  const nav = $('#siteNav');
  if (!toggle || !nav) return;
  toggle.hidden = false;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); toggle.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });
  window.matchMedia('(min-width: 1081px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
})();

/* ================= PROJECT FILTER ================= */
const projectFilter = (function projectFilter() {
  const bar = $('#filterBar');
  const cards = $$('#projectGrid .project-card');
  const status = $('#filterStatus');
  if (!bar) return { apply() {} };

  // Show per-category counts, derived from the cards actually on the page.
  $$('.filter-btn', bar).forEach((btn) => {
    const f = btn.dataset.filter;
    const n = f === 'all' ? cards.length : cards.filter((c) => c.dataset.cat === f).length;
    const span = document.createElement('span');
    span.className = 'filter-count';
    span.textContent = `(${n})`;
    btn.appendChild(span);
  });

  function apply(filter) {
    let shown = 0;
    $$('.filter-btn', bar).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
    cards.forEach((card) => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.classList.toggle('is-hidden', !match);
      if (match) shown++;
    });
    const label = $(`.filter-btn[data-filter="${filter}"]`, bar);
    const name = label ? label.firstChild.textContent.trim() : filter;
    if (status) status.textContent = `Showing ${shown} ${shown === 1 ? 'project' : 'projects'}${filter === 'all' ? '' : ` in ${name}`}.`;
  }

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (btn) apply(btn.dataset.filter);
  });

  // If someone links to a hidden project card, make sure it is visible.
  window.addEventListener('hashchange', () => {
    const target = document.getElementById(location.hash.slice(1));
    if (target && target.classList.contains('is-hidden')) apply('all');
  });

  return { apply };
})();

/* ================= TERMINAL (optional enhancement) ================= */
(function terminal() {
  const body = $('#terminalBody');
  const form = $('#terminalForm');
  const input = $('#terminalInput');
  const chips = $('#termChips');
  if (!body || !form || !input) return;
  if (chips) chips.hidden = false;

  const history = [];
  let histIdx = -1;

  const nav = (id, label) => () => { goToSoon(id); return [`→ ${label}`]; };

  const commands = {
    help: {
      desc: 'list commands',
      run: () => Object.entries(commands).map(([k, v]) => ({ cmd: k, text: v.desc })),
    },
    whoami: {
      desc: 'who I am',
      run: () => [
        'Ajani Taiwo Micheal',
        'Cybersecurity Researcher | Technology Entrepreneur | Educator',
        'Founder, AlphaDevelopmental · Cybersecurity Instructor & Curriculum Developer, SQI College of ICT',
        'Ibadan, Nigeria',
      ],
    },
    research: {
      desc: 'research interests',
      run: () => {
        const areas = $$('#researchAreas h3').map((h, i) => `R${i + 1}  ${h.textContent}`);
        goToSoon('research');
        return areas;
      },
    },
    projects: {
      desc: 'selected projects',
      run: () => {
        const n = $$('#projectGrid .project-card').length;
        goToSoon('projects');
        return [`${n} projects listed — opening the project grid…`];
      },
    },
    experience: { desc: 'professional experience', run: nav('experience', 'professional experience') },
    certs: {
      desc: 'education & credentials',
      run: () => {
        goToSoon('credentials');
        return $$('#credentials .log-row:not(.log-row--head)').map((row) => {
          const cells = row.querySelectorAll('[role="cell"]');
          return `${cells[0].textContent.padEnd(9)}${cells[1].textContent.replace(/\s+/g, ' ').trim()}  [${cells[2].textContent}]`;
        });
      },
    },
    teaching: { desc: 'teaching & curriculum', run: nav('teaching', 'teaching & curriculum development') },
    speaking: { desc: 'speaking & collaboration', run: nav('speaking', 'speaking, research & collaboration') },
    ventures: {
      desc: 'AlphaDevelopmental ventures',
      run: () => { goToSoon('ventures'); return ['Academy       ' + LINKS.academy, 'Technologies  ' + LINKS.technologies]; },
    },
    socials: {
      desc: 'profiles & email',
      run: () => [
        'email      ' + EMAIL,
        'linkedin   ' + LINKS.linkedin,
        'github     ' + LINKS.github,
        'hackerone  ' + LINKS.hackerone,
      ],
    },
    contact: { desc: 'go to the contact form', run: nav('contact', 'contact') },
    clear: { desc: 'clear the terminal', run: () => { body.textContent = ''; return null; } },
  };

  function printLine(text, cls) {
    const p = document.createElement('p');
    p.className = 'term-line' + (cls ? ' ' + cls : '');
    p.textContent = text;
    body.appendChild(p);
    return p;
  }
  function printHelp(rows) {
    printLine('available commands:');
    rows.forEach(({ cmd, text }) => {
      const p = printLine('  ');
      const s = document.createElement('span');
      s.className = 'term-cmd';
      s.textContent = cmd.padEnd(11);
      p.append(s, '— ' + text);
    });
  }

  function exec(raw) {
    const value = raw.trim();
    if (!value) return;
    printLine('guest@ibadan > ' + value, 'term-echo');
    history.unshift(value);
    histIdx = -1;
    const key = value.toLowerCase().split(/\s+/)[0];
    const command = commands[key];
    if (!command) {
      printLine(`command not found: ${value} — type "help"`, 'term-error');
    } else {
      const out = command.run();
      if (out && key === 'help') printHelp(out);
      else if (out) out.forEach((l) => printLine(l));
    }
    body.scrollTop = body.scrollHeight;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    exec(input.value);
    input.value = '';
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      histIdx = Math.min(histIdx + 1, history.length - 1);
      input.value = history[histIdx];
    } else if (e.key === 'ArrowDown' && histIdx > -1) {
      e.preventDefault();
      histIdx -= 1;
      input.value = histIdx === -1 ? '' : history[histIdx];
    }
  });
  if (chips) chips.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-cmd]');
    if (b) exec(b.dataset.cmd);
  });
})();

/* ================= COMMAND PALETTE (optional enhancement) ================= */
(function commandPalette() {
  const backdrop = $('#cmdkBackdrop');
  const trigger = $('#cmdkTrigger');
  const input = $('#cmdkInput');
  const list = $('#cmdkResults');
  const closeBtn = $('#cmdkClose');
  if (!backdrop || !trigger || !input || !list) return;
  trigger.hidden = false;

  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  const kbd = $('.cmdk-kbd', trigger);
  if (kbd) kbd.textContent = isMac ? '⌘K' : 'Ctrl K';
  trigger.setAttribute('aria-keyshortcuts', isMac ? 'Meta+K' : 'Control+K');

  const sectionActions = $$('main section[id]').map((s) => ({
    label: 'Go to ' + (s.querySelector('h2')?.textContent.trim() || s.id),
    hint: 'section',
    run: () => goTo(s.id),
  }));
  const filterActions = $$('#filterBar .filter-btn')
    .filter((b) => b.dataset.filter !== 'all')
    .map((b) => ({
      label: 'Filter projects: ' + b.firstChild.textContent.trim(),
      hint: 'filter',
      run: () => { projectFilter.apply(b.dataset.filter); goTo('projects'); },
    }));
  const openExternal = (url) => () => window.open(url, '_blank', 'noopener');
  const actions = [
    ...sectionActions,
    ...filterActions,
    { label: 'Copy email address', hint: 'copy', run: () => copyText(EMAIL) },
    { label: 'Open LinkedIn profile', hint: '↗ external', run: openExternal(LINKS.linkedin) },
    { label: 'Open GitHub profile', hint: '↗ external', run: openExternal(LINKS.github) },
    { label: 'Open HackerOne profile', hint: '↗ external', run: openExternal(LINKS.hackerone) },
    { label: 'Visit AlphaDevelopmental Academy', hint: '↗ external', run: openExternal(LINKS.academy) },
    { label: 'Visit AlphaDevelopmental Technologies', hint: '↗ external', run: openExternal(LINKS.technologies) },
  ];

  const background = [$('.site-header'), $('#main'), $('.site-footer'), $('.skip-link')].filter(Boolean);
  let filtered = actions;
  let selected = 0;
  let lastFocus = null;

  function render() {
    list.textContent = '';
    if (!filtered.length) {
      const li = document.createElement('li');
      li.className = 'cmdk-empty';
      li.setAttribute('role', 'presentation');
      li.textContent = 'No matching results';
      list.appendChild(li);
      input.removeAttribute('aria-activedescendant');
      return;
    }
    filtered.forEach((a, i) => {
      const li = document.createElement('li');
      li.className = 'cmdk-item';
      li.id = 'cmdk-opt-' + i;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === selected));
      const label = document.createElement('span');
      label.textContent = a.label;
      const hint = document.createElement('span');
      hint.className = 'cmdk-item-hint';
      hint.textContent = a.hint;
      li.append(label, hint);
      li.addEventListener('mousemove', () => { if (selected !== i) { selected = i; updateSelection(); } });
      li.addEventListener('click', () => choose(i));
      list.appendChild(li);
    });
    updateSelection();
  }
  function updateSelection() {
    $$('.cmdk-item', list).forEach((li, i) => li.setAttribute('aria-selected', String(i === selected)));
    const active = $('#cmdk-opt-' + selected);
    if (active) {
      input.setAttribute('aria-activedescendant', active.id);
      active.scrollIntoView({ block: 'nearest' });
    }
  }
  function choose(i) {
    const action = filtered[i];
    if (!action) return;
    // Navigation actions move focus to their target; others return focus to where the user was.
    close(!(action.hint === 'section' || action.hint === 'filter'));
    action.run();
  }

  function open() {
    lastFocus = document.activeElement;
    backdrop.hidden = false;
    background.forEach((el) => { el.inert = true; });
    input.value = '';
    filtered = actions;
    selected = 0;
    render();
    input.focus();
  }
  function close(restoreFocus = true) {
    if (backdrop.hidden) return;
    backdrop.hidden = true;
    background.forEach((el) => { el.inert = false; });
    if (restoreFocus && lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  trigger.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', () => close());
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      backdrop.hidden ? open() : close();
    } else if (e.key === 'Escape' && !backdrop.hidden) {
      close();
    }
  });

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    filtered = q ? actions.filter((a) => a.label.toLowerCase().includes(q)) : actions;
    selected = 0;
    render();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (filtered.length) { selected = (selected + 1) % filtered.length; updateSelection(); } }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (filtered.length) { selected = (selected - 1 + filtered.length) % filtered.length; updateSelection(); } }
    else if (e.key === 'Home') { selected = 0; updateSelection(); }
    else if (e.key === 'End') { selected = Math.max(0, filtered.length - 1); updateSelection(); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(selected); }
  });
  // Keep Tab within the dialog (input ↔ close button).
  backdrop.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !closeBtn) return;
    if (e.shiftKey && document.activeElement === input) { e.preventDefault(); closeBtn.focus(); }
    else if (!e.shiftKey && document.activeElement === closeBtn) { e.preventDefault(); input.focus(); }
  });
})();

/* ================= REVEAL + ACTIVE NAV ================= */
(function scrollObserver() {
  const reveals = $$('.reveal');
  if (!('IntersectionObserver' in window) || reducedMotion()) {
    reveals.forEach((el) => el.classList.add('in-view'));
  } else {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); ro.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach((el) => ro.observe(el));
    // Safety net: never leave content invisible (e.g. when printing or if the observer never fires).
    setTimeout(() => reveals.forEach((el) => el.classList.add('in-view')), 4000);
  }

  const navLinks = $$('.site-nav a[data-section]');
  const navFor = { credentials: 'experience' };
  const sections = $$('main section[id]');
  if (!('IntersectionObserver' in window) || !navLinks.length) return;
  const no = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = navFor[entry.target.id] || entry.target.id;
      navLinks.forEach((l) => {
        const on = l.dataset.section === id;
        l.classList.toggle('active', on);
        if (on) l.setAttribute('aria-current', 'location'); else l.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach((s) => no.observe(s));
})();

/* ================= HERO FIGURES ================= */
/* Values are rendered in the HTML so they are correct without JS, for crawlers and
   for link previews. The project count is re-derived from the cards on the page so it
   can never drift from the actual list; the count-up is purely decorative. */
(function heroFigures() {
  const derived = {
    projects: () => $$('#projectGrid .project-card').length,
    areas: () => $$('#researchAreas > li').length,
    ventures: () => $$('#ventures .venture-card').length,
  };
  const nums = $$('.stat-num[data-stat]');
  nums.forEach((el) => {
    const fn = derived[el.dataset.stat];
    const n = fn ? fn() : parseInt(el.textContent, 10);
    if (Number.isFinite(n) && n > 0) el.textContent = String(n);
  });
  if (reducedMotion() || !('IntersectionObserver' in window)) return;

  function countUp(el) {
    const target = parseInt(el.textContent, 10);
    if (!Number.isFinite(target)) return;
    const start = performance.now();
    const dur = 700;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    // Guarantee the final value even if rAF is throttled (background tab, power saving).
    setTimeout(() => { el.textContent = String(target); }, dur + 400);
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { countUp(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.5 });
  nums.forEach((n) => io.observe(n));
})();

/* ================= TILT / SPOTLIGHT CARDS ================= */
(function tiltCards() {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!finePointer || reducedMotion()) return;
  $$('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = (-(y - r.height / 2) / r.height) * 4;
      const ry = ((x - r.width / 2) / r.width) * 4;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ================= SPEAKER BIO COPY ================= */
(function speakerBio() {
  const btn = $('#copyBio');
  const bio = $('#speakerBio');
  const status = $('#copyBioStatus');
  if (!btn || !bio || !navigator.clipboard) return;
  btn.hidden = false;
  btn.addEventListener('click', async () => {
    const ok = await copyText(bio.textContent.trim());
    status.textContent = ok ? 'Biography copied to clipboard.' : 'Copy failed — please select the text manually.';
    setTimeout(() => { status.textContent = ''; }, 4000);
  });
})();

/* ================= CONTACT FORM (Web3Forms) ================= */
(function contactForm() {
  const form = $('#contactForm');
  if (!form) return;
  const fields = {
    name: $('#cf-name'),
    email: $('#cf-email'),
    type: $('#cf-type'),
    subject: $('#cf-subject'),
    message: $('#cf-message'),
  };
  const charCount = $('#charCount');
  const submitBtn = $('#submitBtn');
  const toast = $('#formToast');
  const loadedAt = Date.now();
  const MAX = Number(fields.message.getAttribute('maxlength')) || 2000;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  let attempted = false;
  let inFlight = false;

  // Pre-select the enquiry type from CTAs such as "Invite to speak".
  $$('[data-enquiry]').forEach((a) => a.addEventListener('click', () => {
    fields.type.value = a.dataset.enquiry;
    if (attempted) validate('type');
  }));

  const rules = {
    name: (v) => (v.trim().length < 2 ? 'Please enter your name.' : ''),
    email: (v) => (!v.trim() ? 'Please enter your email address.' : !emailRe.test(v.trim()) ? 'Please enter a valid email address, e.g. name@example.com.' : ''),
    type: (v) => (!v ? 'Please choose an enquiry type.' : ''),
    subject: (v) => (v.trim().length < 3 ? 'Please enter a subject.' : ''),
    message: (v) => (v.trim().length < 20 ? 'Please write at least 20 characters so I can help.' : ''),
  };

  function validate(key) {
    const el = fields[key];
    const msg = rules[key](el.value);
    const err = document.getElementById(el.id + '-err');
    el.setAttribute('aria-invalid', String(Boolean(msg)));
    if (err) err.textContent = msg;
    return !msg;
  }

  Object.keys(fields).forEach((key) => {
    const el = fields[key];
    el.addEventListener(key === 'type' ? 'change' : 'blur', () => { if (attempted || el.value) validate(key); });
    el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') validate(key); });
  });

  fields.message.addEventListener('input', () => {
    charCount.textContent = `${fields.message.value.length} / ${MAX}`;
  });

  function showToast(text, type) {
    toast.className = 'form-toast ' + type;
    toast.textContent = text;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (inFlight) return;
    attempted = true;
    toast.textContent = '';
    toast.className = 'form-toast';

    const invalid = Object.keys(fields).filter((k) => !validate(k));
    if (invalid.length) {
      fields[invalid[0]].focus();
      showToast(`Please correct ${invalid.length === 1 ? 'the highlighted field' : `the ${invalid.length} highlighted fields`}.`, 'error');
      return;
    }

    // Spam heuristics: honeypot, and submissions faster than a human could type.
    if (form.botcheck && form.botcheck.checked) return;
    if (Date.now() - loadedAt < 3000) {
      showToast('That was quick! Please wait a moment and try again.', 'error');
      return;
    }

    const typeLabel = fields.type.options[fields.type.selectedIndex].text;
    const payload = {
      access_key: form.access_key.value,
      from_name: form.from_name.value,
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      enquiry_type: typeLabel,
      subject: `[Portfolio · ${typeLabel}] ${fields.subject.value.trim()}`,
      message: fields.message.value.trim(),
      botcheck: false,
    };

    inFlight = true;
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      let data = null;
      try { data = await res.json(); } catch { /* non-JSON response */ }

      if (res.ok && data && data.success) {
        showToast('Thank you — your message has been sent. I will reply as soon as I can.', 'success');
        form.reset();
        attempted = false;
        Object.values(fields).forEach((el) => el.removeAttribute('aria-invalid'));
        charCount.textContent = `0 / ${MAX}`;
      } else if (res.status === 429) {
        showToast(`Too many messages in a short time. Please try again later or email ${EMAIL}.`, 'error');
      } else {
        showToast(`Sorry, your message could not be sent. Please try again or email ${EMAIL}.`, 'error');
      }
    } catch (err) {
      const timedOut = err && err.name === 'AbortError';
      showToast(`${timedOut ? 'The request timed out.' : 'A network error occurred.'} Please try again or email ${EMAIL}.`, 'error');
    } finally {
      clearTimeout(timer);
      inFlight = false;
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
    }
  });
})();
