/* ============================================================
   AUTH PAGES — Login & Signup logic
   No alert()/confirm() used anywhere — all feedback is inline
   or shown via the toast component.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ---------- helpers ---------- */
  function showFieldError(group, msg){
    if(!group) return;
    group.classList.add('invalid');
    const err = group.querySelector('.field-error');
    if(err) err.textContent = msg;
  }
  function clearFieldError(group){
    if(!group) return;
    group.classList.remove('invalid');
  }

  let toastTimer;
  function showToast(msg, type){
    const toast = document.getElementById('authToast');
    if(!toast) return;
    toast.innerHTML = '';
    const icon = document.createElement('i');
    icon.className = type === 'error' ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-check';
    toast.appendChild(icon);
    toast.appendChild(document.createTextNode(' ' + msg));
    toast.className = 'auth-toast show' + (type === 'error' ? ' error' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3400);
  }

  function titleCaseFromEmail(email){
    const handle = email.split('@')[0] || 'Member';
    return handle
      .replace(/[._\-\d]+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') || 'Member';
  }

  /* ---------- floating label reliability (typing + autofill) ----------
     Driven with inline !important styles so nothing else in style.css —
     even another !important rule — can pin the label in place. Wired to
     every input/keystroke event plus a short poll, so it can't miss
     manual typing, paste, or delayed browser/password-manager autofill. */
  function getLabel(input){
    const group = input.closest('.field-group');
    return group ? group.querySelector('label:not(.check-terms):not(.check-remember)') : null;
  }
  function setImp(el, prop, val){ if(el) el.style.setProperty(prop, val, 'important'); }
  function floatLabel(label){
    if(!label) return;
    setImp(label, 'top', '7px');
    setImp(label, 'font-size', '.68rem');
    setImp(label, 'font-weight', '700');
    setImp(label, 'letter-spacing', '.03em');
    setImp(label, 'color', 'var(--gold-deep)');
  }
  function restLabel(label){
    if(!label) return;
    ['top','font-size','font-weight','letter-spacing','color'].forEach(p => label.style.removeProperty(p));
  }
  function syncLabelState(input){
    const label = getLabel(input);
    const group = input.closest('.field-group');
    const filled = input.value.trim().length > 0;
    if(group) group.classList.toggle('has-value', filled);
    if(filled || document.activeElement === input){
      floatLabel(label);
    } else {
      restLabel(label);
    }
  }
  const authInputs = document.querySelectorAll('.field-group input:not([type="checkbox"])');
  authInputs.forEach(input => {
    ['input','keyup','keydown','change','paste','click','focus'].forEach(evt => {
      input.addEventListener(evt, () => syncLabelState(input));
    });
    input.addEventListener('blur', () => syncLabelState(input));
    // Browser autofill animation hook (Chrome/Edge/Safari)
    input.addEventListener('animationstart', e => {
      if(e.animationName === 'onAutoFillStart' || e.animationName === 'onAutoFillCancel'){
        syncLabelState(input);
      }
    });
  });
  // Belt-and-suspenders poll: catches autofill/password-manager fills that
  // land with no event at all, for a few seconds after the page settles.

  [0, 100, 300, 600, 1000, 1500, 2500, 4000].forEach(delay => {
    setTimeout(() => authInputs.forEach(syncLabelState), delay);
  });

  /* ---------- password show/hide ---------- */
  document.querySelectorAll('.pw-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      if(!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.classList.toggle('is-visible', show);
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });

  /* ---------- role switches ---------- */
  document.querySelectorAll('.role-switch').forEach(switchEl => {
    const hidden = document.getElementById(switchEl.dataset.target);
    const group = switchEl.closest('.field-group');
    switchEl.querySelectorAll('.role-option').forEach(opt => {
      opt.addEventListener('click', () => {
        switchEl.querySelectorAll('.role-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        if(hidden) hidden.value = opt.dataset.role;
        clearFieldError(group);
      });
    });
  });

  /* ---------- LOGIN ---------- */
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', e => {
      e.preventDefault();

      const emailGroup = document.getElementById('loginEmailGroup');
      const email = document.getElementById('loginEmail');
      const pwGroup = document.getElementById('loginPasswordGroup');
      const pw = document.getElementById('loginPassword');
      const roleGroup = document.getElementById('loginRoleGroup');
      const roleInput = document.getElementById('loginRole');

      [emailGroup, pwGroup, roleGroup].forEach(clearFieldError);
      let valid = true;

      if(!emailRe.test(email.value.trim())){
        showFieldError(emailGroup, 'Enter a valid email address');
        valid = false;
      }
      if(pw.value.length < 6){
        showFieldError(pwGroup, 'Password must be at least 6 characters');
        valid = false;
      }
      if(!roleInput.value){
        showFieldError(roleGroup, 'Select whether you are a member or admin');
        valid = false;
      }

      if(!valid){
        showToast('Please fix the highlighted fields', 'error');
        return;
      }

      const submitBtn = document.getElementById('loginSubmit');
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        const session = {
          email: email.value.trim(),
          role: roleInput.value,
          name: titleCaseFromEmail(email.value.trim()),
          loginAt: Date.now()
        };
        localStorage.setItem('stacklySession', JSON.stringify(session));
        showToast('Welcome back — opening your dashboard');
        setTimeout(() => {
          window.location.href = session.role === 'admin' ? 'dashboard-admin.html' : 'dashboard-user.html';
        }, 750);
      }, 850);
    });
  }

  /* ---------- SIGNUP ---------- */
  const signupForm = document.getElementById('signupForm');
  if(signupForm){

    const pwInput = document.getElementById('signupPassword');
    const meter = document.getElementById('pwStrength');
    if(pwInput && meter){
      pwInput.addEventListener('input', () => {
        const val = pwInput.value;
        let score = 0;
        if(val.length >= 6) score++;
        if(val.length >= 10) score++;
        if(/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
        if(/[^A-Za-z0-9]/.test(val)) score++;
        meter.classList.toggle('show', val.length > 0);
        meter.dataset.score = String(score);
        const labels = ['Too short', 'Weak', 'Fair', 'Strong', 'Very strong'];
        const labelEl = meter.querySelector('.pw-strength-label');
        if(labelEl) labelEl.textContent = val ? labels[score] : '';
      });
    }

    signupForm.addEventListener('submit', e => {
      e.preventDefault();

      const nameGroup = document.getElementById('signupNameGroup');
      const name = document.getElementById('signupName');
      const emailGroup = document.getElementById('signupEmailGroup');
      const email = document.getElementById('signupEmail');
      const pwGroup = document.getElementById('signupPasswordGroup');
      const pw = document.getElementById('signupPassword');
      const cpwGroup = document.getElementById('signupConfirmGroup');
      const cpw = document.getElementById('signupConfirm');
      const roleGroup = document.getElementById('signupRoleGroup');
      const roleInput = document.getElementById('signupRole');
      const terms = document.getElementById('signupTerms');
      const termsGroup = document.getElementById('signupTermsGroup');

      [nameGroup, emailGroup, pwGroup, cpwGroup, roleGroup, termsGroup].forEach(clearFieldError);
      let valid = true;

      if(name.value.trim().length < 2){
        showFieldError(nameGroup, 'Enter your full name');
        valid = false;
      }
      if(!emailRe.test(email.value.trim())){
        showFieldError(emailGroup, 'Enter a valid email address');
        valid = false;
      }
      if(pw.value.length < 6){
        showFieldError(pwGroup, 'Use at least 6 characters');
        valid = false;
      }
      if(!cpw.value || cpw.value !== pw.value){
        showFieldError(cpwGroup, 'Passwords do not match');
        valid = false;
      }
      if(!roleInput.value){
        showFieldError(roleGroup, 'Select the account type');
        valid = false;
      }
      if(termsGroup && terms && !terms.checked){
        showFieldError(termsGroup, 'Please accept the membership terms');
        valid = false;
      }

      if(!valid){
        showToast('Please fix the highlighted fields', 'error');
        return;
      }

      const submitBtn = document.getElementById('signupSubmit');
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast('Account created — redirecting you to log in');
        setTimeout(() => {
          window.location.href = 'login.html?email=' + encodeURIComponent(email.value.trim());
        }, 900);
      }, 850);
    });
  }

  /* ---------- prefill email after signup redirect ---------- */
  const loginEmail = document.getElementById('loginEmail');
  if(loginEmail){
    const params = new URLSearchParams(window.location.search);
    const prefill = params.get('email');
    if(prefill){
      loginEmail.value = prefill;
      syncLabelState(loginEmail);
      const pwField = document.getElementById('loginPassword');
      if(pwField) pwField.focus();
    }
  }
});