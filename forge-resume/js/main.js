// ============================================
// FORGE — shared site behavior
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initActiveLink();
  initReveal();
  initCopilot();
});

/* ---------- Mobile nav toggle ---------- */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );
}

/* ---------- Highlight current page in nav ---------- */
function initActiveLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ---------- Scroll reveal for elements with [data-reveal] ---------- */
function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || items.length === 0) {
    items.forEach(el => el.classList.add('reveal'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = (i % 4) * 0.07 + 's';
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => observer.observe(el));
}

/* ============================================
   AI CO-PILOT — floating assistant widget
   Present on every page. Canned, deterministic
   responses (no external API calls) so it works
   identically on every deployment target with
   zero backend dependency.
   ============================================ */
function initCopilot() {
  const root = document.getElementById('copilot-root');
  if (!root) return;

  root.innerHTML = `
    <button class="copilot-fab" id="copilotFab" aria-label="Open Forge AI assistant">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="currentColor"/>
      </svg>
    </button>
    <div class="copilot-panel" id="copilotPanel">
      <div class="copilot-head">
        <div class="copilot-head-info">
          <span class="copilot-dot"></span>
          <div>
            <strong>Forge Assistant</strong>
            <div class="copilot-sub">Resume &amp; career guidance</div>
          </div>
        </div>
        <button class="copilot-close" id="copilotClose" aria-label="Close assistant">&times;</button>
      </div>
      <div class="copilot-body" id="copilotBody">
        <div class="copilot-msg bot">
          Hi, I'm the Forge Assistant. Ask me about resume formatting, ATS scoring, or how to phrase your experience. Try a suggestion below.
        </div>
        <div class="copilot-suggestions">
          <button class="copilot-chip" data-q="bullets">How do I write strong bullet points?</button>
          <button class="copilot-chip" data-q="ats">What is ATS score?</button>
          <button class="copilot-chip" data-q="length">How long should my resume be?</button>
          <button class="copilot-chip" data-q="summary">What goes in a summary section?</button>
        </div>
      </div>
      <form class="copilot-input-row" id="copilotForm">
        <input type="text" id="copilotInput" placeholder="Ask about your resume..." autocomplete="off" />
        <button type="submit" class="copilot-send" aria-label="Send message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 11L21 3L13 21L11 13L3 11Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
        </button>
      </form>
    </div>
  `;

  const fab = document.getElementById('copilotFab');
  const panel = document.getElementById('copilotPanel');
  const closeBtn = document.getElementById('copilotClose');
  const body = document.getElementById('copilotBody');
  const form = document.getElementById('copilotForm');
  const input = document.getElementById('copilotInput');

  fab.addEventListener('click', () => panel.classList.toggle('open'));
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  body.addEventListener('click', (e) => {
    if (e.target.classList.contains('copilot-chip')) {
      const q = e.target.getAttribute('data-q');
      respond(copilotChipText(q), copilotAnswer(q));
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    respond(val, copilotAnswer(detectIntent(val)));
    input.value = '';
  });

  function respond(userText, botText) {
    const userEl = document.createElement('div');
    userEl.className = 'copilot-msg user';
    userEl.textContent = userText;
    body.appendChild(userEl);

    const typingEl = document.createElement('div');
    typingEl.className = 'copilot-msg bot typing';
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(typingEl);
    body.scrollTop = body.scrollHeight;

    setTimeout(() => {
      typingEl.remove();
      const botEl = document.createElement('div');
      botEl.className = 'copilot-msg bot';
      botEl.textContent = botText;
      body.appendChild(botEl);
      body.scrollTop = body.scrollHeight;
    }, 500);
  }

  function copilotChipText(key) {
    const map = {
      bullets: 'How do I write strong bullet points?',
      ats: 'What is ATS score?',
      length: 'How long should my resume be?',
      summary: 'What goes in a summary section?'
    };
    return map[key] || key;
  }

  function detectIntent(text) {
    const t = text.toLowerCase();
    if (t.includes('bullet')) return 'bullets';
    if (t.includes('ats')) return 'ats';
    if (t.includes('long') || t.includes('page')) return 'length';
    if (t.includes('summary') || t.includes('objective')) return 'summary';
    if (t.includes('template') || t.includes('design')) return 'template';
    if (t.includes('skill')) return 'skills';
    return 'default';
  }

  function copilotAnswer(key) {
    const answers = {
      bullets: 'Start each bullet with an action verb, then state the result with a number where possible — "Reduced page load time by 38% by optimizing image delivery." Keep each line to one achievement.',
      ats: 'ATS stands for Applicant Tracking System — the software recruiters use to filter resumes before a human reads them. Forge scores your resume against the job description and flags missing keywords, formatting issues, and section gaps.',
      length: 'One page for under 8 years of experience, two pages beyond that. Recruiters scan, they don\'t read line by line, so cut anything that doesn\'t support the role you want.',
      summary: 'Two to three lines: your role, your strongest measurable win, and the kind of role you\'re aiming for next. Skip generic phrases like "hard-working team player."',
      template: 'Pick a template based on your field: Minimal for engineering and design roles, Executive for leadership, Classic for traditional industries like finance or law. You can preview all three on the Templates page.',
      skills: 'List skills the job description actually mentions, grouped by category (e.g. Languages, Tools, Cloud). Avoid skill bars or star ratings — ATS software can\'t parse them and they don\'t mean much to a hiring manager either.',
      default: 'I can help with bullet point phrasing, ATS scoring, resume length, summaries, skills sections, or template choice. Try one of the suggestions, or ask me something more specific.'
    };
    return answers[key] || answers.default;
  }
}
