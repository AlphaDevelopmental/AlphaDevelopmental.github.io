document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ================= TERMINAL ================= */
(function terminal() {
  const body = document.getElementById('terminalBody');
  const input = document.getElementById('terminalInput');

  const commands = {
    help() {
      return [
        'available commands:',
        '  <span class="term-cmd">help</span>      — list commands',
        '  <span class="term-cmd">skills</span>    — show service modules',
        '  <span class="term-cmd">projects</span>  — jump to projects',
        '  <span class="term-cmd">contact</span>   — jump to contact form',
        '  <span class="term-cmd">whoami</span>    — about this operator',
        '  <span class="term-cmd">clear</span>     — clear the terminal',
      ];
    },
    skills() {
      return [
        '[ENG]   Product & Full-Stack Engineering',
        '[SEC]   Cybersecurity & Application Security',
        '[OPS]   Cloud & DevOps Engineering',
        '[AI]    Prompt Engineering & AI Systems',
      ];
    },
    whoami() {
      return [
        'Taiwo Micheal Glass — Cybersecurity & DevOps Engineer, Application',
        'Security Specialist, and Product Engineer. Trading as',
        'AlphaDevelopmental Technologies. Based in Lagos, Nigeria.',
      ];
    },
    projects() {
      document.getElementById('projects').scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      return ['navigating to projects...'];
    },
    contact() {
      document.getElementById('contact').scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      return ['navigating to contact...'];
    },
    clear() {
      body.innerHTML = '';
      return null;
    },
  };

  function printLine(html, cls) {
    const div = document.createElement('div');
    div.className = 'term-line' + (cls ? ' ' + cls : '');
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const raw = input.value.trim();
    if (!raw) return;
    printLine('guest@lagos &gt; ' + escapeHtml(raw), 'term-echo');
    input.value = '';

    const cmd = raw.toLowerCase();
    if (commands[cmd]) {
      const out = commands[cmd]();
      if (out) out.forEach((l) => printLine(l));
    } else {
      printLine(`command not found: <span class="term-cmd">${escapeHtml(raw)}</span> — type <span class="term-cmd">help</span>`, 'term-error');
    }
  });

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }
})();

/* ================= COMMAND PALETTE ================= */
(function commandPalette() {
  const backdrop = document.getElementById('cmdkBackdrop');
  const trigger = document.getElementById('cmdkTrigger');
  const input = document.getElementById('cmdkInput');
  const resultsEl = document.getElementById('cmdkResults');

  const actions = [
    { label: 'Go to Modules', hint: 'section', run: () => scrollTo('#modules') },
    { label: 'Go to Access Log', hint: 'section', run: () => scrollTo('#log') },
    { label: 'Go to Projects', hint: 'section', run: () => scrollTo('#projects') },
    { label: 'Go to Contact', hint: 'section', run: () => scrollTo('#contact') },
    { label: 'Copy email address', hint: 'copy', run: copyEmail },
    { label: 'Open GitHub', hint: '↗ external', run: () => window.open('https://github.com/AlphaDevelopmental', '_blank', 'noopener') },
    { label: 'Open HackerOne profile', hint: '↗ external', run: () => window.open('https://hackerone.com/glassglow_sec', '_blank', 'noopener') },
    { label: 'Filter projects: Product Eng', hint: 'filter', run: () => { scrollTo('#projects'); applyFilter('webdev'); } },
    { label: 'Filter projects: AppSec', hint: 'filter', run: () => { scrollTo('#projects'); applyFilter('appsec'); } },
    { label: 'Filter projects: DevOps', hint: 'filter', run: () => { scrollTo('#projects'); applyFilter('devops'); } },
    { label: 'Filter projects: AI Systems', hint: 'filter', run: () => { scrollTo('#projects'); applyFilter('ai'); } },
  ];

  let selected = 0;
  let filtered = actions;

  function scrollTo(sel) {
    document.querySelector(sel).scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  function copyEmail() {
    navigator.clipboard?.writeText('micheal.techservices@gmail.com').catch(() => {});
  }

  function render() {
    resultsEl.innerHTML = '';
    if (filtered.length === 0) {
      resultsEl.innerHTML = '<li class="cmdk-item">no results</li>';
      return;
    }
    filtered.forEach((a, i) => {
      const li = document.createElement('li');
      li.className = 'cmdk-item' + (i === selected ? ' selected' : '');
      li.innerHTML = `<span>${a.label}</span><span class="cmdk-item-hint">${a.hint}</span>`;
      li.addEventListener('mouseenter', () => { selected = i; render(); });
      li.addEventListener('click', () => { a.run(); close(); });
      resultsEl.appendChild(li);
    });
  }

  function open() {
    backdrop.classList.add('open');
    input.value = '';
    filtered = actions;
    selected = 0;
    render();
    setTimeout(() => input.focus(), 10);
  }
  function close() {
    backdrop.classList.remove('open');
  }

  trigger.addEventListener('click', open);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

  document.addEventListener('keydown', (e) => {
    const isK = e.key.toLowerCase() === 'k';
    if ((e.metaKey || e.ctrlKey) && isK) {
      e.preventDefault();
      backdrop.classList.contains('open') ? close() : open();
    }
    if (e.key === 'Escape') close();
  });

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    filtered = actions.filter((a) => a.label.toLowerCase().includes(q));
    selected = 0;
    render();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); selected = Math.min(selected + 1, filtered.length - 1); render(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); selected = Math.max(selected - 1, 0); render(); }
    if (e.key === 'Enter' && filtered[selected]) { filtered[selected].run(); close(); }
  });

  window.applyFilter = applyFilter; // exposed for palette actions
})();

/* ================= SCROLL OBSERVER (reveal + active nav) ================= */
(function scrollObserver() {
  const reveals = document.querySelectorAll('.reveal');
  const navLinks = document.querySelectorAll('.site-nav a');
  const sections = ['modules', 'log', 'projects', 'contact'].map((id) => document.getElementById(id));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach((el) => revealObserver.observe(el));

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove('active'));
            const active = document.querySelector(`.site-nav a[data-section="${entry.target.id}"]`);
            if (active) active.classList.add('active');
          }
        });
      },
      { threshold: 0.4, rootMargin: '-64px 0px -40% 0px' }
    );
    sections.forEach((s) => s && navObserver.observe(s));
  } else {
    reveals.forEach((el) => el.classList.add('in-view'));
  }
})();

/* ================= COUNTER ANIMATION ================= */
(function counters() {
  const nums = document.querySelectorAll('.stat-num');
  function animate(el) {
    const target = parseInt(el.dataset.count, 10);
    if (prefersReducedMotion) { el.textContent = target; return; }
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 24));
    const tick = () => {
      cur += step;
      if (cur >= target) { el.textContent = target; return; }
      el.textContent = cur;
      requestAnimationFrame(tick);
    };
    tick();
  }
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach((n) => obs.observe(n));
  } else {
    nums.forEach(animate);
  }
})();

/* ================= TILT / SPOTLIGHT CARDS ================= */
(function tiltCards() {
  if (prefersReducedMotion) return;
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = x - rect.width / 2;
      const cy = y - rect.height / 2;
      const rotateX = (-cy / rect.height) * 6;
      const rotateY = (cx / rect.width) * 6;
      card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ================= PROJECT FILTER ================= */
function applyFilter(filter) {
  document.querySelectorAll('.filter-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.filter === filter);
  });
  document.querySelectorAll('#projectGrid .project-card').forEach((card) => {
    const match = filter === 'all' || card.dataset.tag === filter;
    card.classList.toggle('hidden', !match);
  });
}
document.getElementById('filterBar').addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  applyFilter(btn.dataset.filter);
});

/* ================= CONTACT FORM (Web3Forms AJAX) ================= */
(function contactForm() {
  const form = document.getElementById('contactForm');
  const emailInput = document.getElementById('cf-email');
  const emailError = document.getElementById('emailError');
  const message = document.getElementById('cf-message');
  const charCount = document.getElementById('charCount');
  const submitBtn = document.getElementById('submitBtn');
  const toast = document.getElementById('formToast');

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  message.addEventListener('input', () => {
    charCount.textContent = `${message.value.length} / 500`;
  });

  emailInput.addEventListener('input', () => {
    if (emailInput.value && !emailRe.test(emailInput.value)) {
      emailError.textContent = 'enter a valid email address';
    } else {
      emailError.textContent = '';
    }
  });

  function showToast(text, type) {
    toast.textContent = text;
    toast.className = `form-toast show ${type}`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!emailRe.test(emailInput.value)) {
      emailError.textContent = 'enter a valid email address';
      emailInput.focus();
      return;
    }
    // honeypot check
    if (form.botcheck.checked) return;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    toast.className = 'form-toast';

    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        showToast('Message sent — I\u2019ll reply as soon as I can.', 'success');
        form.reset();
        charCount.textContent = '0 / 500';
      } else {
        showToast(data.message || 'Something went wrong. Try again or email me directly.', 'error');
      }
    } catch (err) {
      showToast('Network error — please email me directly instead.', 'error');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
})();
