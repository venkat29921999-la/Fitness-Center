/* ============================================================
   DASHBOARDS — shared logic for dashboard-admin.html & dashboard-user.html
   No alert()/confirm() used anywhere.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  const body = document.body;
  const role = body.dataset.role; // 'admin' | 'user'

  /* ---------- session guard ---------- */
  let session = null;
  try{ session = JSON.parse(localStorage.getItem('forgeSession')); }catch(err){ session = null; }

  if(!session || !session.role){
    window.location.href = 'login.html';
    return;
  }
  if(session.role !== role){
    window.location.href = session.role === 'admin' ? 'dashboard-admin.html' : 'dashboard-user.html';
    return;
  }

  /* ---------- populate session info ---------- */
  document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = session.name);
  document.querySelectorAll('[data-user-email]').forEach(el => el.textContent = session.email);
  document.querySelectorAll('[data-user-initial]').forEach(el => el.textContent = (session.name || 'M').charAt(0).toUpperCase());
  const today = new Date();
  document.querySelectorAll('[data-today]').forEach(el => {
    el.textContent = today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  });

  /* ---------- sidebar (mobile) ---------- */
  const menuBtn = document.getElementById('dashMenuBtn');
  const sidebar = document.getElementById('dashSidebar');
  const overlay = document.getElementById('dashOverlay');
  const sidebarCloseBtn = document.getElementById('dashSidebarClose');
  function toggleSidebar(open){
    const isOpen = open !== undefined ? open : !sidebar.classList.contains('open');
    sidebar.classList.toggle('open', isOpen);
    overlay.classList.toggle('show', isOpen);
    menuBtn.classList.toggle('open', isOpen);
    body.classList.toggle('no-scroll', isOpen);
  }
  menuBtn?.addEventListener('click', () => toggleSidebar());
  sidebarCloseBtn?.addEventListener('click', () => toggleSidebar(false));
  overlay?.addEventListener('click', () => toggleSidebar(false));
  document.querySelectorAll('.dash-nav a').forEach(a => {
    a.addEventListener('click', () => {
      document.querySelectorAll('.dash-nav a').forEach(x => x.classList.remove('active'));
      a.classList.add('active');
      toggleSidebar(false);
    });
  });

  /* ---------- logout ---------- */
  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.removeItem('forgeSession');
      window.location.href = 'login.html';
    });
  });

  /* ---------- user dropdown ---------- */
  const userMenuWrap = document.querySelector('.dash-user-menu');
  const userMenuBtn = document.getElementById('userMenuBtn');
  const userMenu = document.getElementById('userMenu');
  userMenuBtn?.addEventListener('click', e => {
    e.stopPropagation();
    userMenu.classList.toggle('show');
    userMenuWrap.classList.toggle('open');
  });
  document.addEventListener('click', () => {
    userMenu?.classList.remove('show');
    userMenuWrap?.classList.remove('open');
  });

  /* ---------- count-up stats ---------- */
  const counters = document.querySelectorAll('[data-count-to]');
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => countObserver.observe(c));

  function animateCount(el){
    const target = parseFloat(el.dataset.countTo);
    const duration = 1100;
    const start = performance.now();
    function tick(now){
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = val.toLocaleString();
      if(p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(tick);
  }

  /* ---------- bar chart reveal ---------- */
  const bars = document.querySelectorAll('.bar[data-value]');
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.style.height = entry.target.dataset.value + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => barObserver.observe(b));

  /* ---------- progress bars reveal ---------- */
  const fills = document.querySelectorAll('.progress-fill[data-value]');
  const fillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.style.width = entry.target.dataset.value + '%';
        fillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => fillObserver.observe(f));

  /* ============================================================
     DYNAMIC INBOX
     ============================================================ */
  const emailData = {
    admin: [
      { id: 1, category: 'inquiry', name: 'Ravi Menon', subject: 'Interested in the 1:1 coaching plan', snippet: "I'd like to know more about personal coaching slots for early mornings, ideally before 7am.", time: '9:12 AM', unread: true,
        body: "Hi team,\n\nI'd like to know more about personal coaching slots for early mornings, ideally before 7am. I train for powerlifting and I'm looking for someone who can review my squat and deadlift technique.\n\nCould someone from the coaching staff call me back this week?\n\nThanks,\nRavi" },
      { id: 2, category: 'inquiry', name: 'Aditi Sharma', subject: 'Day pass availability this weekend', snippet: 'Do you have day passes available for Saturday morning boxing sessions?', time: '8:47 AM', unread: true,
        body: "Hello,\n\nDo you have day passes available for Saturday morning boxing sessions? I'm visiting the city and would love to try a class.\n\nBest,\nAditi" },
      { id: 3, category: 'billing', name: 'Karthik Iyer', subject: 'Question about my renewal invoice', snippet: 'My card was charged twice this month for the strength membership plan.', time: '7:30 AM', unread: false,
        body: "Hi,\n\nMy card was charged twice this month for the strength membership plan. Could you check and refund the duplicate charge?\n\nThanks,\nKarthik" },
      { id: 4, category: 'newsletter', name: 'Newsletter signup', subject: 'New newsletter subscriber', snippet: 'priya.raman@example.com just subscribed to the monthly note.', time: 'Yesterday', unread: false,
        body: "A new visitor subscribed to the Forge monthly newsletter from the footer form.\n\nEmail: priya.raman@example.com" },
      { id: 5, category: 'inquiry', name: 'Farah Qureshi', subject: 'Switching from another gym', snippet: "I've trained for 3 years elsewhere and I'm looking for a more coached environment.", time: 'Yesterday', unread: false,
        body: "Hi,\n\nI've trained for 3 years elsewhere and I'm looking for a more coached environment. Can I book a walk-through this week?\n\nFarah" },
      { id: 6, category: 'billing', name: 'Deepak Nair', subject: 'Requesting a 2-month freeze', snippet: 'I will be travelling for work and would like to freeze my membership.', time: 'Monday', unread: false,
        body: "Hello,\n\nI will be travelling for work starting next month and would like to freeze my membership for two months, effective the 1st.\n\nThanks,\nDeepak" }
    ],
    user: [
      { id: 1, category: 'billing', name: 'Forge Billing', subject: 'Your September receipt is ready', snippet: 'Your strength membership payment of $149 was processed successfully.', time: 'Today', unread: true,
        body: "Hi there,\n\nYour strength membership payment of $149 was processed successfully on the 1st. Your next billing date is October 1.\n\nThanks for training with us.\n— Forge Billing" },
      { id: 2, category: 'class', name: 'Coach Malik', subject: 'Reminder: Boxing fundamentals at 6 PM', snippet: 'Quick reminder that your boxing class starts at 6 PM today. Bring wraps.', time: '11:20 AM', unread: true,
        body: "Hey,\n\nQuick reminder that your boxing fundamentals class starts at 6 PM today on the main floor. Bring your own wraps if you have them — loaners are available at the desk.\n\nSee you on the floor,\nCoach Malik" },
      { id: 3, category: 'general', name: 'Forge Athletic Club', subject: 'Welcome to Forge — start here', snippet: 'Your first movement assessment is booked. Here is what to expect.', time: '2 days ago', unread: false,
        body: "Welcome to Forge,\n\nYour first movement assessment is booked for this week. Come 10 minutes early, wear something you can move in, and bring water.\n\nSee you on the floor." },
      { id: 4, category: 'class', name: 'Coach Priya', subject: 'Your program has been updated', snippet: 'I reviewed your numbers from last month and adjusted your squat block.', time: '3 days ago', unread: false,
        body: "Hi,\n\nI reviewed your numbers from last month and adjusted your squat block for the next four weeks. Check the board at the desk for the updated sheet.\n\n— Coach Priya" },
      { id: 5, category: 'general', name: 'Forge Athletic Club', subject: 'The floor is closed Sept 14 for maintenance', snippet: 'We are resurfacing the boxing area on the 14th. All classes are moved.', time: '1 week ago', unread: false,
        body: "Hi,\n\nWe're resurfacing the boxing area on the 14th. All classes that day are moved to the strength room, same times.\n\nThanks for your patience." }
    ]
  };

  const categoryMeta = {
    inquiry:    { label: 'Inquiry',    icon: 'fa-comment-dots',          color: '#C6A15B' },
    billing:    { label: 'Billing',    icon: 'fa-file-invoice-dollar',   color: '#E4C480' },
    newsletter: { label: 'Newsletter', icon: 'fa-envelope-open-text',    color: '#8FB39C' },
    class:      { label: 'Class',      icon: 'fa-dumbbell',              color: '#C6A15B' },
    general:    { label: 'General',    icon: 'fa-house',                 color: '#8E6E37' }
  };

  const inboxList = document.getElementById('inboxList');
  if(inboxList){
    const state = {
      filter: 'all',
      query: '',
      items: (emailData[role] || []).map(d => ({ ...d, expanded: false }))
    };

    function renderUnreadCount(){
      const unread = state.items.filter(i => i.unread).length;
      document.querySelectorAll('[data-unread-count]').forEach(el => el.textContent = unread);
      document.querySelectorAll('[data-unread-badge]').forEach(el => {
        el.style.display = unread > 0 ? 'flex' : 'none';
      });
    }

    function buildChips(){
      const chipsWrap = document.getElementById('inboxChips');
      if(!chipsWrap) return;
      const cats = Array.from(new Set((emailData[role] || []).map(d => d.category)));
      const chips = [{ key: 'all', label: 'All' }, { key: 'unread', label: 'Unread' }]
        .concat(cats.map(c => ({ key: c, label: categoryMeta[c] ? categoryMeta[c].label : c })));
      chipsWrap.innerHTML = '';
      chips.forEach(chip => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'inbox-chip' + (chip.key === 'all' ? ' active' : '');
        btn.textContent = chip.label;
        btn.addEventListener('click', () => {
          chipsWrap.querySelectorAll('.inbox-chip').forEach(c => c.classList.remove('active'));
          btn.classList.add('active');
          state.filter = chip.key;
          render();
        });
        chipsWrap.appendChild(btn);
      });
    }

    function render(){
      renderUnreadCount();

      let items = state.items;
      if(state.filter === 'unread') items = items.filter(i => i.unread);
      else if(state.filter !== 'all') items = items.filter(i => i.category === state.filter);
      if(state.query){
        const q = state.query.toLowerCase();
        items = items.filter(i =>
          i.subject.toLowerCase().includes(q) ||
          i.name.toLowerCase().includes(q) ||
          i.snippet.toLowerCase().includes(q)
        );
      }

      inboxList.innerHTML = '';

      if(items.length === 0){
        const empty = document.createElement('div');
        empty.className = 'inbox-empty';
        empty.innerHTML = '<i class="fa-solid fa-inbox"></i><p>No messages match your search or filter right now.</p>';
        inboxList.appendChild(empty);
        return;
      }

      items.forEach(item => {
        const meta = categoryMeta[item.category] || categoryMeta.general;
        const el = document.createElement('div');
        el.className = 'inbox-item' + (item.unread ? ' unread' : '') + (item.expanded ? ' expanded' : '');

        const avatar = document.createElement('div');
        avatar.className = 'inbox-avatar';
        avatar.style.background = meta.color + '26';
        avatar.style.color = meta.color;
        avatar.innerHTML = `<i class="fa-solid ${meta.icon}"></i>`;

        const bodyWrap = document.createElement('div');
        bodyWrap.className = 'inbox-body';
        bodyWrap.innerHTML = `
          <div class="inbox-row">
            <span class="inbox-name">${item.name}</span>
            <span class="inbox-time">${item.time}</span>
          </div>
          <p class="inbox-subject">${item.subject}</p>
          <p class="inbox-snippet">${item.snippet}</p>
          <div class="inbox-detail">
            <p>${item.body.replace(/\n/g, '<br>')}</p>
            <div class="inbox-actions">
              <button type="button" class="inbox-action-btn" data-action="toggle-read">
                <i class="fa-solid ${item.unread ? 'fa-envelope-open' : 'fa-envelope'}"></i>
                Mark as ${item.unread ? 'read' : 'unread'}
              </button>
              <button type="button" class="inbox-action-btn" data-action="archive">
                <i class="fa-solid fa-box-archive"></i> Archive
              </button>
            </div>
          </div>`;

        el.appendChild(avatar);
        el.appendChild(bodyWrap);

        el.addEventListener('click', e => {
          if(e.target.closest('.inbox-action-btn')) return;
          item.expanded = !item.expanded;
          if(item.expanded && item.unread) item.unread = false;
          render();
        });

        bodyWrap.querySelector('[data-action="toggle-read"]').addEventListener('click', e => {
          e.stopPropagation();
          item.unread = !item.unread;
          render();
        });
        bodyWrap.querySelector('[data-action="archive"]').addEventListener('click', e => {
          e.stopPropagation();
          state.items = state.items.filter(i => i.id !== item.id);
          render();
        });

        inboxList.appendChild(el);
      });
    }

    buildChips();

    const searchInput = document.getElementById('inboxSearch');
    searchInput?.addEventListener('input', () => {
      state.query = searchInput.value.trim();
      render();
    });

    render();
  } else {
    // still surface an unread count on pages without a rendered inbox list
    const unread = (emailData[role] || []).filter(i => i.unread).length;
    document.querySelectorAll('[data-unread-count]').forEach(el => el.textContent = unread);
    document.querySelectorAll('[data-unread-badge]').forEach(el => { el.style.display = unread > 0 ? 'flex' : 'none'; });
  }

  /* ---------- inline section switching (nav acts like tabs, no scrolling) ---------- */
  const sections = document.querySelectorAll('.dash-section');
  const navLinks = document.querySelectorAll('.dash-nav a');

  function showSection(id){
    if(!document.getElementById(id)) return;
    sections.forEach(s => s.classList.toggle('active', s.id === id));
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    history.replaceState(null, '', '#' + id);
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if(target && target.classList.contains('dash-section')){
      link.addEventListener('click', e => {
        e.preventDefault();
        showSection(id);
        toggleSidebar(false);
      });
    }
  });

  const hashId = window.location.hash.replace('#', '');
  showSection(document.getElementById(hashId) && document.getElementById(hashId).classList.contains('dash-section') ? hashId : 'overview');

  /* ---------- dashboard toast (settings / billing feedback) ---------- */
  let dashToastTimer;
  function showDashToast(msg){
    const toast = document.getElementById('dashToast');
    if(!toast) return;
    toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + msg;
    toast.className = 'auth-toast show';
    clearTimeout(dashToastTimer);
    dashToastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  /* ---------- settings: prefill + save ---------- */
  const profileNameField = document.getElementById('profileName');
  const profileEmailField = document.getElementById('profileEmail');
  if(profileNameField) profileNameField.value = session.name;
  if(profileEmailField) profileEmailField.value = session.email;

  document.querySelectorAll('[data-save-settings]').forEach(btn => {
    btn.addEventListener('click', () => showDashToast('Settings saved successfully'));
  });

  document.querySelectorAll('[data-update-payment]').forEach(btn => {
    btn.addEventListener('click', () => showDashToast('This is a demo — no live payment details were changed'));
  });

  document.querySelectorAll('[data-quick-action]').forEach(btn => {
    btn.addEventListener('click', () => showDashToast(btn.dataset.quickAction));
  });

  document.querySelectorAll('[data-danger-action]').forEach(btn => {
    btn.addEventListener('click', () => showDashToast(btn.dataset.dangerAction));
  });

  document.querySelectorAll('[data-class-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.schedule-item');
      const done = btn.classList.toggle('is-booked');
      btn.textContent = done ? 'Cancel' : 'Book spot';
      if(row) row.style.opacity = '1';
    });
  });

  /* ---------- class booking toggle (member dashboard) ---------- */
  document.querySelectorAll('[data-book-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const booked = btn.classList.toggle('is-booked');
      btn.innerHTML = booked
        ? '<i class="fa-solid fa-circle-check"></i> Booked'
        : '<i class="fa-solid fa-plus"></i> Book class';
    });
  });

  /* ---------- member status toggle (admin table) ---------- */
  document.querySelectorAll('[data-status-toggle]').forEach(badge => {
    badge.addEventListener('click', () => {
      const nowActive = badge.classList.toggle('status-active');
      badge.classList.toggle('status-paused', !nowActive);
      badge.textContent = nowActive ? 'Active' : 'Paused';
    });
  });
});