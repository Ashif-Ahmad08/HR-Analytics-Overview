/* ─── app.js – Khana Khazana HR Dashboard ─── */

/* ══════════════════════════════════
   VALID USERS
══════════════════════════════════ */
const USERS = {
  admin: {
    password: 'admin123',
    name: 'Admin User',
    initials: 'AU',
    role: 'HR Manager',
    email: 'admin@khanakhazana.com',
    phone: '',
    fname: 'Admin', lname: 'User',
    gradient: 'linear-gradient(135deg,#f59e0b,#f97316)'
  },
  ashif: {
    password: 'staff2026',
    name: 'Ashif Ahmad',
    initials: 'AA',
    role: 'HR Analyst',
    email: 'ashif.ahmad@khanakhazana.com',
    phone: '+91 98765 43210',
    fname: 'Ashif', lname: 'Ahmad',
    gradient: 'linear-gradient(135deg,#3b82f6,#8b5cf6)'
  }
};

const REGISTERED_USERS_KEY = 'khazanaFood.registeredUsers';
let registeredUsersStorageError = null;

function loadRegisteredUsers() {
  try {
    const storedUsers = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!storedUsers) return;
    const registeredUsers = JSON.parse(storedUsers);
    if (!Array.isArray(registeredUsers)) throw new Error('Registered user data must be a list.');
    registeredUsers.forEach(user => {
      if (!user || typeof user.username !== 'string' || typeof user.passwordHash !== 'string' ||
          typeof user.passwordSalt !== 'string' || typeof user.name !== 'string' ||
          typeof user.email !== 'string') {
        throw new Error('A saved account has invalid data.');
      }
      if (!/^[a-z0-9._-]{3,24}$/.test(user.username) || USERS[user.username]) {
        throw new Error('A saved account has an invalid or reserved username.');
      }
      USERS[user.username] = { ...user, isRegistered: true };
    });
  } catch (error) {
    registeredUsersStorageError = error;
    console.error('Unable to load saved accounts:', error);
  }
}

function saveRegisteredUsers(users = USERS) {
  const registeredUsers = Object.values(users)
    .filter(user => user.isRegistered)
    .map(({ username, passwordHash, passwordSalt, name, initials, role, email, phone, fname, lname, gradient }) => ({
      username, passwordHash, passwordSalt, name, initials, role, email, phone, fname, lname, gradient
    }));
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
    registeredUsersStorageError = null;
    return true;
  } catch (error) {
    registeredUsersStorageError = error;
    console.error('Unable to save registered accounts:', error);
    return false;
  }
}

function bytesToHex(bytes) {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password, salt) {
  const encoded = new TextEncoder().encode(salt + password);
  return bytesToHex(new Uint8Array(await crypto.subtle.digest('SHA-256', encoded)));
}

loadRegisteredUsers();

let currentUser = null;

/* ══════════════════════════════════
   LOGIN
══════════════════════════════════ */
async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-user').value.trim().toLowerCase();
  const password = document.getElementById('login-pass').value;
  const errEl    = document.getElementById('login-error');
  const btnText  = document.getElementById('login-btn-text');
  const spinner  = document.getElementById('login-spinner');

  errEl.classList.remove('show');

  // Show loading
  btnText.style.display  = 'none';
  spinner.style.display  = 'inline-block';

  await new Promise(resolve => setTimeout(resolve, 600));
  try {
    const user = USERS[username];
    const validPassword = user && (user.passwordHash
      ? await hashPassword(password, user.passwordSalt) === user.passwordHash
      : user.password === password);
    if (validPassword) {
      currentUser = { username, ...user };
      populateProfile(currentUser);
      doLogin();
    } else {
      spinner.style.display = 'none';
      btnText.style.display = 'inline';
      errEl.classList.add('show');
      document.getElementById('login-pass').value = '';
      document.getElementById('login-pass').focus();
    }
  } catch (error) {
    console.error('Unable to verify login:', error);
    spinner.style.display = 'none';
    btnText.style.display = 'inline';
    errEl.textContent = 'Unable to verify sign-in right now. Please try again.';
    errEl.classList.add('show');
  }
}

function toggleAuthMode() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const isCreatingAccount = signupForm.hidden;
  loginForm.hidden = isCreatingAccount;
  signupForm.hidden = !isCreatingAccount;
  document.querySelector('.login-demo').hidden = isCreatingAccount;
  document.getElementById('auth-switch-prompt').textContent = isCreatingAccount
    ? 'Already have an account?'
    : 'New to Khazana Food?';
  document.getElementById('auth-switch-btn').textContent = isCreatingAccount
    ? 'Sign in'
    : 'Create account';
  document.querySelector('.lw-heading').textContent = isCreatingAccount ? 'Create Your Account' : 'Welcome Back';
  document.querySelector('.lw-sub').textContent = isCreatingAccount
    ? 'Create an account to access the HR dashboard'
    : 'Sign in to access the HR dashboard';
  clearSignupError();
  (isCreatingAccount ? document.getElementById('signup-name') : document.getElementById('login-user')).focus();
}

function clearSignupError() {
  const error = document.getElementById('signup-error');
  error.textContent = '';
  error.classList.remove('show');
}

function showSignupError(message) {
  const error = document.getElementById('signup-error');
  error.textContent = message;
  error.classList.add('show');
}

async function handleSignup(event) {
  event.preventDefault();
  clearSignupError();
  if (registeredUsersStorageError) {
    showSignupError('Saved accounts could not be loaded. Please reload and try again.');
    return;
  }

  const name = document.getElementById('signup-name').value.trim().replace(/\s+/g, ' ');
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const username = document.getElementById('signup-user').value.trim().toLowerCase();
  const password = document.getElementById('signup-pass').value;
  const confirmation = document.getElementById('signup-confirm').value;
  if (name.split(' ').length < 2) {
    showSignupError('Enter your first and last name.');
    return;
  }
  if (password.length < 8) {
    showSignupError('Use a password with at least 8 characters.');
    return;
  }
  if (password !== confirmation) {
    showSignupError('The passwords do not match.');
    return;
  }
  if (USERS[username] || Object.values(USERS).some(user => user.email.toLowerCase() === email)) {
    showSignupError('That username or email is already registered.');
    return;
  }

  const buttonText = document.getElementById('signup-btn-text');
  const spinner = document.getElementById('signup-spinner');
  buttonText.style.display = 'none';
  spinner.style.display = 'inline-block';
  try {
    const passwordSalt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
    const passwordHash = await hashPassword(password, passwordSalt);
    const names = name.split(' ');
    const fname = names.shift();
    const lname = names.join(' ') || '';
    const registeredUser = {
      username, passwordHash, passwordSalt, name,
      initials: names.length ? (fname[0] + names[0][0]).toUpperCase() : fname.slice(0, 2).toUpperCase(),
      role: 'HR Analyst',
      email,
      phone: '',
      fname,
      lname,
      gradient: 'linear-gradient(135deg,#d97736,#a84f2b)',
      isRegistered: true
    };
    const usersToSave = { ...USERS, [username]: registeredUser };
    if (!saveRegisteredUsers(usersToSave)) {
      showSignupError('Unable to save the account in this browser. Check storage availability and try again.');
      return;
    }
    USERS[username] = registeredUser;
    currentUser = { username, ...registeredUser };
    populateProfile(currentUser);
    document.getElementById('signup-form').reset();
    doLogin();
  } catch (error) {
    console.error('Unable to create account:', error);
    showSignupError('Unable to create the account right now. Please try again.');
  } finally {
    buttonText.style.display = 'inline';
    spinner.style.display = 'none';
  }
}

function doLogin() {
  const screen = document.getElementById('login-screen');
  screen.classList.add('hidden');
  setTimeout(() => {
    screen.style.display = 'none';
    document.body.classList.remove('locked');
  }, 500);
  updateClock();
  animateCounters();
  initOverviewCharts();
  setTimeout(() => animateProgressBars(), 300);
  showToast('👋 Welcome, ' + currentUser.name + '!');
}

function fillCreds(user, pass) {
  document.getElementById('login-user').value = user;
  document.getElementById('login-pass').value = pass;
  document.getElementById('login-error').classList.remove('show');
  document.getElementById('login-user').focus();
}

function togglePass() {
  const inp = document.getElementById('login-pass');
  const btn = document.getElementById('eye-btn');
  if (inp.type === 'password') { inp.type = 'text';     btn.textContent = '🙈'; }
  else                         { inp.type = 'password'; btn.textContent = '👁'; }
}

/* ══════════════════════════════════
   LOGOUT
══════════════════════════════════ */
function handleLogout() {
  document.getElementById('logoutModal').classList.add('open');
}

function confirmLogout() {
  closeModal('logoutModal');
  currentUser = null;
  // Destroy all charts
  Object.keys(chartInstances).forEach(k => { chartInstances[k].destroy(); delete chartInstances[k]; });
  // Reset login form
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
  document.getElementById('login-error').classList.remove('show');
  document.getElementById('login-btn-text').style.display  = 'inline';
  document.getElementById('login-spinner').style.display   = 'none';
  // Show login screen
  const screen = document.getElementById('login-screen');
  screen.style.display = 'flex';
  screen.classList.remove('hidden');
  document.body.classList.add('locked');
  setTimeout(() => showToast('You’re signed out. See you next time!'), 550);
}

/* ══════════════════════════════════
   POPULATE PROFILE from user object
══════════════════════════════════ */
function populateProfile(user) {
  // Topbar avatar
  const initEl = document.getElementById('ta-initials');
  if (initEl) initEl.textContent = user.initials;
  const ring = document.querySelector('.ta-ring');
  if (ring) ring.style.background = user.gradient;

  // Profile page avatar
  const avatarEl = document.getElementById('profile-avatar-display');
  if (avatarEl) { avatarEl.textContent = user.initials; avatarEl.style.background = user.gradient; }

  // Profile name display
  const nameEl = document.getElementById('ph-name-display');
  if (nameEl) nameEl.textContent = user.name;
  const roleEl = document.getElementById('ph-role-display');
  if (roleEl) roleEl.textContent = user.role;
  const emailEl = document.getElementById('ph-email-display');
  if (emailEl) emailEl.textContent = '📧 ' + user.email;

  // Form fields
  setVal('pf-fname',    user.fname);
  setVal('pf-lname',    user.lname);
  setVal('pf-email',    user.email);
  setVal('pf-phone',    user.phone);
  setVal('pf-username', user.username);
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

/* ══════════════════════════════════
   PROFILE ACTIONS
══════════════════════════════════ */
function saveProfile() {
  const fname = document.getElementById('pf-fname').value.trim();
  const lname = document.getElementById('pf-lname').value.trim();
  const emailInput = document.getElementById('pf-email');
  const email = emailInput.value.trim();
  const phone = document.getElementById('pf-phone').value.trim();
  if (!emailInput.validity.valid || !email) {
    showToast('⚠ Enter a valid email address');
    emailInput.focus();
    return;
  }
  const fullName = (fname + ' ' + lname).trim();
  if (!fname || !lname || !currentUser) {
    showToast('⚠ Enter your first and last name');
    return;
  }
  const initials = fname[0] + lname[0];
  const updatedAccount = {
    ...USERS[currentUser.username],
    name: fullName,
    fname,
    lname,
    email,
    phone,
    initials: initials.toUpperCase()
  };
  if (updatedAccount.isRegistered) {
    const usersToSave = { ...USERS, [currentUser.username]: updatedAccount };
    if (!saveRegisteredUsers(usersToSave)) {
      showToast('⚠ Unable to save profile changes in this browser');
      return;
    }
  }
  USERS[currentUser.username] = updatedAccount;
  currentUser = { ...currentUser, ...updatedAccount };
  populateProfile(currentUser);
  showToast('✅ Profile saved successfully!');
}

async function changePassword() {
  const cur  = document.getElementById('pf-cur-pass')?.value;
  const nw   = document.getElementById('pf-new-pass')?.value;
  const conf = document.getElementById('pf-confirm-pass')?.value;
  if (!cur) { showToast('⚠ Enter current password'); return; }
  if (!nw || nw.length < 6) { showToast('⚠ New password must be 6+ characters'); return; }
  if (nw !== conf) { showToast('⚠ Passwords do not match'); return; }
  if (!currentUser) return;
  const account = USERS[currentUser.username];
  try {
    const currentPasswordValid = account.passwordHash
      ? await hashPassword(cur, account.passwordSalt) === account.passwordHash
      : account.password === cur;
    if (!currentPasswordValid) {
      showToast('❌ Current password is incorrect');
      return;
    }
    if (account.isRegistered) {
      const passwordSalt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
      const updatedAccount = {
        ...account,
        passwordSalt,
        passwordHash: await hashPassword(nw, passwordSalt)
      };
      const usersToSave = { ...USERS, [currentUser.username]: updatedAccount };
      if (!saveRegisteredUsers(usersToSave)) {
        showToast('⚠ Unable to save your password in this browser');
        return;
      }
      USERS[currentUser.username] = updatedAccount;
      currentUser = { ...currentUser, ...updatedAccount };
    } else {
      account.password = nw;
    }
  } catch (error) {
    console.error('Unable to update password:', error);
    showToast('⚠ Unable to update your password right now');
    return;
  }
  document.getElementById('pf-cur-pass').value  = '';
  document.getElementById('pf-new-pass').value  = '';
  document.getElementById('pf-confirm-pass').value = '';
  showToast('🔒 Password updated successfully!');
}

function changeAvatar() {
  const colors = [
    'linear-gradient(135deg,#f59e0b,#f97316)',
    'linear-gradient(135deg,#3b82f6,#8b5cf6)',
    'linear-gradient(135deg,#10b981,#06b6d4)',
    'linear-gradient(135deg,#ef4444,#f97316)',
    'linear-gradient(135deg,#8b5cf6,#ec4899)',
  ];
  if (!currentUser) return;
  const idx = (colors.indexOf(currentUser.gradient) + 1) % colors.length;
  currentUser.gradient = colors[idx];
  populateProfile(currentUser);
  showToast('🎨 Avatar colour updated!');
}

function toggleTheme(cb) {
  const isLight = !cb.checked;
  document.body.classList.toggle('light-mode', isLight);
  applyAccentColor(accentColor);
  Chart.defaults.color = isLight ? '#526176' : '#94a3b8';
  gridOpts.color = isLight ? 'rgba(71,85,105,.12)' : 'rgba(255,255,255,.05)';
  tickOpts.color = isLight ? '#526176' : '#64748b';
  const activePage = document.querySelector('.page.active');
  if (activePage) initChartsFor(activePage.id.replace('page-', ''));
  showToast(cb.checked ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
}

let accentColor = '#f59e0b';
const ACCENT_COLOR_KEY = 'khazanaFood.accentColor';

function blendHexColors(color, target, amount) {
  const sourceRgb = color.match(/[a-f\d]{2}/gi).map(value => parseInt(value, 16));
  const targetRgb = target.match(/[a-f\d]{2}/gi).map(value => parseInt(value, 16));
  return `#${sourceRgb.map((value, index) =>
    Math.round(value + (targetRgb[index] - value) * amount).toString(16).padStart(2, '0')
  ).join('')}`;
}

function applyAccentColor(color) {
  const isLight = document.body.classList.contains('light-mode');
  const darkAccent = blendHexColors(color, '#24170b', 0.3);
  const darkHighlight = blendHexColors(color, '#1b1209', 0.4);
  document.body.style.setProperty('--gold', isLight ? darkAccent : color);
  document.body.style.setProperty('--gold-light', isLight ? darkHighlight : blendHexColors(color, '#ffffff', 0.28));
  document.body.style.setProperty('--orange', isLight
    ? blendHexColors(color, '#a94420', 0.35)
    : blendHexColors(color, '#f97316', 0.35));
  document.body.style.setProperty('--glow-gold', `0 0 20px ${color}40`);
}

function updateAccentColor(color, save) {
  if (!/^#[\da-f]{6}$/i.test(color)) return;
  accentColor = color;
  applyAccentColor(accentColor);
  if (!save) return;
  try {
    localStorage.setItem(ACCENT_COLOR_KEY, accentColor);
    showToast('🎨 Dashboard accent color updated');
  } catch (error) {
    console.error('Unable to save accent color preference:', error);
    showToast('⚠ Accent color changed, but could not be saved');
  }
}

function toggleCompact(cb) {
  const sb = document.getElementById('sidebar');
  if (cb.checked) {
    sb.style.width = '68px';
    document.querySelector('.main-content').style.marginLeft = '68px';
    document.querySelector('.topbar').style.left = '68px';
    document.querySelectorAll('.sidebar-nav span:not(.nav-icon)').forEach(el => el.style.display='none');
    document.querySelector('.sidebar-brand .brand-text').style.display='none';
    document.querySelector('.sidebar-footer').style.display='none';
  } else {
    sb.style.width = '';
    document.querySelector('.main-content').style.marginLeft = '';
    document.querySelector('.topbar').style.left = '';
    document.querySelectorAll('.sidebar-nav span:not(.nav-icon)').forEach(el => el.style.display='');
    document.querySelector('.sidebar-brand .brand-text').style.display='';
    document.querySelector('.sidebar-footer').style.display='';
  }
}

/* ══════════════════════════════════
   LIVE DATE/TIME
══════════════════════════════════ */
function updateClock() {
  const el = document.getElementById('topbar-date');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleString('en-IN', {
    day:'2-digit', month:'short', year:'numeric',
    hour:'2-digit', minute:'2-digit', hour12:true
  });
}
updateClock();
setInterval(updateClock, 60000);

/* ══════════════════════════════════
   PAGE NAVIGATION
══════════════════════════════════ */
const pageTitles = {
  overview:    'HR Overview Dashboard',
  workforce:   'Workforce Planning',
  recruitment: 'Recruitment Analytics',
  training:    'Training Tracker',
  performance: 'Performance Monitoring',
  attendance:  'Leave & Attendance',
  challenges:  'HR Challenges & Solutions',
  profile:     'My Profile'
};

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const page = document.getElementById('page-' + id);
  const nav  = document.getElementById('nav-' + id);
  if (page) page.classList.add('active');
  if (nav)  nav.classList.add('active');

  const titleEl = document.getElementById('topbar-title');
  if (titleEl) titleEl.textContent = pageTitles[id] || '';

  // Close sidebar on mobile
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
  }

  // Init charts for the active page
  setTimeout(() => initChartsFor(id), 80);
}

/* ══════════════════════════════════
   SIDEBAR TOGGLE
══════════════════════════════════ */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

/* ══════════════════════════════════
   COUNTERS (KPI ANIMATION)
══════════════════════════════════ */
function animateCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = +el.dataset.target;
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const tick = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur;
      if (cur >= target) clearInterval(tick);
    }, 30);
  });
}

function animateProgressBars() {
  document.querySelectorAll('.progress-fill, .module-fill').forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { bar.style.width = width; });
    });
  });
}

/* ══════════════════════════════════
   CHART.JS GLOBALS
══════════════════════════════════ */
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = 'Inter';
Chart.defaults.font.size = 12;

const chartInstances = {};

function destroyChart(id) {
  if (chartInstances[id]) {
    chartInstances[id].destroy();
    delete chartInstances[id];
  }
}

/* ── Shared chart options ── */
const gridOpts = {
  color: 'rgba(255,255,255,0.05)',
  drawBorder: false
};
const tickOpts = { color: '#64748b', padding: 6 };

/* ══════════════════════════════════
   CHART INITIALIZER BY PAGE
══════════════════════════════════ */
function initChartsFor(page) {
  switch(page) {
    case 'overview':    initOverviewCharts();    break;
    case 'workforce':   initWorkforceCharts();   break;
    case 'recruitment': initRecruitmentCharts(); break;
    case 'training':    initTrainingCharts();    break;
    case 'performance': initPerformanceCharts(); break;
    case 'attendance':  initAttendanceCharts();  break;
  }
}

/* ══════════════════════════════════
   OVERVIEW CHARTS
══════════════════════════════════ */
function initOverviewCharts() {
  // Department Bar
  destroyChart('deptChart');
  const dc = document.getElementById('deptChart');
  if (!dc) return;
  chartInstances['deptChart'] = new Chart(dc, {
    type: 'bar',
    data: {
      labels: ['Kitchen', 'Service', 'Delivery', 'Support', 'Management', 'Admin'],
      datasets: [
        {
          label: 'Current Staff',
          data: [7, 6, 4, 3, 2, 2],
          backgroundColor: 'rgba(245,158,11,0.75)',
          borderRadius: 6,
          borderSkipped: false
        },
        {
          label: 'Future Required',
          data: [7, 7, 5, 3, 2, 2],
          backgroundColor: 'rgba(59,130,246,0.45)',
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { padding: 20, usePointStyle: true } } },
      scales: {
        x: { grid: gridOpts, ticks: tickOpts },
        y: { grid: gridOpts, ticks: { ...tickOpts, stepSize: 2 }, beginAtZero: true }
      }
    }
  });

  // Category Doughnut
  destroyChart('categoryChart');
  const cc = document.getElementById('categoryChart');
  if (!cc) return;
  chartInstances['categoryChart'] = new Chart(cc, {
    type: 'doughnut',
    data: {
      labels: ['Skilled/Operational', 'Operational', 'Support', 'Managerial', 'Administrative'],
      datasets: [{
        data: [7, 10, 3, 2, 2],
        backgroundColor: ['#f59e0b','#3b82f6','#06b6d4','#f97316','#8b5cf6'],
        borderWidth: 2,
        borderColor: '#111827',
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      cutout: '65%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 14, usePointStyle: true } }
      }
    }
  });
}

/* ══════════════════════════════════
   WORKFORCE CHARTS
══════════════════════════════════ */
function initWorkforceCharts() {
  destroyChart('gapChart');
  const gc = document.getElementById('gapChart');
  if (gc) {
    chartInstances['gapChart'] = new Chart(gc, {
      type: 'bar',
      data: {
        labels: ['Kitchen','Service','Delivery','Support','Management','Admin'],
        datasets: [
          {
            label: 'Current',
            data: [7,6,4,3,2,2],
            backgroundColor: 'rgba(16,185,129,0.75)',
            borderRadius: 6, borderSkipped: false
          },
          {
            label: 'Required',
            data: [7,7,5,3,2,2],
            backgroundColor: 'rgba(239,68,68,0.65)',
            borderRadius: 6, borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { padding: 20, usePointStyle: true } } },
        scales: {
          x: { grid: gridOpts, ticks: tickOpts },
          y: { grid: gridOpts, ticks: { ...tickOpts, stepSize: 2 }, beginAtZero: true }
        }
      }
    });
  }

  destroyChart('wfDistChart');
  const wd = document.getElementById('wfDistChart');
  if (wd) {
    chartInstances['wfDistChart'] = new Chart(wd, {
      type: 'pie',
      data: {
        labels: ['Kitchen (7)','Service (6)','Delivery (4)','Support (3)','Mgmt (2)','Admin (2)'],
        datasets: [{
          data: [7,6,4,3,2,2],
          backgroundColor: ['#f59e0b','#3b82f6','#10b981','#06b6d4','#f97316','#8b5cf6'],
          borderWidth: 2, borderColor: '#111827', hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true, font:{size:11} } } }
      }
    });
  }
}

/* ══════════════════════════════════
   RECRUITMENT CHARTS
══════════════════════════════════ */
function initRecruitmentCharts() {
  destroyChart('sourceChart');
  const sc = document.getElementById('sourceChart');
  if (!sc) return;
  chartInstances['sourceChart'] = new Chart(sc, {
    type: 'doughnut',
    data: {
      labels: ['Employee Referral','Walk-in / Direct','Local Contacts','Online Job Portal'],
      datasets: [{
        data: [45, 30, 18, 7],
        backgroundColor: ['#f59e0b','#3b82f6','#10b981','#8b5cf6'],
        borderWidth: 2, borderColor: '#111827', hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      cutout: '60%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true, font:{size:11} } }
      }
    }
  });
}

/* ══════════════════════════════════
   TRAINING CHARTS
══════════════════════════════════ */
function initTrainingCharts() {
  destroyChart('trainingChart');
  const tc = document.getElementById('trainingChart');
  if (tc) {
    chartInstances['trainingChart'] = new Chart(tc, {
      type: 'bar',
      data: {
        labels: ['Kitchen','Service','Delivery','Support','Admin'],
        datasets: [{
          label: 'Completion %',
          data: [100, 83, 100, 100, 75],
          backgroundColor: [
            'rgba(16,185,129,0.75)',
            'rgba(245,158,11,0.75)',
            'rgba(16,185,129,0.75)',
            'rgba(16,185,129,0.75)',
            'rgba(249,115,22,0.75)'
          ],
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: gridOpts, ticks: tickOpts, max: 100, min: 0 },
          y: { grid: { display: false }, ticks: tickOpts }
        }
      }
    });
  }

  destroyChart('trainingStatusChart');
  const ts = document.getElementById('trainingStatusChart');
  if (ts) {
    chartInstances['trainingStatusChart'] = new Chart(ts, {
      type: 'doughnut',
      data: {
        labels: ['Completed (22)', 'In Progress (2)'],
        datasets: [{
          data: [22, 2],
          backgroundColor: ['#10b981','#f97316'],
          borderWidth: 2, borderColor: '#111827', hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 14, usePointStyle: true } }
        }
      }
    });
  }
}

/* ══════════════════════════════════
   PERFORMANCE CHARTS
══════════════════════════════════ */
function initPerformanceCharts() {
  destroyChart('perfDeptChart');
  const pd = document.getElementById('perfDeptChart');
  if (pd) {
    chartInstances['perfDeptChart'] = new Chart(pd, {
      type: 'radar',
      data: {
        labels: ['Attendance','Work Quality','Customer Feedback','Punctuality','Teamwork'],
        datasets: [
          {
            label: 'Kitchen',
            data: [93, 88, 84, 91, 86],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245,158,11,0.12)',
            pointBackgroundColor: '#f59e0b', pointRadius: 4
          },
          {
            label: 'Service',
            data: [80, 80, 81, 79, 83],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.12)',
            pointBackgroundColor: '#3b82f6', pointRadius: 4
          },
          {
            label: 'Delivery',
            data: [82, 78, 75, 80, 77],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.12)',
            pointBackgroundColor: '#10b981', pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            min: 50, max: 100,
            grid: { color: 'rgba(255,255,255,0.07)' },
            pointLabels: { color: '#94a3b8', font: { size: 11 } },
            ticks: { display: false }
          }
        },
        plugins: { legend: { labels: { padding: 16, usePointStyle: true } } }
      }
    });
  }

  destroyChart('ratingChart');
  const rc = document.getElementById('ratingChart');
  if (rc) {
    chartInstances['ratingChart'] = new Chart(rc, {
      type: 'doughnut',
      data: {
        labels: ['⭐⭐⭐⭐⭐ Excellent (8)','⭐⭐⭐⭐ Good (14)','⭐⭐⭐ Avg (2)'],
        datasets: [{
          data: [8, 14, 2],
          backgroundColor: ['#10b981','#3b82f6','#eab308'],
          borderWidth: 2, borderColor: '#111827', hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        cutout: '60%',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true, font:{size:11} } }
        }
      }
    });
  }
}

/* ══════════════════════════════════
   ATTENDANCE CHARTS
══════════════════════════════════ */
function initAttendanceCharts() {
  destroyChart('attendanceChart');
  const ac = document.getElementById('attendanceChart');
  if (ac) {
    const labels = [];
    for (let i = 1; i <= 30; i++) labels.push(i.toString());
    const present = labels.map(() => Math.floor(21 + Math.random() * 4));
    chartInstances['attendanceChart'] = new Chart(ac, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Staff Present',
          data: present,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.10)',
          fill: true,
          tension: 0.45,
          pointRadius: 3,
          pointBackgroundColor: '#10b981'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { usePointStyle: true } } },
        scales: {
          x: { grid: gridOpts, ticks: { ...tickOpts, maxTicksLimit: 15 } },
          y: { grid: gridOpts, ticks: tickOpts, min: 18, max: 25, stepSize: 1 }
        }
      }
    });
  }

  destroyChart('leaveChart');
  const lc = document.getElementById('leaveChart');
  if (lc) {
    chartInstances['leaveChart'] = new Chart(lc, {
      type: 'doughnut',
      data: {
        labels: ['Casual Leave','Medical Leave','Festival Leave'],
        datasets: [{
          data: [8, 4, 3],
          backgroundColor: ['#10b981','#3b82f6','#f97316'],
          borderWidth: 2, borderColor: '#111827', hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        cutout: '60%',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 14, usePointStyle: true } }
        }
      }
    });
  }
}

/* ══════════════════════════════════
   MODAL HELPERS
══════════════════════════════════ */
function openAddCandidateModal() {
  document.getElementById('addCandidateModal').classList.add('open');
}
function openAddTrainingModal() {
  document.getElementById('addTrainingModal').classList.add('open');
}
function openLeaveModal() {
  document.getElementById('leaveModal').classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

/* ══════════════════════════════════
   FORM HANDLERS
══════════════════════════════════ */
let candidateCount = 5;

function addCandidate(e) {
  e.preventDefault();
  candidateCount++;
  const name     = document.getElementById('cand-name').value;
  const position = document.getElementById('cand-position').value;
  const source   = document.getElementById('cand-source').value;
  const date     = document.getElementById('cand-date').value || '–';

  const tbody = document.getElementById('candidateBody');
  const row   = document.createElement('tr');
  row.innerHTML = `
    <td>${candidateCount}</td>
    <td>${name}</td>
    <td>${position}</td>
    <td>${source}</td>
    <td>Application</td>
    <td>${date}</td>
    <td><span class="status-badge warn">New</span></td>
  `;
  row.style.animation = 'fadeIn .4s ease';
  tbody.appendChild(row);

  document.getElementById('candidateCount').textContent = candidateCount;
  closeModal('addCandidateModal');
  e.target.reset();
  showToast('✅ Candidate added successfully!');
}

function addTraining(e) {
  e.preventDefault();
  closeModal('addTrainingModal');
  e.target.reset();
  showToast('📚 Training module assigned!');
}

function applyLeave(e) {
  e.preventDefault();
  closeModal('leaveModal');
  e.target.reset();
  showToast('🌴 Leave request submitted!');
}

/* ══════════════════════════════════
   EXPORT (print-style)
══════════════════════════════════ */
function exportReport() {
  showToast('📊 Generating report… (use Ctrl+P to print)');
  setTimeout(() => window.print(), 1000);
}

/* ══════════════════════════════════
   QA ACCORDION
══════════════════════════════════ */
function toggleQA(el) {
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.qa-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) el.classList.add('open');
}

/* ══════════════════════════════════
   HR CHATBOT
══════════════════════════════════ */
function initializeChatbot() {
  const form = document.getElementById('chat-form');
  const suggestions = document.getElementById('chat-suggestions');
  if (!form || !suggestions) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    sendChatbotMessage(document.getElementById('chat-input').value);
  });
  suggestions.addEventListener('click', event => {
    const button = event.target.closest('.chat-suggestion');
    if (button) sendChatbotMessage(button.textContent);
  });
}

function toggleChatbot(forceOpen) {
  const panel = document.getElementById('chat-panel');
  const launcher = document.getElementById('chat-launcher');
  const isOpen = forceOpen === undefined ? panel.hidden : forceOpen;
  panel.hidden = !isOpen;
  panel.setAttribute('aria-hidden', String(!isOpen));
  launcher.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) document.getElementById('chat-input').focus();
  else launcher.focus();
}

function sendChatbotMessage(message) {
  const text = message.trim();
  if (!text) return;

  appendChatbotMessage(text, 'user');
  document.getElementById('chat-input').value = '';
  document.getElementById('chat-suggestions').hidden = true;
  appendChatbotMessage(getChatbotResponse(text), 'bot');
}

function appendChatbotMessage(text, sender) {
  const messages = document.getElementById('chat-messages');
  const message = document.createElement('div');
  message.className = 'chat-message ' + sender;
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.textContent = text;
  message.appendChild(bubble);
  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
}

function getChatbotResponse(question) {
  const tokens = question.toLowerCase().match(/[a-z0-9]+/g) || [];
  const aliases = {
    emp: 'employee',
    emps: 'employee',
    ppl: 'people',
    challlenges: 'challenge',
    challanges: 'challenge',
    challange: 'challenge'
  };
  const normalizedTokens = tokens.map(token => {
    if (aliases[token]) return aliases[token];
    if (token.length > 4 && token.endsWith('ies')) return token.slice(0, -3) + 'y';
    if (token.length > 4 && token.endsWith('s')) return token.slice(0, -1);
    return token;
  });
  const matches = (...keywords) => keywords.some(keyword => {
    const parts = keyword.split(' ').map(part => {
      if (aliases[part]) return aliases[part];
      if (part.length > 4 && part.endsWith('ies')) return part.slice(0, -3) + 'y';
      if (part.length > 4 && part.endsWith('s')) return part.slice(0, -1);
      return part;
    });
    return parts.every(part => normalizedTokens.some(token =>
      token === part || (part.length >= 6 && chatbotEditDistanceAtMostOne(token, part))
    ));
  });

  if (matches('workload', 'work load', 'overworked', 'overload', 'work pressure', 'staffing level', 'how much work')) {
    return 'The dashboard does not track workload by individual employee or hours. It shows 24 employees across 6 departments, and notes that peak periods can put pressure on staffing. Teams sometimes provide cross-department support; 2 additional hires are planned for Service and Delivery.';
  }
  if (matches('challenge', 'problem', 'issue', 'retention', 'turnover', 'shortage', 'difficulty')) {
    return 'The main HR challenges are retaining employees, finding skilled and experienced staff, and covering busy peak periods. The dashboard also suggests hiring 2 additional employees: one for Service and one for Delivery.';
  }
  if (matches('employee', 'people', 'staff', 'workforce', 'department', 'headcount', 'team', 'worker', 'how many')) {
    return 'The dashboard currently tracks 24 employees across 6 departments. Workforce Planning has the department breakdown; 2 additional hires are planned for Service and Delivery.';
  }
  if (matches('recruit', 'recruitment', 'hiring', 'candidate', 'vacancy', 'job', 'hire')) {
    return 'The current plan includes 2 hires: one for Service and one for Delivery. Open Recruitment from the sidebar to review candidate tracking.';
  }
  if (matches('training', 'course', 'compliance', 'learning')) {
    return 'Training compliance is currently shown as 92% on the overview. Open Training Tracker for the module and completion details.';
  }
  if (matches('attendance', 'leave', 'absence', 'time off')) {
    return 'The overview shows a 94% attendance rate. Use Attendance & Leave in the sidebar to review attendance and leave information.';
  }
  if (matches('performance', 'efficiency', 'rating', 'productivity')) {
    return 'The overview reports 78% staff efficiency. Open Performance for the available monitoring details.';
  }
  if (matches('help', 'topic', 'hello', 'hi', 'hey', 'what can you')) {
    return 'I can help with employee counts and departments, workload, recruitment, training, attendance and leave, performance, and HR challenges. What would you like to know?';
  }
  return 'I’m not sure I understood that. You can ask things like “How many employees?”, “Tell me about workload”, or “What are the HR challenges?”';
}

function chatbotEditDistanceAtMostOne(left, right) {
  if (Math.abs(left.length - right.length) > 1) return false;
  let leftIndex = 0;
  let rightIndex = 0;
  let differences = 0;
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] === right[rightIndex]) {
      leftIndex++;
      rightIndex++;
      continue;
    }
    if (++differences > 1) return false;
    if (left.length > right.length) leftIndex++;
    else if (right.length > left.length) rightIndex++;
    else {
      leftIndex++;
      rightIndex++;
    }
  }
  return differences + (left.length - leftIndex) + (right.length - rightIndex) <= 1;
}

/* ══════════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════════ */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ══════════════════════════════════
   CLOSE MODAL ON OVERLAY CLICK
══════════════════════════════════ */
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

/* ══════════════════════════════════
   KEYBOARD SHORTCUT (ESC)
══════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    if (!document.getElementById('chat-panel').hidden) toggleChatbot(false);
    if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('open');
  }
});

/* ══════════════════════════════════
   INIT ON LOAD
══════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  try {
    const savedAccentColor = localStorage.getItem(ACCENT_COLOR_KEY);
    if (savedAccentColor && /^#[\da-f]{6}$/i.test(savedAccentColor)) {
      accentColor = savedAccentColor;
    }
  } catch (error) {
    console.error('Unable to load accent color preference:', error);
  }
  document.getElementById('accent-color-picker').value = accentColor;
  applyAccentColor(accentColor);
  initializeChatbot();
  animateCounters();
  initOverviewCharts();
  setTimeout(animateProgressBars, 200);
});
