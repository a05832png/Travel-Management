// ============================================================
// app-upgrade.js — v5 UX Enhancements
// נטען אחרי app.js. לא נוגע באף שורה בקובץ המקורי.
//
// מוסיף:
//   1. Design Tokens + Dark Mode מלא
//   2. Undo/Redo עם Ctrl+Z / Ctrl+Y (עם כפתורים בהדר)
//   3. Command Palette עם Ctrl+F / Ctrl+K
//   4. העתק-הדבק חכם מאקסל (מזהה אוטומטית מטריצה/רשימה)
// ============================================================

(function () {
  'use strict';

  // ============================================================
  // 1. DESIGN SYSTEM — CSS מוזרק דרך JS (לא נוגע ב-HTML)
  // ============================================================
  const DESIGN_CSS = `
    :root {
      --brand-50:  #eef2ff;
      --brand-100: #e0e7ff;
      --brand-500: #6366f1;
      --brand-600: #4f46e5;
      --brand-700: #4338ca;
      --success-50: #ecfdf5;
      --success-500: #10b981;
      --warning-500: #f59e0b;
      --danger-500: #ef4444;
      --surface-1: #ffffff;
      --surface-2: #f8fafc;
      --surface-3: #f1f5f9;
      --text-primary: #0f172a;
      --text-secondary: #475569;
      --text-tertiary: #94a3b8;
      --border-subtle: rgba(148,163,184,.18);
      --border-strong: rgba(148,163,184,.35);
      --shadow-xs: 0 1px 2px rgba(15,23,42,.04);
      --shadow-sm: 0 2px 8px rgba(15,23,42,.06);
      --shadow-md: 0 8px 24px rgba(15,23,42,.08);
      --shadow-lg: 0 16px 48px rgba(15,23,42,.12);
      --shadow-brand: 0 12px 32px -12px rgba(79,70,229,.45);
      --ease-out: cubic-bezier(.16,1,.3,1);
      --ease-spring: cubic-bezier(.34,1.56,.64,1);
    }

    /* ============== DARK MODE ============== */
    html[data-theme="dark"] {
      --surface-1: #0f172a;
      --surface-2: #1e293b;
      --surface-3: #334155;
      --text-primary: #f1f5f9;
      --text-secondary: #cbd5e1;
      --text-tertiary: #94a3b8;
      --border-subtle: rgba(148,163,184,.12);
      --border-strong: rgba(148,163,184,.25);
    }
    html[data-theme="dark"] body {
      background:
        radial-gradient(circle at 85% -10%, rgba(99,102,241,.20), transparent 30%),
        radial-gradient(circle at 0% 35%, rgba(79,70,229,.12), transparent 28%),
        #0f172a !important;
      color: #e2e8f0;
    }
    html[data-theme="dark"] .bg-white,
    html[data-theme="dark"] .bg-white\\/20,
    html[data-theme="dark"] .bg-white\\/10 { background: #1e293b !important; color: #e2e8f0 !important; }
    html[data-theme="dark"] .bg-white\\/15,
    html[data-theme="dark"] .bg-white\\/25 { background: rgba(148,163,184,.15) !important; }
    html[data-theme="dark"] .bg-slate-50,
    html[data-theme="dark"] .bg-slate-50\\/80 { background: #0f172a !important; }
    html[data-theme="dark"] .bg-slate-100 { background: #1e293b !important; }
    html[data-theme="dark"] .bg-slate-200 { background: #334155 !important; }
    html[data-theme="dark"] .text-slate-900,
    html[data-theme="dark"] .text-slate-800,
    html[data-theme="dark"] .text-slate-700 { color: #f1f5f9 !important; }
    html[data-theme="dark"] .text-slate-600,
    html[data-theme="dark"] .text-slate-500 { color: #cbd5e1 !important; }
    html[data-theme="dark"] .text-slate-400 { color: #94a3b8 !important; }
    html[data-theme="dark"] .border-slate-100 { border-color: rgba(148,163,184,.08) !important; }
    html[data-theme="dark"] .border-slate-200,
    html[data-theme="dark"] .border-slate-300 { border-color: rgba(148,163,184,.18) !important; }
    html[data-theme="dark"] input,
    html[data-theme="dark"] select,
    html[data-theme="dark"] textarea {
      background: #0f172a !important;
      color: #e2e8f0 !important;
      border-color: rgba(148,163,184,.22) !important;
    }
    html[data-theme="dark"] input::placeholder,
    html[data-theme="dark"] textarea::placeholder { color: #64748b; }
    html[data-theme="dark"] .bg-blue-50, html[data-theme="dark"] .bg-blue-100 { background: rgba(59,130,246,.15) !important; }
    html[data-theme="dark"] .bg-indigo-50, html[data-theme="dark"] .bg-indigo-50\\/80 { background: rgba(99,102,241,.15) !important; }
    html[data-theme="dark"] .bg-emerald-50, html[data-theme="dark"] .bg-green-100 { background: rgba(16,185,129,.15) !important; }
    html[data-theme="dark"] .bg-amber-50, html[data-theme="dark"] .bg-amber-100 { background: rgba(245,158,11,.15) !important; }
    html[data-theme="dark"] .bg-red-50, html[data-theme="dark"] .bg-red-100 { background: rgba(239,68,68,.15) !important; }
    html[data-theme="dark"] .bg-violet-50 { background: rgba(139,92,246,.15) !important; }
    html[data-theme="dark"] .bg-orange-50, html[data-theme="dark"] .bg-orange-50\\/40, html[data-theme="dark"] .bg-orange-50\\/50 { background: rgba(249,115,22,.12) !important; }
    html[data-theme="dark"] .text-blue-700 { color: #93c5fd !important; }
    html[data-theme="dark"] .text-indigo-600, html[data-theme="dark"] .text-indigo-700,
    html[data-theme="dark"] .text-indigo-800, html[data-theme="dark"] .text-indigo-900 { color: #a5b4fc !important; }
    html[data-theme="dark"] .text-emerald-600, html[data-theme="dark"] .text-emerald-700,
    html[data-theme="dark"] .text-emerald-800 { color: #6ee7b7 !important; }
    html[data-theme="dark"] .text-amber-700, html[data-theme="dark"] .text-amber-800,
    html[data-theme="dark"] .text-amber-900 { color: #fbbf24 !important; }
    html[data-theme="dark"] .text-red-500, html[data-theme="dark"] .text-red-600,
    html[data-theme="dark"] .text-red-700 { color: #fca5a5 !important; }
    html[data-theme="dark"] header {
      background: linear-gradient(270deg, #1e1b4b, #0f172a) !important;
      box-shadow: 0 10px 35px -22px rgba(0,0,0,.9) !important;
    }
    html[data-theme="dark"] nav {
      background: rgba(15,23,42,.88) !important;
      border-color: rgba(148,163,184,.15) !important;
    }
    html[data-theme="dark"] .tab-btn { color: #94a3b8; }
    html[data-theme="dark"] .tab-btn:hover { background: rgba(148,163,184,.1); }
    html[data-theme="dark"] .tab-btn.active {
      background: rgba(99,102,241,.2) !important;
      color: #a5b4fc !important;
      border-color: rgba(99,102,241,.35) !important;
    }
    html[data-theme="dark"] #toast { background: #1e293b; color: #f1f5f9; box-shadow: 0 14px 40px -18px rgba(0,0,0,.9); }
    html[data-theme="dark"] table thead tr,
    html[data-theme="dark"] tr.bg-slate-50 { background: #1e293b !important; }
    html[data-theme="dark"] table tbody tr:hover { background: rgba(99,102,241,.08) !important; }
    html[data-theme="dark"] .desk-cell { color: #e2e8f0; }
    html[data-theme="dark"] .desk-cell:focus { background: rgba(99,102,241,.18) !important; }
    html[data-theme="dark"] .glass {
      background: rgba(15,23,42,.85) !important;
      border-color: rgba(148,163,184,.18) !important;
    }
    html[data-theme="dark"] .login-card { background: rgba(30,41,59,.96) !important; }
    html[data-theme="dark"] .badge-vat { background: rgba(59,130,246,.2) !important; color: #93c5fd !important; }
    html[data-theme="dark"] .badge-no-vat { background: rgba(148,163,184,.15) !important; color: #cbd5e1 !important; }
    html[data-theme="dark"] .app-shell-card,
    html[data-theme="dark"] .bg-white.rounded-2xl,
    html[data-theme="dark"] .bg-white.rounded-\\[28px\\] { background: #1e293b !important; border-color: rgba(148,163,184,.15) !important; }

    /* ============== MICROINTERACTIONS ============== */
    @keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    .tab-content:not(.hidden) { animation: slideUp .28s var(--ease-out); }
    @keyframes cellPulse { 0% { background: rgba(16,185,129,.28); } 100% { background: transparent; } }
    .desk-cell.saved-pulse { animation: cellPulse 1.2s var(--ease-out); }
    button:active:not(:disabled) { transform: translateY(1px) scale(.985); }

    /* ============== HEADER BUTTONS (undo/redo/theme) ============== */
    .header-icon-btn {
      background: rgba(255,255,255,.15);
      color: white;
      border: none;
      padding: .4rem .7rem;
      border-radius: .5rem;
      font-size: 14px;
      cursor: pointer;
      transition: all .18s var(--ease-out);
      line-height: 1;
      min-width: 34px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .header-icon-btn:hover:not(:disabled) {
      background: rgba(255,255,255,.28);
      transform: translateY(-1px);
    }
    .header-icon-btn:disabled { opacity: .32; cursor: not-allowed; }
    #themeToggle:hover { transform: rotate(18deg) scale(1.12); }

    /* ============== COMMAND PALETTE ============== */
    @keyframes cmdIn {
      from { opacity: 0; transform: translateY(-14px) scale(.97); }
      to { opacity: 1; transform: none; }
    }
    #cmdPalette > div { animation: cmdIn .2s var(--ease-out); }

    /* ============== MODAL ENTER ============== */
    @keyframes modalIn {
      from { opacity: 0; transform: scale(.94); }
      to { opacity: 1; transform: none; }
    }
    .modal-enter { animation: modalIn .2s var(--ease-spring); }

    /* ============== FOCUS STATES ============== */
    button:focus-visible,
    input:focus-visible,
    select:focus-visible,
    textarea:focus-visible,
    [tabindex]:focus-visible {
      outline: 2px solid var(--brand-500);
      outline-offset: 2px;
    }
  `;

  function injectDesignSystem() {
    if (document.getElementById('trip-design-system')) return;
    const style = document.createElement('style');
    style.id = 'trip-design-system';
    style.textContent = DESIGN_CSS;
    document.head.appendChild(style);
  }

  // ============================================================
  // 2. DARK MODE TOGGLE
  // ============================================================
  function initTheme() {
    const saved = localStorage.getItem('tripTheme') || 'light';
    document.documentElement.dataset.theme = saved;
    updateThemeButton();
  }

  function toggleTheme() {
    const cur = document.documentElement.dataset.theme || 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('tripTheme', next); } catch (_) {}
    updateThemeButton();
    if (typeof toast === 'function') {
      toast(next === 'dark' ? '🌙 מצב לילה פעיל' : '☀️ מצב יום פעיל');
    }
  }

  function updateThemeButton() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const isDark = document.documentElement.dataset.theme === 'dark';
    btn.textContent = isDark ? '☀️' : '🌙';
    btn.title = isDark ? 'עבור למצב יום' : 'עבור למצב לילה';
  }

  // ============================================================
  // 3. UNDO / REDO
  // ============================================================
  const _history = { stack: [], index: -1, max: 40 };
  let _snapshotTimer = null;
  let _isApplyingHistory = false;

  function snapshotState() {
    try {
      if (typeof getPersistedState === 'function') return JSON.stringify(getPersistedState());
      if (typeof state === 'object') return JSON.stringify(state);
      return null;
    } catch (_) { return null; }
  }

  function _pushSnapshot(label) {
    if (_isApplyingHistory) return;
    const snap = snapshotState();
    if (!snap) return;
    if (_history.index >= 0 && _history.stack[_history.index] && _history.stack[_history.index].snapshot === snap) return;
    _history.stack = _history.stack.slice(0, _history.index + 1);
    _history.stack.push({ label: label || 'פעולה', snapshot: snap, time: Date.now() });
    _history.index++;
    if (_history.stack.length > _history.max) { _history.stack.shift(); _history.index--; }
    updateUndoButtons();
  }

  function _scheduleSnapshot(label) {
    clearTimeout(_snapshotTimer);
    _snapshotTimer = setTimeout(() => _pushSnapshot(label), 380);
  }

  // API ציבורי לשימוש חיצוני (למשל מה-HTML או מפונקציות עתידיות)
  function pushHistory(label) {
    _pushSnapshot(label);
  }

  function _applySnapshot(snap) {
    _isApplyingHistory = true;
    try {
      const parsed = JSON.parse(snap);
      if (typeof applyCloudState === 'function') applyCloudState(parsed);
      else if (typeof state === 'object') Object.assign(state, parsed);
      if (window.CloudSync && typeof window.CloudSync.scheduleSave === 'function' &&
          typeof getPersistedState === 'function') {
        window.CloudSync.scheduleSave(getPersistedState());
      }
      if (typeof initUI === 'function') initUI();
    } finally {
      setTimeout(() => { _isApplyingHistory = false; }, 200);
    }
  }

  function undo() {
    if (_history.index <= 0) {
      if (typeof toast === 'function') toast('אין פעולה לביטול');
      return;
    }
    const fromLabel = _history.stack[_history.index].label || 'פעולה';
    _history.index--;
    const prev = _history.stack[_history.index];
    _applySnapshot(prev.snapshot);
    updateUndoButtons();
    if (typeof toast === 'function') toast('↶ בוטל: ' + fromLabel);
  }

  function redo() {
    if (_history.index >= _history.stack.length - 1) {
      if (typeof toast === 'function') toast('אין פעולה לחזרה');
      return;
    }
    _history.index++;
    const next = _history.stack[_history.index];
    _applySnapshot(next.snapshot);
    updateUndoButtons();
    if (typeof toast === 'function') toast('↷ בוצע מחדש: ' + (next.label || 'פעולה'));
  }

  function updateUndoButtons() {
    const u = document.getElementById('undoBtn');
    const r = document.getElementById('redoBtn');
    if (u) u.disabled = _history.index <= 0;
    if (r) r.disabled = _history.index >= _history.stack.length - 1;
  }

  // ============================================================
  // 4. COMMAND PALETTE (Ctrl+F / Ctrl+K)
  // ============================================================
  let _cmdOpen = false;
  let _cmdSelectedIdx = 0;
  let _cmdFiltered = [];

  function openCommandPalette() {
    if (_cmdOpen) return;
    if (document.getElementById('cmdPalette')) return;
    _cmdOpen = true;

    const html = `
      <div id="cmdPalette" class="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4"
           style="padding-top: 12vh; -webkit-backdrop-filter: blur(8px);">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
             style="box-shadow: 0 25px 60px -12px rgba(0,0,0,.4);">
          <div class="flex items-center gap-3 px-5 py-4 border-b border-slate-200">
            <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input id="cmdInput" type="text" placeholder="חפש פעולה, לקוח, נסיעה…"
              class="flex-1 outline-none text-lg bg-transparent border-0 text-slate-800"
              autocomplete="off" spellcheck="false" autofocus />
            <kbd class="text-xs px-2 py-1 bg-slate-100 rounded text-slate-500 font-mono shrink-0">ESC</kbd>
          </div>
          <div id="cmdResults" class="max-h-[60vh] overflow-y-auto p-2"></div>
          <div class="px-5 py-2 border-t border-slate-100 text-xs text-slate-400 flex justify-between flex-wrap gap-2">
            <span>↑↓ לניווט · Enter לבחירה · ESC לסגירה</span>
            <span class="font-mono">Ctrl+F</span>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    const input = document.getElementById('cmdInput');
    if (!input) return;
    input.focus();
    input.addEventListener('input', e => renderCmdResults(e.target.value));
    input.addEventListener('keydown', handleCmdKey);

    const palette = document.getElementById('cmdPalette');
    palette.addEventListener('click', e => { if (e.target.id === 'cmdPalette') closeCommandPalette(); });

    renderCmdResults('');
  }

  function handleCmdKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); closeCommandPalette(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      _cmdSelectedIdx = Math.min(_cmdSelectedIdx + 1, _cmdFiltered.length - 1);
      highlightCmdResult();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      _cmdSelectedIdx = Math.max(_cmdSelectedIdx - 1, 0);
      highlightCmdResult();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const item = _cmdFiltered[_cmdSelectedIdx];
      if (item && typeof item.run === 'function') {
        closeCommandPalette();
        setTimeout(item.run, 60);
      }
    }
  }

  function highlightCmdResult() {
    document.querySelectorAll('[data-cmd-idx]').forEach(el => {
      const idx = parseInt(el.dataset.cmdIdx, 10);
      el.classList.toggle('bg-indigo-50', idx === _cmdSelectedIdx);
      el.classList.toggle('bg-slate-50', idx !== _cmdSelectedIdx);
    });
    const el = document.querySelector(`[data-cmd-idx="${_cmdSelectedIdx}"]`);
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
  }

  function _buildResults() {
    const results = [];

    // --- פעולות מערכת ---
    results.push({ icon: '⚡', title: 'הזנה מהירה', sub: 'נסיעה חדשה', run: () => { if (typeof showTab === 'function') showTab('quick'); setTimeout(() => document.getElementById('formCustomer')?.focus(), 80); } });
    results.push({ icon: '🗂️', title: 'עמדת מזכירה', sub: 'טבלה בסגנון אקסל', run: () => { if (typeof showTab === 'function') showTab('desk'); } });
    results.push({ icon: '📋', title: 'כל הנסיעות', sub: 'רשימה מלאה + סינון', run: () => { if (typeof showTab === 'function') showTab('trips'); } });
    results.push({ icon: '📊', title: 'דשבורד', sub: 'תמונת מצב חודשית', run: () => { if (typeof showTab === 'function') showTab('dashboard'); } });
    results.push({ icon: '📈', title: 'דוחות', sub: 'חריגות וניתוחים', run: () => { if (typeof showTab === 'function') showTab('reports'); } });
    results.push({ icon: '👥', title: 'ניהול לקוחות', sub: 'עריכה, מחירונים, קווים', run: () => { if (typeof showTab === 'function') showTab('customers'); } });
    results.push({ icon: '📥', title: 'ייצוא לאקסל', sub: 'הורדת דוחות חודשיים', run: () => { if (typeof showTab === 'function') showTab('export'); } });
    results.push({ icon: '📨', title: 'ייבוא', sub: 'Excel / WhatsApp', run: () => { if (typeof showTab === 'function') showTab('import'); } });
    results.push({ icon: '👤', title: 'ניהול מזמינים', sub: 'רשימת מזמינים מועדפים', run: () => { if (typeof showTab === 'function') showTab('drivers'); } });
    results.push({ icon: '🤖', title: 'סוכן AI', sub: 'שיחה חופשית בעברית', run: () => { if (typeof showTab === 'function') showTab('ai'); } });
    results.push({ icon: '⚙️', title: 'הגדרות', sub: 'מע״מ, גיבוי, מפתחות', run: () => { if (typeof showTab === 'function') showTab('settings'); } });

    // --- כלים חדשים ---
    results.push({ icon: '📋', title: 'הדבקה מאקסל', sub: 'פתח חלון ייבוא טווח חכם', run: () => openExcelPasteModal() });
    results.push({ icon: '🌓', title: 'החלף ערכת נושא', sub: 'מצב יום / לילה', run: () => toggleTheme() });
    if (_history.index > 0) {
      results.push({ icon: '↶', title: 'בטל פעולה אחרונה', sub: _history.stack[_history.index]?.label || '', run: () => undo() });
    }
    if (_history.index < _history.stack.length - 1) {
      results.push({ icon: '↷', title: 'בצע מחדש', sub: 'Redo', run: () => redo() });
    }

    // --- לקוחות ---
    if (typeof state === 'object' && Array.isArray(state.customers)) {
      state.customers.forEach(c => {
        if (!c) return;
        results.push({
          icon: '👤',
          title: 'פתח לקוח: ' + c.name,
          sub: 'עריכת הגדרות, מחירון ומזמינים',
          run: () => { if (typeof editCustomer === 'function') editCustomer(c.id); }
        });
        if (c.lines && c.lines.length) {
          results.push({
            icon: '📊',
            title: 'תצוגת קווים: ' + c.name,
            sub: c.lines.join(' · '),
            run: () => { if (typeof openMatrix === 'function') openMatrix(c.id); }
          });
        }
      });
    }

    // --- נסיעות אחרונות ---
    if (typeof state === 'object' && Array.isArray(state.trips)) {
      state.trips.slice(0, 40).forEach(t => {
        if (!t) return;
        const c = (typeof getCustomer === 'function') ? getCustomer(t.customerId) : { name: t.customerId };
        const dt = (typeof formatDate === 'function') ? formatDate(t.date) : (t.date || '');
        const pr = (typeof formatMoney === 'function') ? formatMoney(t.price) : ((t.price || 0) + ' ₪');
        results.push({
          icon: '📝',
          title: dt + ' · ' + c.name,
          sub: (t.route || t.columnKey || '—') + ' · ' + pr,
          run: () => { if (typeof editTrip === 'function') editTrip(t.id); }
        });
      });
    }

    return results;
  }

  function renderCmdResults(query) {
    const q = String(query || '').trim().toLowerCase();
    const all = _buildResults();

    if (!q) {
      _cmdFiltered = all.slice(0, 14);
    } else {
      // דירוג: התאמה בתחילת הכותרת > התאמה בכותרת > התאמה בתת-כותרת
      const scored = all.map(r => {
        const title = (r.title || '').toLowerCase();
        const sub = (r.sub || '').toLowerCase();
        let score = 0;
        if (title.startsWith(q)) score = 100;
        else if (title.includes(q)) score = 60;
        else if (sub.includes(q)) score = 30;
        else if ((title + ' ' + sub).includes(q)) score = 15;
        return { r, score };
      }).filter(x => x.score > 0);
      scored.sort((a, b) => b.score - a.score);
      _cmdFiltered = scored.slice(0, 40).map(x => x.r);
    }

    _cmdSelectedIdx = 0;

    const container = document.getElementById('cmdResults');
    if (!container) return;

    if (!_cmdFiltered.length) {
      container.innerHTML = '<div class="text-center py-10 text-slate-400 text-sm">לא נמצאו תוצאות עבור "' + q.replace(/</g,'&lt;') + '"</div>';
      return;
    }

    container.innerHTML = _cmdFiltered.map((r, i) => `
      <button data-cmd-idx="${i}" onclick="window.__cmdRun(${i})"
        class="w-full text-right px-4 py-2.5 rounded-lg transition flex items-center gap-3 ${i === 0 ? 'bg-indigo-50' : 'bg-slate-50'} hover:bg-indigo-100">
        <span class="text-xl shrink-0" aria-hidden="true">${r.icon || '•'}</span>
        <span class="flex-1 min-w-0">
          <div class="font-medium text-sm text-slate-800 truncate">${_esc(r.title)}</div>
          ${r.sub ? '<div class="text-xs text-slate-500 truncate">' + _esc(r.sub) + '</div>' : ''}
        </span>
      </button>
    `).join('');
  }

  function _esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  function closeCommandPalette() {
    _cmdOpen = false;
    document.getElementById('cmdPalette')?.remove();
  }

  window.__cmdRun = function (idx) {
    const r = _cmdFiltered[idx];
    if (r && typeof r.run === 'function') {
      closeCommandPalette();
      setTimeout(r.run, 60);
    }
  };

  // ============================================================
  // 5. EXCEL PASTE MODAL — העתק-הדבק חכם
  // ============================================================
  let _excelPasteParsed = null;

  function openExcelPasteModal(prefillText) {
    if (document.getElementById('excelPasteModal')) return;

    const month = (typeof state === 'object' && state.workingMonth) || '';
    const custOptions = (typeof state === 'object' && Array.isArray(state.customers))
      ? state.customers.slice().sort((a, b) => a.name.localeCompare(b.name, 'he'))
          .map(c => `<option value="${_esc(c.id)}">${_esc(c.name)}</option>`).join('')
      : '';

    const html = `
      <div id="excelPasteModal" class="fixed inset-0 z-[290] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
           style="-webkit-backdrop-filter: blur(8px);">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col modal-enter">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">📋 הדבקה מאקסל</h3>
              <p class="text-xs text-slate-500 mt-0.5">העתק טווח מאקסל (Ctrl+C) והדבק כאן — המערכת תזהה אוטומטית</p>
            </div>
            <button onclick="window.__excelPasteClose()" class="text-3xl text-slate-400 hover:text-slate-700 leading-none">&times;</button>
          </div>

          <div class="p-5 overflow-y-auto flex-1">
            <div class="grid sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">לקוח *</label>
                <select id="excelPasteCustomer" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white">
                  <option value="">— בחר לקוח —</option>
                  ${custOptions}
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">חודש</label>
                <input type="month" id="excelPasteMonth" value="${month}" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm" />
              </div>
            </div>

            <div class="mb-3">
              <label class="block text-xs font-medium text-slate-600 mb-1">הדבק כאן (Ctrl+V)</label>
              <textarea id="excelPasteArea" rows="10"
                placeholder="פורמט נתמך אוטומטית:
• מטריצה: שורה=יום, עמודות=קווי שעה (כמו קובץ פרח)
• רשימה: תאריך | תיאור | מחיר | מזמין
• תאריכים עבריים מזוהים: 'יום ראשון, 2 באוגוסט 2026'"
                class="w-full border border-slate-300 rounded-xl p-3 text-xs font-mono resize-y focus:border-indigo-500 bg-white text-slate-800"></textarea>
            </div>

            <div id="excelPastePreview" class="hidden">
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-sm font-semibold text-slate-700">תצוגה מקדימה</h4>
                <span id="excelPasteStats" class="text-xs text-slate-500"></span>
              </div>
              <div id="excelPastePreviewTable" class="overflow-x-auto border border-slate-200 rounded-xl max-h-72 overflow-y-auto text-xs"></div>
            </div>
          </div>

          <div class="px-5 py-3 border-t border-slate-200 flex gap-2 justify-end flex-wrap">
            <button onclick="window.__excelPasteClose()" class="border border-slate-300 px-4 py-2 rounded-xl text-sm hover:bg-slate-50">ביטול</button>
            <button onclick="window.__excelPasteParse()" class="bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl text-sm">🔍 נתח מחדש</button>
            <button onclick="window.__excelPasteApply()" id="excelPasteApplyBtn" disabled
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">✅ ייבא</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    const ta = document.getElementById('excelPasteArea');
    if (ta) {
      ta.focus();
      ta.addEventListener('paste', () => setTimeout(() => window.__excelPasteParse(), 60));
      if (prefillText) {
        ta.value = prefillText;
        setTimeout(() => window.__excelPasteParse(), 100);
      }
    }
  }

  window.__excelPasteClose = function () {
    document.getElementById('excelPasteModal')?.remove();
    _excelPasteParsed = null;
  };

  function parseExcelDateHe(s) {
    if (!s) return null;
    const t = String(s).trim();
    if (!t) return null;

    // ISO
    let m = t.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;

    // DD/MM/YYYY
    m = t.match(/(\d{1,2})[\/\.](\d{1,2})[\/\.](\d{2,4})/);
    if (m) {
      const y = m[3].length === 2 ? '20' + m[3] : m[3];
      return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
    }

    // עברית: "2 באוגוסט 2026"
    const heMonths = {
      'ינואר':1,'פברואר':2,'מרץ':3,'מרס':3,'אפריל':4,'מאי':5,'יוני':6,
      'יולי':7,'אוגוסט':8,'ספטמבר':9,'אוקטובר':10,'נובמבר':11,'דצמבר':12
    };
    m = t.match(/(\d{1,2})\s+ב?([א-ת]+)\s+(\d{4})/);
    if (m && heMonths[m[2]]) {
      return `${m[3]}-${String(heMonths[m[2]]).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
    }

    // "יום ראשון, 2 באוגוסט 2026" — זהה לטיפול הקודם אחרי שנמצאה הספרה
    // "יום ראשון 2" בלי חודש → מחזיר __DAY__N
    m = t.match(/יום\s+\S+,?\s+(\d{1,2})\b/);
    if (m) return '__DAY__' + m[1];

    return null;
  }

  window.__excelPasteParse = function () {
    const text = (document.getElementById('excelPasteArea')?.value) || '';
    if (!text.trim()) {
      if (typeof toast === 'function') toast('הדבק נתונים קודם');
      return;
    }
    const month = document.getElementById('excelPasteMonth')?.value;
    if (!month) {
      if (typeof toast === 'function') toast('בחר חודש');
      return;
    }

    const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim());
    if (!lines.length) return;

    const rows = lines.map(l => l.split('\t'));
    const firstRow = rows[0] || [];
    const headerPattern = /קו\s*\d|^\d{1,2}:\d{2}|פתיחה|הלוך|חזור|תאריך|מחיר|תיאור|יעד|מוצא|הערות|מזמין/i;
    const isHeader = firstRow.length > 1 && firstRow.slice(1).some(c => headerPattern.test(String(c)));

    const parsed = { mode: isHeader ? 'matrix' : 'list', trips: [], columns: [], headerOffset: 0 };
    if (isHeader) {
      parsed.columns = firstRow.slice(1).map(c => String(c || '').trim());
      parsed.headerOffset = 1;
    }

    const [y, mo] = month.split('-').map(Number);
    const daysInMonth = new Date(y, mo, 0).getDate();

    for (let r = parsed.headerOffset; r < rows.length; r++) {
      const row = rows[r];
      if (!row || !row.length) continue;
      const dateCell = String(row[0] || '').trim();
      if (!dateCell) continue;
      if (/מע["'׳]?מ|סה["'׳]?כ|total|vat|^שירות/i.test(dateCell)) continue;

      let dateIso = null;
      const pd = parseExcelDateHe(dateCell);
      if (pd && pd.startsWith('__DAY__')) {
        const day = parseInt(pd.replace('__DAY__', ''), 10);
        if (day >= 1 && day <= daysInMonth) {
          dateIso = `${month}-${String(day).padStart(2, '0')}`;
        }
      } else if (pd) {
        dateIso = pd;
      }
      if (!dateIso) continue;

      if (parsed.mode === 'matrix') {
        for (let c = 1; c < row.length; c++) {
          const colName = parsed.columns[c - 1] || ('עמודה ' + c);
          if (/הערות|מזמין|notes/i.test(colName)) continue;
          const v = String(row[c] || '').replace(/[^\d.\-]/g, '');
          const price = parseFloat(v);
          if (!price || isNaN(price) || price <= 0) continue;
          parsed.trips.push({ date: dateIso, price, column: colName });
        }
      } else {
        const cells = row.slice(1).map(c => String(c || '').trim());
        let price = 0, route = '', orderer = '', notes = '';
        for (let i = 0; i < cells.length; i++) {
          const cv = cells[i];
          if (!cv) continue;
          const numOnly = cv.replace(/[^\d.]/g, '');
          const num = parseFloat(numOnly);
          if (!price && !isNaN(num) && num > 20 && num < 100000 && /^[\d\s.,\-]+$/.test(cv)) {
            price = num;
            continue;
          }
          if (!route) { route = cv; continue; }
          if (!orderer && (/^[\d\-\s]{9,}$/.test(cv) || /^[א-ת\s'"׳]{2,30}$/.test(cv))) {
            orderer = cv;
            continue;
          }
          notes = notes ? (notes + ' ' + cv) : cv;
        }
        if (price > 0 || route) parsed.trips.push({ date: dateIso, price, route, orderer, notes });
      }
    }

    _excelPasteParsed = parsed;

    const box = document.getElementById('excelPastePreview');
    const table = document.getElementById('excelPastePreviewTable');
    const stats = document.getElementById('excelPasteStats');
    const applyBtn = document.getElementById('excelPasteApplyBtn');
    if (!box || !table || !stats || !applyBtn) return;

    box.classList.remove('hidden');

    if (!parsed.trips.length) {
      table.innerHTML = '<div class="text-center py-6 text-slate-400">לא זוהו נסיעות. בדוק שהפורמט תקין ובחר חודש מתאים</div>';
      stats.textContent = '0 נסיעות';
      applyBtn.disabled = true;
      return;
    }

    stats.textContent = parsed.trips.length + ' נסיעות · מצב: ' + (parsed.mode === 'matrix' ? 'מטריצה' : 'רשימה');
    applyBtn.disabled = false;

    const total = parsed.trips.reduce((s, t) => s + (t.price || 0), 0);
    const sample = parsed.trips.slice(0, 80);

    table.innerHTML = `
      <table class="min-w-full">
        <thead class="bg-slate-50 sticky top-0 z-10">
          <tr>
            <th class="px-2 py-1.5 text-right font-medium text-slate-600">תאריך</th>
            <th class="px-2 py-1.5 text-right font-medium text-slate-600">פירוט</th>
            <th class="px-2 py-1.5 text-center font-medium text-slate-600">מחיר</th>
          </tr>
        </thead>
        <tbody>
          ${sample.map(t => `
            <tr class="border-t border-slate-100">
              <td class="px-2 py-1 font-mono text-[11px]">${t.date}</td>
              <td class="px-2 py-1">${_esc(t.column || t.route || '—')}</td>
              <td class="px-2 py-1 text-center font-medium text-emerald-700">${t.price || ''}</td>
            </tr>
          `).join('')}
          ${parsed.trips.length > 80 ? `<tr><td colspan="3" class="px-2 py-2 text-center text-slate-400">ועוד ${parsed.trips.length - 80}…</td></tr>` : ''}
        </tbody>
        <tfoot class="bg-slate-50 font-semibold sticky bottom-0">
          <tr>
            <td colspan="2" class="px-2 py-1.5 text-right">סה״כ</td>
            <td class="px-2 py-1.5 text-center">${total.toLocaleString('he-IL')} ₪</td>
          </tr>
        </tfoot>
      </table>
    `;
  };

  window.__excelPasteApply = function () {
    if (!_excelPasteParsed || !_excelPasteParsed.trips.length) return;
    const cid = document.getElementById('excelPasteCustomer')?.value;
    if (!cid) { if (typeof toast === 'function') toast('בחר לקוח'); return; }
    if (typeof state !== 'object' || !Array.isArray(state.trips)) return;

    pushHistory('ייבוא מאקסל');

    const c = (typeof getCustomer === 'function') ? getCustomer(cid) : { name: cid };
    const uidFn = (typeof uid === 'function') ? uid : (() => 't_' + Date.now() + Math.random().toString(36).slice(2, 7));
    let added = 0;

    _excelPasteParsed.trips.forEach(t => {
      state.trips.unshift({
        id: uidFn(),
        customerId: cid,
        line: '',
        columnKey: t.column || '',
        date: t.date,
        price: t.price || 0,
        route: t.column ? (c.name + ' · ' + t.column) : (t.route || ''),
        origin: c.name,
        destination: t.column || t.route || '',
        notes: t.notes || '',
        driver: t.orderer || '',
        source: 'excel-paste',
        createdAt: new Date().toISOString()
      });
      added++;
    });

    if (typeof saveState === 'function') saveState();
    if (typeof renderTrips === 'function') renderTrips();
    if (typeof renderRecent === 'function') renderRecent();
    if (typeof renderCustomers === 'function') renderCustomers();
    if (typeof toast === 'function') toast('✅ יובאו ' + added + ' נסיעות בהצלחה', 3500);
    window.__excelPasteClose();
  };

  // ============================================================
  // 6. הזרקת כפתורים להדר (undo / redo / theme)
  // ============================================================
  function injectHeaderButtons() {
    const headerBar = document.querySelector('header .flex.items-center.gap-2.text-sm');
    if (!headerBar || headerBar.dataset.upgraded === '1') return;
    headerBar.dataset.upgraded = '1';

    const settingsBtn = headerBar.querySelector('button[onclick*="settings"]');
    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-center gap-1';
    wrapper.innerHTML = `
      <button id="undoBtn" class="header-icon-btn" onclick="undo()" title="ביטול פעולה (Ctrl+Z)" disabled aria-label="ביטול">↶</button>
      <button id="redoBtn" class="header-icon-btn" onclick="redo()" title="חזרה (Ctrl+Y)" disabled aria-label="חזרה">↷</button>
      <button id="themeToggle" class="header-icon-btn" onclick="toggleTheme()" title="מצב לילה / יום" aria-label="ערכת נושא">🌙</button>
    `;
    if (settingsBtn && settingsBtn.parentNode === headerBar) headerBar.insertBefore(wrapper, settingsBtn);
    else headerBar.appendChild(wrapper);

    updateUndoButtons();
    updateThemeButton();
  }

  // ============================================================
  // 7. קיצורי מקלדת גלובליים
  // ============================================================
  function _isEditable(el) {
    if (!el) return false;
    const tag = (el.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable === true;
  }

  document.addEventListener('keydown', function (e) {
    const mod = e.ctrlKey || e.metaKey;

    // Ctrl+F או Ctrl+K → Command Palette
    if (mod && !e.shiftKey && !e.altKey && (e.key === 'f' || e.key === 'k')) {
      // אם כבר פתוח — סגור
      if (document.getElementById('cmdPalette')) {
        e.preventDefault();
        closeCommandPalette();
        return;
      }
      e.preventDefault();
      openCommandPalette();
      return;
    }

    // ESC → סגור מה שפתוח
    if (e.key === 'Escape') {
      if (document.getElementById('cmdPalette')) { closeCommandPalette(); return; }
      if (document.getElementById('excelPasteModal')) { window.__excelPasteClose(); return; }
    }

    // Ctrl+Z → Undo (רק אם לא בתוך שדה קלט)
    if (mod && !e.shiftKey && e.key.toLowerCase() === 'z' && !_isEditable(document.activeElement)) {
      e.preventDefault();
      undo();
      return;
    }

    // Ctrl+Y או Ctrl+Shift+Z → Redo
    if (mod && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
      if (_isEditable(document.activeElement)) return;
      e.preventDefault();
      redo();
      return;
    }
  }, true);

  // ============================================================
  // 8. האזנה גלובלית ל-paste — פותח את החלון החכם אוטומטית
  // ============================================================
  document.addEventListener('paste', function (e) {
    // דלג אם כבר פתוח חלון / פקודה
    if (document.getElementById('excelPasteModal')) return;
    if (document.getElementById('cmdPalette')) return;

    const active = document.activeElement;
    // אם המשתמש מדביק בתוך תא בטבלה — תן ל-onDeskPaste המקורי לטפל
    if (active && active.classList && active.classList.contains('desk-cell')) return;
    // אם בתוך שדה קלט/טקסט — תן לדפדפן לטפל
    if (_isEditable(active)) return;

    const text = (e.clipboardData || window.clipboardData)?.getData('text') || '';
    if (!text) return;

    const hasTab = text.indexOf('\t') !== -1;
    const multiLine = text.split('\n').length >= 2;

    if ((hasTab && multiLine) || (multiLine && /מע["'׳]?מ|סה["'׳]?כ|יום\s+ראשון|יום\s+שני/i.test(text))) {
      e.preventDefault();
      openExcelPasteModal(text);
    }
  }, true);

  // ============================================================
  // 9. INIT — טעינה + האזנה לסטייט
  // ============================================================
  function initUpgrade() {
    injectDesignSystem();
    initTheme();

    // המתן שה-app יסיים boot ויהיה state זמין
    let attempts = 0;
    const tryInject = () => {
      attempts++;
      const stateReady = typeof state === 'object' && Array.isArray(state.customers) && state.customers.length > 0;
      if (stateReady) {
        injectHeaderButtons();
        // Snapshot ראשוני
        if (_history.index < 0) {
          const snap = snapshotState();
          if (snap) {
            _history.stack = [{ label: 'מצב התחלתי', snapshot: snap, time: Date.now() }];
            _history.index = 0;
            updateUndoButtons();
          }
        }
      } else if (attempts < 60) {
        setTimeout(tryInject, 250);
      }
    };
    tryInject();

    // MutationObserver — אם ההדר נבנה מחדש, החזר את הכפתורים
    const header = document.querySelector('header');
    if (header && window.MutationObserver) {
      const mo = new MutationObserver(() => {
        const bar = document.querySelector('header .flex.items-center.gap-2.text-sm');
        if (bar && bar.dataset.upgraded !== '1') injectHeaderButtons();
      });
      mo.observe(header, { childList: true, subtree: true });
    }

    // הוסף "הדבקה מאקסל" לרשימת הכפתורים בעמדת מזכירה
    setTimeout(() => {
      const deskBtns = document.querySelector('#tab-desk .flex.flex-wrap.gap-1\\.5');
      if (deskBtns && !deskBtns.dataset.pasteAdded) {
        deskBtns.dataset.pasteAdded = '1';
        const b = document.createElement('button');
        b.type = 'button';
        b.onclick = () => openExcelPasteModal();
        b.className = 'text-xs bg-purple-50 text-purple-800 hover:bg-purple-100 px-3 py-2 rounded-xl font-medium';
        b.textContent = '📋 הדבקה מאקסל';
        deskBtns.appendChild(b);
      }
    }, 800);

    // כפתור בהזנה מהירה — מתחת לאזור ההדבקה
    setTimeout(() => {
      const pasteArea = document.getElementById('pasteArea');
      if (pasteArea && !document.getElementById('quickExcelBtn')) {
        const wrap = pasteArea.parentNode;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'quickExcelBtn';
        btn.onclick = () => openExcelPasteModal();
        btn.className = 'mt-2 w-full bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-sm py-2 rounded-xl transition';
        btn.textContent = '📋 הדבק טווח מאקסל';
        pasteArea.insertAdjacentElement('afterend', btn);
      }
    }, 900);
  }

  // ============================================================
  // 10. עטיפת saveState כדי ליצור snapshots אוטומטיות
  // ============================================================
  function _wrapSaveState() {
    if (typeof window.saveState === 'function' && !window.saveState.__upgraded) {
      const orig = window.saveState;
      const wrapped = function () {
        const r = orig.apply(this, arguments);
        _scheduleSnapshot();
        return r;
      };
      wrapped.__upgraded = true;
      try { window.saveState = wrapped; } catch (_) {}
    }
  }

  // ============================================================
  // 11. EXPORTS לשימוש חיצוני
  // ============================================================
  window.toggleTheme = toggleTheme;
  window.undo = undo;
  window.redo = redo;
  window.pushHistory = pushHistory;
  window.openCommandPalette = openCommandPalette;
  window.closeCommandPalette = closeCommandPalette;
  window.openExcelPasteModal = openExcelPasteModal;

  // ============================================================
  // 12. BOOT
  // ============================================================
  function boot() {
    initUpgrade();
    // עטיפת saveState אחרי ש-app.js כבר הגדיר אותה
    setTimeout(_wrapSaveState, 0);
    setTimeout(_wrapSaveState, 500);
    setTimeout(_wrapSaveState, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // גיבוי: גם אם DOM נטען לפני שהסקריפט רץ
  window.addEventListener('load', () => {
    setTimeout(_wrapSaveState, 100);
    setTimeout(injectHeaderButtons, 700);
  });

})();
