
(function () {
  'use strict';
  const CONFIG = {
    brandName: 'Customer Service',
    subtitle: 'Active now',
    connectionTitle: 'Customer Service',
    connectionText: 'Anda sedang terhubung dengan kami',
    footerDetail: 'Customer Service · Typically replies instantly',
    logoUrl: 'https://i.ibb.co/hjQm5Dw/FB-MESSENGER.png',
    csPhotoUrl: 'https://i.ibb.co/4w2CBjQg/SHANTY.jpg',
    fallbackLogo: '',
    primaryColor: '#087cf5',
    positionRight: '22px',
    positionBottom: '20px',
    windowWidth: '360px',
    windowHeight: '480px',
    mobileWidth: 'calc(100vw - 24px)',
    mobileHeight: 'min(480px, calc(100dvh - 100px))',
    sessionDuration: 60 * 60 * 1000,
    notificationDelay: 30 * 1000,
    launcherSize: '50px', // Ukuran tombol/logo desktop
    mobileLauncherSize: '50px', // Ukuran tombol/logo HP
    ctaText: 'Hubungi Kami',
    ctaUrl: 'https://www.facebook.com/profile.php?id=61593241347707',
    storageKey: 'customMessengerPersistentV4',
    randomReplies: [
      'Terima kasih telah mengunjungi website kami.',
      'Apakah ada informasi yang sedang Anda cari? Kami siap membantu Anda.',
      'Silakan sampaikan pertanyaan Anda kepada kami.',
      'Tim Customer Service kami siap membantu Anda.',
      'Jika membutuhkan informasi lebih lanjut, silakan hubungi kami.'
    ]
  };

let host = document.getElementById('custom-messenger-v4');

if (!host) {
  host = document.createElement('div');
  host.id = 'custom-messenger-v4';
  document.body.appendChild(host);
}
if (host.dataset.initialized === 'true') return;
host.dataset.initialized = 'true';
const shadow = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = `
    :host { all: initial; position: fixed; inset: 0; z-index: 2147483000; pointer-events: none; font-family: Arial, Helvetica, sans-serif; color-scheme: light; }
    *, *::before, *::after { box-sizing: border-box; }
    button, a { font-family: inherit; -webkit-tap-highlight-color: transparent; }
    button { cursor: pointer; border: 0; }
    .launcher { position: fixed; left: ${CONFIG.positionRight}; bottom: ${CONFIG.positionBottom}; width: ${CONFIG.launcherSize}; height: ${CONFIG.launcherSize}; border-radius: 50%; background: ${CONFIG.primaryColor}; color: #fff; box-shadow: 0 5px 20px rgba(0,0,0,.24); display: flex; align-items: center; justify-content: center; pointer-events: auto; z-index: 2; transition: transform .2s; }
    .launcher:hover { transform: scale(1.06); }
    .launcher .launcher-logo { width: 50px; height: 50px; object-fit: contain; border-radius: 50%; }
    .launcher .fallback { font-size: 19px; font-weight: 700; }
    .badge { position: absolute; top: -3px; right: -3px; width: 19px; height: 19px; border-radius: 50%; background: #f02849; border: 2px solid white; color: white; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; opacity: 0; transform: scale(.5); transition: .2s; pointer-events: none; }
    .badge.show { opacity: 1; transform: scale(1); animation: badgePulse 1.7s ease-in-out infinite; }
    .badge.show::after { content: ''; position: absolute; inset: -5px; border: 2px solid #f02849; border-radius: 50%; animation: badgeRing 1.7s ease-out infinite; pointer-events: none; }
    @keyframes badgePulse { 0%, 100% { transform: scale(1); } 45% { transform: scale(1.22); } }
    @keyframes badgeRing { 0% { opacity: .7; transform: scale(.7); } 75%, 100% { opacity: 0; transform: scale(1.6); } }
    .panel { position: fixed; left: ${CONFIG.positionRight}; bottom: calc(${CONFIG.positionBottom} + 76px); width: ${CONFIG.windowWidth}; height: ${CONFIG.windowHeight}; max-width: calc(100vw - 24px); max-height: calc(100dvh - 105px); display: flex; flex-direction: column; overflow: hidden; border-radius: 15px; background: white; box-shadow: 0 8px 35px rgba(0,0,0,.22); pointer-events: none; opacity: 0; visibility: hidden; transform: translateY(12px) scale(.97); transform-origin: bottom left; transition: opacity .2s, transform .2s, visibility .2s; }
    .panel.open { pointer-events: auto; opacity: 1; visibility: visible; transform: translateY(0) scale(1); }
    .header { background: ${CONFIG.primaryColor}; color: white; min-height: 70px; padding: 13px 14px; display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
    .avatar-header { width: 42px; height: 42px; flex-shrink: 0; border-radius: 50%; overflow: hidden; background: #f6f7f9; }
    .avatar-header img { width: 100%; height: 100%; object-fit: cover; }
    .default-user-icon { width: 24px; height: 24px; }
    .header-info { flex: 1; min-width: 0; }
    .header-name { font-size: 15px; line-height: 20px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .header-status { font-size: 11px; line-height: 17px; color: #fff; opacity: .95; }
    .status-dot { font-size: 12px; margin-right: 3px; }
    .close { background: transparent; color: #fff; width: 32px; height: 32px; font-size: 23px; border-radius: 50%; display: grid; place-items: center; }
    .close:hover { background: rgba(255,255,255,.14); }
    .body { background: #fff; flex: 1; min-height: 0; overflow-y: auto; padding: 16px 12px; display: flex; flex-direction: column; gap: 12px; }
    .intro { text-align: center; padding: 1px 5px 5px; flex-shrink: 0; }
    .intro-title { color: #b9bcc3; font-weight: 700; font-size: 14px; margin-bottom: 6px; }
    .intro-text { color: #858b96; font-size: 12px; line-height: 1.4; }
    .message-row { display: flex; align-items: flex-end; gap: 8px; max-width: 100%; }
    .message-avatar { width: 25px; height: 25px; flex-shrink: 0; border-radius: 50%; background: #e5e7eb; display: flex; align-items: center; justify-content: center; overflow: hidden; color: #a8adb7; font-size: 9px; }
    .message-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .message-content { min-width: 0; }
    .bubble { background: #e5e7eb; color: #10151c; padding: 11px 12px; border-radius: 13px 13px 13px 4px; font-size: 13px; line-height: 1.45; overflow-wrap: anywhere; }
    .time { font-size: 10px; color: #969ba5; padding: 4px 0 0 4px; }
    .typing { display: flex; align-items: center; gap: 8px; }
    .typing-bubble { background: #e5e7eb; padding: 12px 14px; border-radius: 13px; display: flex; gap: 4px; }
    .typing-dot { width: 6px; height: 6px; border-radius: 50%; background: #9197a1; animation: typing 1s infinite ease-in-out; }
    .typing-dot:nth-child(2) { animation-delay: .15s; }
    .typing-dot:nth-child(3) { animation-delay: .3s; }
    @keyframes typing { 0%,60%,100% { transform: translateY(0); opacity: .5; } 30% { transform: translateY(-4px); opacity: 1; } }
    .footer { flex-shrink: 0; padding: 10px 12px 12px; border-top: 1px solid #eee; background: #fff; }
    .cta { min-height: 41px; width: 100%; background: ${CONFIG.primaryColor}; color: #fff; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; text-decoration: none; }
    .cta:hover { filter: brightness(.95); }
    .footer-detail { color: #989da6; font-size: 11px; line-height: 16px; text-align: center; padding-top: 8px; }
    [hidden] { display: none !important; }
    @media (max-width: 600px) { .launcher { left: 16px; bottom: 65px; width: ${CONFIG.mobileLauncherSize}; height: ${CONFIG.mobileLauncherSize}; } .panel { left: 12px; bottom: 135px; width: ${CONFIG.mobileWidth}; height: ${CONFIG.mobileHeight}; max-width: calc(100vw - 24px); max-height: calc(100dvh - 100px); } }
    @media (prefers-reduced-motion: reduce) { .panel, .launcher, .badge { transition: none; } .typing-dot, .badge.show, .badge.show::after { animation: none; } }
  `;
  shadow.appendChild(style);

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <button class="launcher" type="button" aria-label="Buka Messenger" aria-expanded="false">
      <img class="launcher-logo" alt="" hidden><span class="fallback">CS</span><span class="badge">1</span>
    </button>
    <section class="panel" role="dialog" aria-label="Percakapan Customer Service" aria-hidden="true" inert>
      <div class="header">
        <div class="avatar-header"><img class="header-logo" alt="" hidden><svg class="default-user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="7" r="3"/><path d="M5.5 20c0-4 2.6-6 6.5-6s6.5 2 6.5 6"/></svg></div>
        <div class="header-info"><div class="header-name"></div><div class="header-status"><span class="status-dot">●</span><span class="status-text"></span></div></div>
        <button class="close" type="button" aria-label="Tutup Messenger">−</button>
      </div>
      <div class="body"><div class="intro"><div class="intro-title"></div><div class="intro-text"></div></div><div class="messages"></div></div>
      <div class="footer"><a class="cta" target="_blank" rel="noopener noreferrer"></a><div class="footer-detail"></div></div>
    </section>`;
  shadow.appendChild(wrapper);
  const $ = selector => shadow.querySelector(selector);
  const launcher = $('.launcher');
  const badge = $('.badge');
  const panel = $('.panel');
  const body = $('.body');
  const messagesContainer = $('.messages');
  const intro = $('.intro');
  const closeButton = $('.close');
  const controller = new AbortController();
  const listenerOptions = { signal: controller.signal };
  $('.header-name').textContent = CONFIG.brandName;
  $('.status-text').textContent = CONFIG.subtitle;
  $('.intro-title').textContent = CONFIG.connectionTitle;
  $('.intro-text').textContent = CONFIG.connectionText;
  $('.footer-detail').textContent = CONFIG.footerDetail;
  $('.cta').textContent = CONFIG.ctaText;
  $('.cta').href = CONFIG.ctaUrl;
  $('.fallback').textContent = CONFIG.fallbackLogo;
  const launcherLogo = $('.launcher-logo');
  const headerLogo = $('.header-logo');
  if (CONFIG.logoUrl) {
    launcherLogo.onerror = () => { launcherLogo.hidden = true; $('.fallback').hidden = false; };
    launcherLogo.src = CONFIG.logoUrl;
    launcherLogo.hidden = false;
    $('.fallback').hidden = true;
  }
  if (CONFIG.csPhotoUrl) {
    headerLogo.onerror = () => { headerLogo.hidden = true; $('.default-user-icon').hidden = false; };
    headerLogo.src = CONFIG.csPhotoUrl;
    headerLogo.hidden = false;
    $('.default-user-icon').hidden = true;
  }

  let memorySession = null;
  function readSession() {
    try {
      const raw = localStorage.getItem(CONFIG.storageKey);
      if (raw) {
        const value = JSON.parse(raw);
        if (validSession(value)) return value;
      }
    } catch (_) {}
    return memorySession;
  }
  function validSession(value) {
    return !!(value && Number.isFinite(value.created) && Number.isFinite(value.expires) && typeof value.opened === 'boolean' && Array.isArray(value.messages) && value.messages.length === 3 && value.messages.every(m => m && typeof m.text === 'string' && typeof m.time === 'string'));
  }
  let session;
  function saveSession() {
    memorySession = session;
    try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(session)); } catch (_) {}
  }
  function wibHour(date = new Date()) {
    return Number(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Jakarta', hour: '2-digit', hourCycle: 'h23' }).format(date));
  }
  function greeting(date = new Date()) {
    const hour = wibHour(date);
    return hour >= 4 && hour < 11 ? 'Selamat pagi' : hour >= 11 && hour < 15 ? 'Selamat siang' : hour >= 15 && hour < 18 ? 'Selamat sore' : 'Selamat malam';
  }
  function wibTime(date = new Date()) {
    return new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
  }
  function createMessages(created = Date.now(), deterministic = false) {
    const replies = [...CONFIG.randomReplies];
    let seed = (created >>> 0) || 1;
    function random() {
      if (!deterministic) return Math.random();
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    }
    for (let i = replies.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [replies[i], replies[j]] = [replies[j], replies[i]];
    }
    const date = new Date(created);
    return [greeting(date) + '!', ...replies.slice(0, 2)].map(text => ({ text, time: wibTime(date) }));
  }
  function createSession(created = Date.now(), deterministic = false) {
    return { created, expires: created + CONFIG.sessionDuration, opened: false, displayed: false, messages: createMessages(created, deterministic) };
  }
  session = readSession();
  const expiredAtLoad = !!(session && session.expires <= Date.now());
  if (!session) { session = createSession(); saveSession(); }

  let isOpen = false;
  let rendered = false;
  let badgeTimer = null;
  let sessionTimer = null;
  let renderToken = 0;
  function hideBadge() { badge.classList.remove('show'); }
  function showBadge() { if (!session.opened && !isOpen) badge.classList.add('show'); else hideBadge(); }
  function scheduleBadge() {
    clearTimeout(badgeTimer);
    if (session.opened || isOpen) { hideBadge(); return; }
    const remaining = CONFIG.notificationDelay - (Date.now() - session.created);
    if (remaining <= 0) { showBadge(); return; }
    hideBadge();
    badgeTimer = setTimeout(() => { checkSession(); showBadge(); }, remaining);
  }
  function avatarElement() {
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    if (CONFIG.csPhotoUrl) {
      const img = document.createElement('img');
      img.alt = '';
      img.src = CONFIG.csPhotoUrl;
      img.onerror = () => { img.remove(); avatar.textContent = '•'; };
      avatar.appendChild(img);
    } else avatar.textContent = '•';
    return avatar;
  }
  function messageElement(message) {
    const row = document.createElement('div'); row.className = 'message-row';
    const content = document.createElement('div'); content.className = 'message-content';
    const bubble = document.createElement('div'); bubble.className = 'bubble'; bubble.textContent = message.text;
    const time = document.createElement('div'); time.className = 'time'; time.textContent = message.time + ' WIB';
    content.append(bubble, time); row.append(avatarElement(), content); return row;
  }
  function typingElement() {
    const row = document.createElement('div'); row.className = 'typing';
    const bubble = document.createElement('div'); bubble.className = 'typing-bubble';
    for (let i = 0; i < 3; i++) { const dot = document.createElement('span'); dot.className = 'typing-dot'; bubble.appendChild(dot); }
    row.append(avatarElement(), bubble); return row;
  }
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  function renderAllMessages() {
    messagesContainer.replaceChildren(...session.messages.map(messageElement));
    body.scrollTop = body.scrollHeight;
    rendered = true;
  }
  async function renderChat() {
    if (!isOpen || rendered) return;
    const token = ++renderToken;
    messagesContainer.replaceChildren();
    const animate = !session.displayed;
    if (animate) { session.displayed = true; saveSession(); }
    if (!animate) { renderAllMessages(); return; }
    for (const message of session.messages) {
      if (!isOpen || token !== renderToken) return;
      const typing = typingElement(); messagesContainer.appendChild(typing);
      body.scrollTop = body.scrollHeight;
      await delay(850);
      if (!isOpen || token !== renderToken) return;
      typing.replaceWith(messageElement(message));
      body.scrollTop = body.scrollHeight;
      await delay(250);
    }
    rendered = true;
  }
  function closeChat(returnFocus = false) {
    if (!isOpen) return;
    isOpen = false;
    renderToken++;
    if (session.displayed && !rendered) renderAllMessages();
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    panel.inert = true;
    launcher.setAttribute('aria-expanded', 'false');
    if (returnFocus) launcher.focus();
  }
  function resetSession() {
    const stored = readSession();
    if (stored && validSession(stored) && stored.created > session.created) {
      applySession(stored);
      return;
    }
    const now = Date.now();
    if (now < session.expires) return;
    const previousExpiry = session.expires;
    const elapsedPeriods = Math.floor((now - previousExpiry) / CONFIG.sessionDuration);
    const nextCreated = previousExpiry + elapsedPeriods * CONFIG.sessionDuration;
    const next = createSession(nextCreated, true);
    applySession(next);
    saveSession();
    clearTimeout(badgeTimer);
    showBadge(); 
  }
  function applySession(updated) {
    const changed = updated.created !== session.created || updated.expires !== session.expires;
    if (changed) {
      isOpen = false;
      renderToken++;
      rendered = false;
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      panel.inert = true;
      launcher.setAttribute('aria-expanded', 'false');
      messagesContainer.replaceChildren();
    }
    session = updated;
    memorySession = updated;
    if (session.opened) { hideBadge(); clearTimeout(badgeTimer); }
    else if (changed) showBadge();
    else scheduleBadge();
  }
  function checkSession() {
    if (Date.now() < session.expires) return false;
    resetSession();
    return true;
  }
  function openChat() {
    checkSession();
    isOpen = true;
    session.opened = true;
    saveSession();
    hideBadge(); clearTimeout(badgeTimer);
    panel.inert = false;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    launcher.setAttribute('aria-expanded', 'true');
    renderChat();
  }
  launcher.addEventListener('click', () => isOpen ? closeChat() : openChat(), listenerOptions);
  closeButton.addEventListener('click', () => closeChat(true), listenerOptions);
  document.addEventListener('pointerdown', event => {
    if (!isOpen) return;
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    if (!path.includes(host)) closeChat();
  }, { capture: true, signal: controller.signal });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isOpen) closeChat(true);
  }, listenerOptions);
  window.addEventListener('storage', event => {
    if (event.key !== CONFIG.storageKey || !event.newValue) return;
    try {
      const updated = JSON.parse(event.newValue);
      if (!validSession(updated) || updated.created < session.created) return;
      applySession(updated);
      if (Date.now() >= session.expires) checkSession();
    } catch (_) {}
  }, listenerOptions);
  function refresh() {
    if (checkSession()) return;
    if (!session.opened) scheduleBadge();
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); }, listenerOptions);
  window.addEventListener('focus', refresh, listenerOptions);
  window.addEventListener('pageshow', () => { refresh(); startTimer(); }, listenerOptions);
  function cleanup() {
    clearInterval(sessionTimer);
    clearTimeout(badgeTimer);
    sessionTimer = null;
    renderToken++;
    controller.abort();
  }
  function startTimer() {
    if (sessionTimer !== null) return;
    sessionTimer = setInterval(() => {
      if (!host.isConnected) { cleanup(); return; }
      checkSession();
    }, 1000);
  }
  if (expiredAtLoad) checkSession();
  else scheduleBadge();
  startTimer();
})();
