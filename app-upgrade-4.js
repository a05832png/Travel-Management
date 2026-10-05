// ============================================================
// app-upgrade-4.js — Premium Design + Import Fixes
// ============================================================
// מכיל:
//   1. פלטת צבעים טורקיז + Dark mode מושלם
//   2. סרגל צד צף עם מוני לקוחות
//   3. גרפי עמודות מונפשים בדשבורד
//   4. Empty states חכמים ("בואו נתחיל" במקום "הכל מלא")
//   5. סינון שורות מע"מ/סה"כ/שירות בייבוא אקסל ⚡
// ============================================================

(function () {
  'use strict';

  // ============================================================
  // HELPERS
  // ============================================================
  function escHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }
  function escAttr(s) { return String(s || '').replace(/'/g, "\\'").replace(/"/g, '&quot;'); }
  function toastMsg(msg, ms) { if (typeof toast === 'function') toast(msg, ms || 3000); }

  // ============================================================
  // 1. PREMIUM CSS
  // ============================================================
  const PREMIUM_CSS = `
    :root {
      --c-primary-50:  #f0fdfa;
      --c-primary-100: #ccfbf1;
      --c-primary-200: #99f6e4;
      --c-primary-300: #5eead4;
      --c-primary-400: #2dd4bf;
      --c-primary-500: #14b8a6;
      --c-primary-600: #0d9488;
      --c-primary-700: #0f766e;
      --c-primary-800: #115e59;
      --c-primary-900: #134e4a;
      --c-primary-950: #042f2e;
      --c-accent-400: #fbbf24;
      --c-accent-500: #f59e0b;
      --c-ink-50:  #f8fafc;
      --c-ink-100: #f1f5f9;
      --c-ink-200: #e2e8f0;
      --c-ink-300: #cbd5e1;
      --c-ink-400: #94a3b8;
      --c-ink-500: #64748b;
      --c-ink-600: #475569;
      --c-ink-700: #334155;
      --c-ink-800: #1e293b;
      --c-ink-900: #0f172a;
      --surface-1: #ffffff;
      --surface-2: #f8fafc;
      --surface-3: #f1f5f9;
      --surface-glass: rgba(255, 255, 255, 0.72);
      --border-subtle: rgba(148, 163, 184, 0.14);
      --border-default: rgba(148, 163, 184, 0.24);
      --border-strong: rgba(148, 163, 184, 0.42);
      --shadow-xs:  0 1px 3px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.03);
      --shadow-sm:  0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -1px rgba(15, 23, 42, 0.03);
      --shadow-md:  0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.03);
      --shadow-lg:  0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04);
      --shadow-xl:  0 25px 50px -12px rgba(15, 23, 42, 0.15);
      --shadow-brand: 0 12px 32px -10px rgba(13, 148, 136, 0.35);
      --r-xs: 6px; --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-xl: 20px; --r-2xl: 24px; --r-3xl: 32px; --r-full: 9999px;
      --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
      --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    html[data-theme="dark"] {
      --surface-1: #0f172a;
      --surface-2: #1e293b;
      --surface-3: #334155;
      --surface-glass: rgba(15, 23, 42, 0.72);
      --border-subtle: rgba(148, 163, 184, 0.1);
      --border-default: rgba(148, 163, 184, 0.18);
      --border-strong: rgba(148, 163, 184, 0.32);
      --shadow-brand: 0 12px 32px -10px rgba(20, 184, 166, 0.4);
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }

    body {
      font-family: 'Heebo', 'Rubik', system-ui, sans-serif !important;
      background:
        radial-gradient(circle at 15% -20%, rgba(20, 184, 166, 0.10), transparent 45%),
        radial-gradient(circle at 85% 110%, rgba(13, 148, 136, 0.08), transparent 45%),
        radial-gradient(circle at 50% 50%, rgba(15, 118, 110, 0.03), transparent 60%),
        #f6fbfb !important;
      background-attachment: fixed !important;
      color: var(--c-ink-800) !important;
      letter-spacing: -0.011em;
      line-height: 1.55;
    }

    html[data-theme="dark"] body {
      background:
        radial-gradient(circle at 15% -20%, rgba(20, 184, 166, 0.12), transparent 45%),
        radial-gradient(circle at 85% 110%, rgba(13, 148, 136, 0.08), transparent 45%),
        #0b1220 !important;
      color: #e2e8f0 !important;
    }

    header {
      background: linear-gradient(135deg, #042f2e 0%, #0f766e 50%, #115e59 100%) !important;
      box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.08) inset,
        0 10px 40px -20px rgba(13, 148, 136, 0.5) !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding: 0 !important;
    }

    header::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 20% 50%, rgba(45, 212, 191, 0.15), transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(20, 184, 166, 0.1), transparent 50%);
      pointer-events: none;
    }

    header .max-w-7xl {
      position: relative;
      min-height: 80px !important;
      padding-top: 1rem !important;
      padding-bottom: 1rem !important;
    }

    header h1 {
      font-size: 1.35rem !important;
      font-weight: 700 !important;
      letter-spacing: -0.02em !important;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    }

    header .bg-white\\/20 {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06)) !important;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.2);
    }

    header button, header label {
      transition: all 0.2s var(--ease-out) !important;
      backdrop-filter: blur(10px);
    }

    header button:hover, header label:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px -6px rgba(0, 0, 0, 0.3);
    }

    .cloud-pill {
      background: rgba(255, 255, 255, 0.12) !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      backdrop-filter: blur(12px) !important;
      padding: 0.5rem 1rem !important;
      font-weight: 500 !important;
    }

    .cloud-dot {
      width: 9px !important;
      height: 9px !important;
      box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.15) !important;
    }

    nav {
      background: var(--surface-glass) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      border-bottom: 1px solid var(--border-subtle) !important;
      box-shadow: 0 4px 24px -12px rgba(15, 23, 42, 0.1) !important;
      padding: 0.5rem 0 !important;
      z-index: 45 !important;
    }

    nav .max-w-7xl { padding-top: 0 !important; padding-bottom: 0 !important; }

    .tab-btn {
      padding: 0.75rem 1.1rem !important;
      border-radius: 12px !important;
      font-weight: 500 !important;
      font-size: 0.86rem !important;
      color: var(--c-ink-500) !important;
      border: 1px solid transparent !important;
      transition: all 0.2s var(--ease-out) !important;
    }

    .tab-btn:hover {
      background: var(--c-primary-50) !important;
      color: var(--c-primary-700) !important;
      transform: translateY(-1px);
    }

    .tab-btn.active {
      background: linear-gradient(135deg, var(--c-primary-500), var(--c-primary-700)) !important;
      color: white !important;
      border-color: transparent !important;
      box-shadow:
        0 4px 12px -4px rgba(13, 148, 136, 0.4),
        0 2px 4px -2px rgba(13, 148, 136, 0.3) !important;
      font-weight: 600 !important;
    }

    .tab-btn.active::after { display: none !important; }
    html[data-theme="dark"] .tab-btn { color: #94a3b8 !important; }
    html[data-theme="dark"] .tab-btn:hover {
      background: rgba(20, 184, 166, 0.1) !important;
      color: #5eead4 !important;
    }
    html[data-theme="dark"] nav { background: rgba(15, 23, 42, 0.85) !important; }

    main { padding: 2rem 1rem !important; max-width: 1400px !important; }
    @media (min-width: 768px) { main { padding: 2.5rem 1.5rem !important; } }

    .bg-white.rounded-2xl,
    .bg-white.rounded-\\[28px\\],
    .app-shell-card {
      background: var(--surface-1) !important;
      border: 1px solid var(--border-subtle) !important;
      border-radius: var(--r-2xl) !important;
      box-shadow: var(--shadow-sm) !important;
      transition: transform 0.25s var(--ease-out), box-shadow 0.25s var(--ease-out), border-color 0.25s var(--ease-out) !important;
    }

    section > .bg-white:hover,
    section > .grid > .bg-white:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg) !important;
      border-color: var(--c-primary-200) !important;
    }

    html[data-theme="dark"] .bg-white.rounded-2xl,
    html[data-theme="dark"] .bg-white.rounded-\\[28px\\],
    html[data-theme="dark"] .app-shell-card {
      background: var(--surface-2) !important;
      border-color: var(--border-default) !important;
    }

    #tab-dashboard .grid > div > div,
    #customersGrid > div { border-radius: var(--r-xl) !important; }

    button {
      transition: transform 0.15s var(--ease-out), box-shadow 0.2s var(--ease-out), background 0.2s var(--ease-out), border-color 0.2s var(--ease-out) !important;
      letter-spacing: -0.005em;
      font-weight: 500;
    }
    button:hover:not(:disabled) { transform: translateY(-1px); }
    button:active:not(:disabled) { transform: translateY(0) scale(0.985); }

    .bg-blue-600, .bg-indigo-600 {
      background: linear-gradient(135deg, var(--c-primary-500), var(--c-primary-700)) !important;
      box-shadow: var(--shadow-brand) !important;
    }
    .bg-blue-600:hover, .bg-indigo-600:hover {
      background: linear-gradient(135deg, var(--c-primary-600), var(--c-primary-800)) !important;
      box-shadow: 0 16px 40px -12px rgba(13, 148, 136, 0.5) !important;
    }
    .bg-green-600, .bg-emerald-600 { background: linear-gradient(135deg, #10b981, #059669) !important; }

    input, select, textarea {
      background: var(--surface-2) !important;
      border: 1.5px solid var(--border-subtle) !important;
      border-radius: var(--r-md) !important;
      padding: 0.65rem 0.9rem !important;
      font-family: inherit !important;
      color: var(--c-ink-800) !important;
      transition: all 0.15s var(--ease-out) !important;
      font-size: 0.92rem;
    }
    input:focus, select:focus, textarea:focus {
      background: var(--surface-1) !important;
      border-color: var(--c-primary-500) !important;
      box-shadow: 0 0 0 4px var(--c-primary-100) !important;
      outline: none !important;
    }
    html[data-theme="dark"] input,
    html[data-theme="dark"] select,
    html[data-theme="dark"] textarea {
      background: var(--surface-3) !important;
      color: #e2e8f0 !important;
      border-color: var(--border-default) !important;
    }
    html[data-theme="dark"] input:focus,
    html[data-theme="dark"] select:focus,
    html[data-theme="dark"] textarea:focus {
      background: var(--surface-2) !important;
      box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.15) !important;
    }

    table { border-collapse: separate; border-spacing: 0; }
    table thead tr { background: linear-gradient(180deg, var(--surface-3), var(--surface-2)) !important; }
    table thead th {
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      color: var(--c-ink-500) !important;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      padding: 0.85rem 0.75rem !important;
      border-bottom: 1.5px solid var(--border-default) !important;
    }
    table tbody tr { transition: background 0.15s var(--ease-out); border-bottom: 1px solid var(--border-subtle) !important; }
    table tbody tr:hover { background: var(--c-primary-50) !important; }
    html[data-theme="dark"] table tbody tr:hover { background: rgba(20, 184, 166, 0.08) !important; }
    table tbody td { padding: 0.8rem 0.75rem !important; }

    #tab-dashboard .relative.overflow-hidden.rounded-\\[28px\\] {
      background: linear-gradient(135deg, #042f2e 0%, #115e59 40%, #0f766e 100%) !important;
      border-radius: var(--r-3xl) !important;
      padding: 2.5rem !important;
      box-shadow: 0 20px 60px -20px rgba(13, 148, 136, 0.4), 0 1px 0 rgba(255, 255, 255, 0.1) inset !important;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    #tab-dashboard .relative.overflow-hidden.rounded-\\[28px\\]::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 15% 20%, rgba(94, 234, 212, 0.15), transparent 40%),
        radial-gradient(circle at 85% 80%, rgba(45, 212, 191, 0.1), transparent 45%);
      pointer-events: none;
    }

    #tab-dashboard .grid.sm\\:grid-cols-2.lg\\:grid-cols-4 > div {
      background: var(--surface-1) !important;
      border-radius: var(--r-2xl) !important;
      padding: 1.5rem !important;
      min-height: 140px !important;
      border: 1px solid var(--border-subtle) !important;
      box-shadow: var(--shadow-sm) !important;
      position: relative;
      overflow: hidden;
      transition: all 0.3s var(--ease-out);
    }
    #tab-dashboard .grid.sm\\:grid-cols-2.lg\\:grid-cols-4 > div::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 80px;
      height: 80px;
      background: radial-gradient(circle, var(--c-primary-100), transparent 70%);
      opacity: 0.6;
      pointer-events: none;
    }
    #tab-dashboard .grid.sm\\:grid-cols-2.lg\\:grid-cols-4 > div:hover {
      transform: translateY(-4px) scale(1.01);
      box-shadow: var(--shadow-lg) !important;
      border-color: var(--c-primary-300) !important;
    }
    #tab-dashboard .bg-white::before { display: none !important; }

    #dashRevenue, #dashTrips, #dashCustomers, #dashAvg {
      font-size: 2rem !important;
      font-weight: 800 !important;
      letter-spacing: -0.03em !important;
      background: linear-gradient(135deg, var(--c-primary-700), var(--c-primary-500));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    #customersGrid > div {
      background: var(--surface-1) !important;
      border: 1px solid var(--border-subtle) !important;
      border-radius: var(--r-xl) !important;
      padding: 1.25rem !important;
      box-shadow: var(--shadow-xs) !important;
      transition: all 0.25s var(--ease-out);
      position: relative;
      overflow: hidden;
    }
    #customersGrid > div::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--c-primary-500), var(--c-accent-400));
      opacity: 0;
      transition: opacity 0.25s;
    }
    #customersGrid > div:hover::after { opacity: 1; }
    #customersGrid > div:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg) !important;
      border-color: var(--c-primary-200) !important;
    }

    .badge-vat {
      background: linear-gradient(135deg, var(--c-primary-100), var(--c-primary-200)) !important;
      color: var(--c-primary-800) !important;
      font-weight: 600 !important;
    }
    .badge-no-vat {
      background: var(--c-ink-100) !important;
      color: var(--c-ink-600) !important;
      font-weight: 600 !important;
    }

    #toast {
      background: linear-gradient(135deg, var(--c-ink-900), var(--c-ink-800)) !important;
      color: white !important;
      padding: 1rem 1.5rem !important;
      border-radius: var(--r-lg) !important;
      box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08) inset !important;
      font-weight: 500 !important;
      backdrop-filter: blur(12px);
    }

    #fabAddTrip {
      background: linear-gradient(135deg, var(--c-primary-500), var(--c-primary-700)) !important;
      box-shadow: 0 12px 32px -8px rgba(13, 148, 136, 0.5), 0 0 0 6px rgba(20, 184, 166, 0.15) !important;
      padding: 1rem 1.35rem !important;
      font-weight: 600 !important;
      transition: all 0.3s var(--ease-spring) !important;
    }
    #fabAddTrip:hover { transform: translateY(-4px) scale(1.03) !important; }

    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, var(--c-ink-300), var(--c-ink-400));
      border-radius: 10px;
      border: 2px solid transparent;
      background-clip: content-box;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, var(--c-primary-400), var(--c-primary-600));
      background-clip: content-box;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: none; }
    }
    @keyframes pulse-ring {
      0%, 100% { box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.2); }
      50% { box-shadow: 0 0 0 8px rgba(52, 211, 153, 0.05); }
    }
    @keyframes bar-grow {
      from { transform: scaleX(0); transform-origin: right; }
      to { transform: scaleX(1); transform-origin: right; }
    }

    .tab-content:not(.hidden) { animation: fadeInUp 0.35s var(--ease-out) both; }
    .cloud-dot { animation: pulse-ring 2.4s infinite !important; }

    .premium-sidebar {
      position: fixed;
      right: 24px;
      top: 180px;
      width: 260px;
      max-height: calc(100vh - 220px);
      background: var(--surface-1);
      border: 1px solid var(--border-subtle);
      border-radius: var(--r-2xl);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      z-index: 40;
      transition: all 0.3s var(--ease-out);
      display: flex;
      flex-direction: column;
    }

    .premium-sidebar-header {
      padding: 1rem 1.25rem;
      background: linear-gradient(135deg, var(--c-primary-600), var(--c-primary-800));
      color: white;
      font-weight: 700;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
    }
    .premium-sidebar-list { overflow-y: auto; flex: 1; padding: 0.5rem; }

    .premium-customer-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.7rem 0.85rem;
      border-radius: var(--r-md);
      cursor: pointer;
      transition: all 0.15s var(--ease-out);
      font-size: 0.88rem;
      color: var(--c-ink-700);
    }
    .premium-customer-row:hover {
      background: var(--c-primary-50);
      transform: translateX(-3px);
    }
    html[data-theme="dark"] .premium-customer-row:hover { background: rgba(20, 184, 166, 0.1); }
    .premium-customer-row .cust-name {
      flex: 1;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .premium-customer-row .cust-count {
      background: var(--c-primary-100);
      color: var(--c-primary-800);
      padding: 0.2rem 0.6rem;
      border-radius: var(--r-full);
      font-size: 0.75rem;
      font-weight: 700;
      min-width: 40px;
      text-align: center;
    }
    html[data-theme="dark"] .premium-customer-row .cust-count {
      background: rgba(20, 184, 166, 0.2);
      color: #5eead4;
    }

    @media (max-width: 1280px) { .premium-sidebar { display: none !important; } }

    .premium-bar-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0;
      border-bottom: 1px solid var(--border-subtle);
    }
    .premium-bar-row:last-child { border-bottom: none; }
    .premium-bar-label {
      flex: 0 0 40%;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--c-ink-700);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .premium-bar-track {
      flex: 1;
      height: 8px;
      background: var(--c-ink-100);
      border-radius: var(--r-full);
      overflow: hidden;
      position: relative;
    }
    .premium-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--c-primary-400), var(--c-primary-600));
      border-radius: var(--r-full);
      animation: bar-grow 0.8s var(--ease-out) both;
      box-shadow: 0 0 12px rgba(20, 184, 166, 0.3);
    }
    .premium-bar-value {
      flex: 0 0 auto;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--c-primary-800);
      min-width: 90px;
      text-align: left;
      direction: ltr;
    }
    html[data-theme="dark"] .premium-bar-label { color: #cbd5e1; }
    html[data-theme="dark"] .premium-bar-track { background: rgba(148, 163, 184, 0.15); }
    html[data-theme="dark"] .premium-bar-value { color: #5eead4; }

    h2.text-lg.font-semibold {
      font-size: 1.25rem !important;
      font-weight: 700 !important;
      letter-spacing: -0.02em !important;
      color: var(--c-ink-900) !important;
    }
    html[data-theme="dark"] h2.text-lg.font-semibold { color: #f1f5f9 !important; }

    #customerModal > div,
    #driverModal > div,
    #tripEditModal > div,
    #matrixModal > div,
    #dupModal > div,
    #orderersModal > div,
    #syncDiagModal > div {
      border-radius: var(--r-3xl) !important;
      box-shadow: 0 32px 64px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px var(--border-subtle) !important;
      animation: fadeInUp 0.25s var(--ease-spring) !important;
    }

    @media (max-width: 768px) {
      header .max-w-7xl { min-height: 68px !important; }
      .tab-btn { padding: 0.6rem 0.85rem !important; font-size: 0.78rem !important; }
      main { padding: 1.25rem 0.75rem !important; }
      #tab-dashboard .relative.overflow-hidden.rounded-\\[28px\\] { padding: 1.5rem !important; }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;

  function injectPremiumStyles() {
    if (document.getElementById('trip-premium-design')) return;
    const style = document.createElement('style');
    style.id = 'trip-premium-design';
    style.textContent = PREMIUM_CSS;
    document.head.appendChild(style);
  }

  // ============================================================
  // 2. SIDEBAR — with hide-when-empty
  // ============================================================
  let _sidebarCollapsed = false;

  function buildSidebar() {
    if (document.getElementById('premiumSidebar')) return;
    const el = document.createElement('div');
    el.id = 'premiumSidebar';
    el.className = 'premium-sidebar';
    el.innerHTML = `
      <div class="premium-sidebar-header" id="premiumSidebarHeader">
        <span>👥 לקוחות</span>
        <span style="font-size:1.2rem;opacity:0.7;">⇄</span>
      </div>
      <div class="premium-sidebar-list" id="premiumSidebarList"></div>
    `;
    document.body.appendChild(el);
    document.getElementById('premiumSidebarHeader').addEventListener('click', toggleSidebar);
    refreshSidebar();
  }

  function toggleSidebar() {
    _sidebarCollapsed = !_sidebarCollapsed;
    const el = document.getElementById('premiumSidebar');
    if (!el) return;
    if (_sidebarCollapsed) {
      el.style.width = '60px';
      el.style.height = '60px';
      el.querySelector('.premium-sidebar-list').style.display = 'none';
      el.querySelector('.premium-sidebar-header').innerHTML = '<span style="font-size:1.4rem;">👥</span>';
    } else {
      el.style.width = '';
      el.style.height = '';
      el.querySelector('.premium-sidebar-list').style.display = '';
      el.querySelector('.premium-sidebar-header').innerHTML = '<span>👥 לקוחות</span><span style="font-size:1.2rem;opacity:0.7;">⇄</span>';
      refreshSidebar();
    }
  }

  function refreshSidebar() {
    const list = document.getElementById('premiumSidebarList');
    const sidebar = document.getElementById('premiumSidebar');
    if (!list || !sidebar || _sidebarCollapsed) return;

    if (!state || !state.customers || !state.customers.length) {
      sidebar.style.display = 'none';
      return;
    }
    sidebar.style.display = '';

    const month = state.workingMonth;
    const counts = {};
    (state.trips || []).forEach(t => {
      if (!t.date || !t.date.startsWith(month)) return;
      counts[t.customerId] = (counts[t.customerId] || 0) + 1;
    });

    const customers = state.customers
      .map(c => ({ ...c, count: counts[c.id] || 0 }))
      .sort((a, b) => b.count - a.count);

    list.innerHTML = customers.map(c => `
      <div class="premium-customer-row" onclick="window.__sidebarOpenCustomer('${escAttr(c.id)}')">
        <span class="cust-name">${escHtml(c.name)}</span>
        <span class="cust-count">${c.count}</span>
      </div>
    `).join('');
  }

  window.__sidebarOpenCustomer = function (cid) {
    if (typeof window.editCustomer === 'function') window.editCustomer(cid);
  };

  // ============================================================
  // 3. DASHBOARD ENHANCEMENTS
  // ============================================================
  function enhanceDashboard() {
    const byCustomerBox = document.getElementById('dashByCustomer');
    if (byCustomerBox && !byCustomerBox.dataset.premium) {
      byCustomerBox.dataset.premium = '1';
      renderBarChart(byCustomerBox, 'customer');
    }

    const routesBox = document.getElementById('dashRoutes');
    if (routesBox && !routesBox.dataset.premium) {
      routesBox.dataset.premium = '1';
      renderBarChart(routesBox, 'route');
    }

    injectOrFixMissingPriceKPI();
    fixSmartAlertsEmptyState();
  }

  function renderBarChart(box, type) {
    const month = state.workingMonth;
    const trips = (state.trips || []).filter(t => t.date && t.date.startsWith(month));

    const data = {};
    trips.forEach(t => {
      let key;
      if (type === 'customer') {
        const c = typeof getCustomer === 'function' ? getCustomer(t.customerId) : null;
        key = c ? c.name : t.customerId;
      } else {
        key = t.columnKey || t.route || t.line || '—';
      }
      if (!data[key]) data[key] = { count: 0, sum: 0 };
      data[key].count++;
      data[key].sum += t.price || 0;
    });

    const entries = Object.entries(data).sort((a, b) => b[1].sum - a[1].sum).slice(0, 8);

    if (!entries.length) {
      box.innerHTML = `
        <div class="text-center py-8">
          <div class="text-3xl mb-2 opacity-30">📊</div>
          <div class="text-sm text-slate-400">אין נתונים לחודש ${month}</div>
        </div>`;
      return;
    }

    const maxSum = Math.max(...entries.map(([, v]) => v.sum));

    box.innerHTML = entries.map(([name, v]) => {
      const pct = maxSum > 0 ? (v.sum / maxSum) * 100 : 0;
      return `
        <div class="premium-bar-row">
          <div class="premium-bar-label" title="${escHtml(name)}">${escHtml(name)}</div>
          <div class="premium-bar-track">
            <div class="premium-bar-fill" style="width:${pct}%"></div>
          </div>
          <div class="premium-bar-value">${v.count} · ${v.sum.toLocaleString('he-IL')}₪</div>
        </div>
      `;
    }).join('');
  }

  function injectOrFixMissingPriceKPI() {
    const grid = document.querySelector('#tab-dashboard .grid.sm\\:grid-cols-2.lg\\:grid-cols-4');
    if (!grid) return;

    const month = state.workingMonth;
    const monthTrips = (state.trips || []).filter(t => t.date && t.date.startsWith(month));
    const missing = monthTrips.filter(t => !t.price || t.price === 0).length;
    const noData = monthTrips.length === 0;

    let icon, label, value, sub, color;
    if (noData) {
      icon = '📋';
      label = 'נסיעות בחודש';
      value = '—';
      sub = 'טרם הוזנו נתונים';
      color = 'slate';
    } else if (missing > 0) {
      icon = '⚠️';
      label = 'נסיעות ללא מחיר';
      value = String(missing);
      sub = 'דורש טיפול';
      color = 'amber';
    } else {
      icon = '✓';
      label = 'נסיעות ללא מחיר';
      value = '0';
      sub = 'הכל מלא';
      color = 'emerald';
    }

    const colorMap = {
      slate: { text: 'text-slate-500', bg: 'bg-slate-100' },
      amber: { text: 'text-amber-600', bg: 'bg-amber-50' },
      emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50' }
    };
    const c = colorMap[color];

    // אם כבר הוזרק — עדכן אותו
    let card = document.getElementById('premiumMissingPriceKPI');
    if (!card) {
      card = document.createElement('div');
      card.id = 'premiumMissingPriceKPI';
      card.className = 'bg-white rounded-2xl border border-slate-200 p-5 shadow-sm';
      grid.appendChild(card);
    }

    card.innerHTML = `
      <div class="flex items-start justify-between">
        <div>
          <div class="text-xs font-medium text-slate-500 mb-2">${label}</div>
          <div class="text-2xl font-bold ${c.text}">${value}</div>
          <div class="text-xs ${c.text} mt-1">${sub}</div>
        </div>
        <div class="w-10 h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center text-lg">${icon}</div>
      </div>
    `;
  }

  // ============================================================
  // 4. FIX — "בואו נתחיל" instead of "הכל מלא"
  // ============================================================
  function fixSmartAlertsEmptyState() {
    const box = document.getElementById('smartAlertsBox');
    if (!box) return;

    const month = state.workingMonth;
    const monthTrips = (state.trips || []).filter(t => t.date && t.date.startsWith(month));

    // אם יש נסיעות — לא נוגעים
    if (monthTrips.length > 0) return;

    // אם ריק — מחליפים את התוכן
    if (box.dataset.startState === '1') return;
    box.dataset.startState = '1';

    box.innerHTML = `
      <div class="bg-gradient-to-l from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-6 shadow-sm">
        <div class="flex items-start gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white flex items-center justify-center text-2xl shrink-0 shadow-lg">🚀</div>
          <div class="flex-1">
            <h3 class="font-bold text-teal-900 text-lg">בואו נתחיל!</h3>
            <p class="text-sm text-teal-800 mt-1">המערכת ריקה — עדיין לא הוזנו נסיעות לחודש הנוכחי.</p>
            <div class="flex flex-wrap gap-2 mt-3">
              <button onclick="showTab('quick')" class="bg-teal-600 hover:bg-teal-700 text-white text-sm px-4 py-2 rounded-xl font-medium transition">⚡ הזן נסיעה חדשה</button>
              <button onclick="showTab('import')" class="bg-white hover:bg-teal-50 border border-teal-300 text-teal-800 text-sm px-4 py-2 rounded-xl font-medium transition">📥 ייבא מאקסל / וואטסאפ</button>
              <button onclick="showTab('customers')" class="bg-white hover:bg-teal-50 border border-teal-300 text-teal-800 text-sm px-4 py-2 rounded-xl font-medium transition">👥 ניהול לקוחות</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ============================================================
  // 5. ⚡ EXCEL IMPORT OVERRIDE — סינון מע"מ / סה"כ / שירות
  // ============================================================
  let _xlWb = null;
  let _xlSheets = [];
  let _xlSheetIdx = 0;
  let _xlMappings = {};

  // ═══ הפילטרים ═══
  function xlIsVatOrTotal(cell) {
    const s = String(cell || '').trim();
    if (!s) return false;
    // תפוס: מע"מ, מעמ, מע"מ, סה"כ, סהכ, סה"כ, total, vat, subtotal, grand, שירות, שרות
    if (/^מע["'׳]?מ$|^מעמ$/i.test(s)) return true;
    if (/^סה["'׳]?כ$|^סהכ$|^סה["'׳]?כ\s|^סהכ\s/i.test(s)) return true;
    if (/^total$|^vat$|^subtotal$|^grand/i.test(s)) return true;
    if (/^שירות\s*\d|^שרות\s*\d|^service/i.test(s)) return true;
    return false;
  }

  function xlLooksLikeFormula(val) {
    return typeof val === 'string' && val.trim().startsWith('=');
  }

  function xlIsValidNumber(val) {
    if (val === null || val === undefined || val === '') return false;
    if (xlLooksLikeFormula(val)) return false;
    const s = String(val).trim();
    if (!s) return false;
    // דחה מחרוזות עם אותיות עבריות/לטיניות
    if (/[א-תa-zA-Z]/.test(s)) return false;
    const n = parseFloat(s.replace(/[^\d.\-]/g, ''));
    if (isNaN(n) || n <= 0) return false;
    // סף עליון — סה"כ חודשי לרוב גבוה; נסיעה בודדת לא סביר שתעבור 50000
    if (n > 50000) return false;
    return true;
  }

  function xlParseDate(v) {
    if (!v) return null;
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    const t = String(v).trim();
    if (!t) return null;
    let m = t.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (m) return `${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`;
    m = t.match(/(\d{1,2})[\/\.](\d{1,2})[\/\.](\d{2,4})/);
    if (m) {
      const y = m[3].length === 2 ? '20' + m[3] : m[3];
      let day = m[1].padStart(2,'0'), mo = m[2].padStart(2,'0');
      if (parseInt(mo, 10) > 12) [day, mo] = [mo, day];
      return `${y}-${mo}-${day}`;
    }
    const months = {'ינואר':1,'פברואר':2,'מרץ':3,'מרס':3,'אפריל':4,'מאי':5,'יוני':6,'יולי':7,'אוגוסט':8,'ספטמבר':9,'אוקטובר':10,'נובמבר':11,'דצמבר':12};
    m = t.match(/(\d{1,2})\s+ב?([א-ת]+)\s+(\d{4})/);
    if (m && months[m[2]]) return `${m[3]}-${String(months[m[2]]).padStart(2,'0')}-${m[1].padStart(2,'0')}`;
    m = t.match(/יום\s+\S+,?\s+(\d{1,2})\b/);
    if (m) return '__DAY__' + m[1];
    const n = parseFloat(t);
    if (!isNaN(n) && n > 30000 && n < 60000) {
      const d = new Date(Date.UTC(1899, 11, 30) + n * 86400000);
      return d.toISOString().slice(0, 10);
    }
    return null;
  }

  function xlDetectHeaderRow(rows) {
    const hints = /תאריך|מחיר|תיאור|יעד|מוצא|הערות|מזמין|קו\s*\d|^\d{1,2}:\d{2}|פתיחה|הלוך|חזור/i;
    for (let i = 0; i < Math.min(5, rows.length); i++) {
      const row = rows[i];
      if (!row || row.length < 2) continue;
      const cells = row.map(c => String(c || '').trim()).filter(Boolean);
      if (cells.length >= 2 && cells.some(c => hints.test(c))) return i;
    }
    return 0;
  }

  function xlAutoFieldForHeader(hs) {
    if (/תאריך|date|^יום/i.test(hs)) return 'date';
    if (/מחיר|price|סכום|amount/i.test(hs)) return 'price';
    if (/תיאור|מסלול|פירוט|route|description/i.test(hs)) return 'route';
    if (/^מוצא|from|מאיפה/i.test(hs)) return 'origin';
    if (/^יעד|^to|לאן|destination/i.test(hs)) return 'destination';
    if (/מזמין|נהג|driver/i.test(hs)) return 'driver';
    if (/הערות|notes|remark/i.test(hs)) return 'notes';
    if (/לקוח|customer/i.test(hs)) return 'customer';
    if (/קו|גיליון|line/i.test(hs)) return 'line';
    if (/מספר הזמנה|order.?num/i.test(hs)) return 'orderNum';
    if (/שולם|payment|paid/i.test(hs)) return 'paid';
    if (/קו\s*\d|^\d{1,2}:\d{2}|פתיחה|הלוך|חזור|ראש העין פת/i.test(hs)) return 'priceCol:' + hs;
    return 'skip';
  }

  function xlNormLine(s) {
    return String(s || '').replace(/["'׳"]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function xlMatchCustomerLine(c, sheetName) {
    if (!c || !c.lines || !c.lines.length) return sheetName;
    const t = xlNormLine(sheetName);
    let hit = c.lines.find(l => xlNormLine(l) === t);
    if (hit) return hit;
    hit = c.lines.find(l => {
      const n = xlNormLine(l);
      return n && (n.includes(t) || t.includes(n));
    });
    if (hit) return hit;
    const toks = t.split(' ').filter(x => x.length > 1);
    return c.lines.find(l => toks.some(tok => xlNormLine(l).includes(tok))) || sheetName;
  }

  // ═══ Override startExcelImport ═══
  window.startExcelImport = function () {
    const fileInput = document.getElementById('excelFile');
    const file = fileInput?.files?.[0];
    if (!file) { toastMsg('בחר קובץ'); return; }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, {
          type: 'array',
          cellDates: true,
          cellFormula: false,
          cellNF: false,
          cellText: false
        });
        _xlWb = wb;
        _xlMappings = {};

        // ═══ קרא גיליונות + סנן שורות מע"מ/סה"כ ═══
        _xlSheets = wb.SheetNames.map((name, idx) => {
          const ws = wb.Sheets[name];
          let rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: true, blankrows: false });

          // סנן שורות שהן מע"מ / סה"כ / שירות — בכל עמודה
          rows = rows.filter((row) => {
            if (!row || !row.length) return false;
            // בדוק את כל התאים — אם יש תא שהוא בדיוק "מע"מ"/"סה"כ"/"שירות" — דלג
            for (let ci = 0; ci < row.length; ci++) {
              if (xlIsVatOrTotal(row[ci])) return false;
            }
            return true;
          });

          return { name, idx, rows };
        });

        // זהה לקוח מהשם
        const fname = file.name.replace(/\.[^.]+$/, '');
        const matched = (state.customers || []).find(c =>
          fname.includes(c.name) || c.name.includes(fname.replace(/עותק של |אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר|ינואר|פברואר|מרץ|אפריל|מאי|יוני|יולי|\d+/g, '').trim())
        );
        const sel = document.getElementById('excelCustomer');
        if (sel) {
          sel.innerHTML = '<option value="">— זהה מהקובץ / בחר —</option>';
          (state.customers || []).slice().sort((a, b) => a.name.localeCompare(b.name, 'he')).forEach(c => {
            const o = document.createElement('option');
            o.value = c.id;
            o.textContent = c.name;
            if (matched && matched.id === c.id) o.selected = true;
            sel.appendChild(o);
          });
        }

        const mainIdx = _xlSheets.findIndex(s => s.rows.length > 1 && !/סה.?כ|סיכום|total/i.test(s.name));
        _xlSheetIdx = mainIdx >= 0 ? mainIdx : 0;

        window.__xl4RenderMapping();
        document.getElementById('excelMappingBox')?.classList.remove('hidden');
        document.getElementById('excelPendingBox')?.classList.add('hidden');

        const filteredCount = wb.SheetNames.reduce((s, n, i) => s + 0, 0);
        toastMsg('קובץ נטען: ' + _xlSheets.length + ' גיליונות · שורות מע"מ/סה"כ סוננו');
      } catch (err) {
        console.error(err);
        toastMsg('שגיאה בקריאת הקובץ: ' + (err.message || err));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  window.__xl4SelectSheet = function (idx) {
    _xlSheetIdx = parseInt(idx, 10) || 0;
    window.__xl4RenderMapping();
  };

  window.__xl4SetMap = function (colIdx, value) {
    const sheet = _xlSheets[_xlSheetIdx];
    if (!sheet) return;
    if (!_xlMappings[sheet.name]) _xlMappings[sheet.name] = {};
    _xlMappings[sheet.name][colIdx] = value;
  };

  window.__xl4RenderMapping = function () {
    const sheet = _xlSheets[_xlSheetIdx];
    if (!sheet) return;
    const rows = sheet.rows;
    const box = document.getElementById('excelMappingTable');
    if (!box) return;
    if (!rows.length) { box.innerHTML = '<div class="text-slate-400 text-sm p-2">גיליון ריק</div>'; return; }

    const headerIdx = xlDetectHeaderRow(rows);
    const header = rows[headerIdx] || [];

    if (!_xlMappings[sheet.name]) {
      _xlMappings[sheet.name] = {};
      header.forEach((h, i) => {
        const hs = String(h || '').trim();
        _xlMappings[sheet.name][i] = hs ? xlAutoFieldForHeader(hs) : 'skip';
      });
    }
    const mapping = _xlMappings[sheet.name];

    const sheetOpts = _xlSheets.map((s, i) =>
      `<option value="${i}" ${i === _xlSheetIdx ? 'selected' : ''}>${escHtml(s.name)} (${s.rows.length} שורות)</option>`
    ).join('');

    let html = `
      <div class="flex flex-wrap gap-2 items-center mb-3">
        <label class="text-xs text-slate-500">גיליון:</label>
        <select onchange="window.__xl4SelectSheet(this.value)" class="border border-slate-300 rounded-lg px-2 py-1 text-sm">${sheetOpts}</select>
        <span class="text-xs text-slate-400">שורת כותרת: ${headerIdx + 1}</span>
        <span class="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">✓ סוננו שורות מע"מ/סה"כ</span>
      </div>
      <table class="min-w-full border-collapse text-xs">
        <thead><tr class="bg-slate-100">
          <th class="border px-2 py-1 text-right">עמודה בקובץ</th>
          <th class="border px-2 py-1 text-right">משמעות</th>
        </tr></thead><tbody>`;

    header.forEach((h, i) => {
      const hs = String(h || '').trim();
      if (!hs) return;
      const cur = mapping[i] || 'skip';
      const opts = [
        ['skip','— דלג —'],['date','תאריך'],['price','מחיר'],['route','מסלול/תיאור'],
        ['origin','מוצא'],['destination','יעד'],['driver','מזמין'],['notes','הערות'],
        ['customer','לקוח'],['line','קו'],['orderNum','מספר הזמנה'],['paid','שולם'],
        ['priceCol:' + hs, 'עמודת מחיר: ' + hs]
      ].map(([v, l]) => {
        const isSel = cur === v || (String(cur).startsWith('priceCol:') && String(v).startsWith('priceCol:'));
        return `<option value="${escHtml(v)}" ${isSel ? 'selected' : ''}>${escHtml(l)}</option>`;
      }).join('');
      html += `<tr>
        <td class="border px-2 py-1">${escHtml(hs)}</td>
        <td class="border px-2 py-1"><select data-col="${i}" onchange="window.__xl4SetMap(${i}, this.value)" class="border rounded px-1 py-0.5 text-xs w-full">${opts}</select></td>
      </tr>`;
    });
    html += '</tbody></table>';
    box.innerHTML = html;
  };

  // ═══ Override runExcelParse ═══
  window.runExcelParse = function () {
    if (!_xlWb || !_xlSheets.length) return;
    const customerId = document.getElementById('excelCustomer')?.value || '';
    const batchId = 'IMP-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 6);

    const pending = [];
    const c = customerId && typeof getCustomer === 'function' ? getCustomer(customerId) : null;

    const d = new Date();
    const month = (state && state.workingMonth) || `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    const [y, mo] = month.split('-').map(Number);
    const daysInMonth = new Date(y, mo, 0).getDate();

    let filteredRows = 0;

    _xlSheets.forEach(sheet => {
      if (/סה.?כ|סיכום|total/i.test(sheet.name)) return;
      const rows = sheet.rows;
      if (!rows.length) return;
      const headerIdx = xlDetectHeaderRow(rows);
      const header = rows[headerIdx] || [];
      const mapping = _xlMappings[sheet.name] || {};

      const cols = { date: -1, price: -1, route: -1, origin: -1, destination: -1, driver: -1, notes: -1, orderNum: -1 };
      const priceCols = [];
      Object.entries(mapping).forEach(([i, f]) => {
        const idx = +i;
        if (!f || f === 'skip') return;
        if (String(f).startsWith('priceCol:')) {
          priceCols.push({ idx, name: String(f).replace('priceCol:', '') });
          return;
        }
        if (cols[f] === -1) cols[f] = idx;
      });

      const dateCol = cols.date >= 0 ? cols.date : 0;
      const lineName = c ? xlMatchCustomerLine(c, sheet.name) : sheet.name;
      const isMatrix = priceCols.length >= 1 && priceCols.some(pc => pc.idx > dateCol);

      for (let r = headerIdx + 1; r < rows.length; r++) {
        const row = rows[r];
        if (!row || !row.length) continue;

        // ═══ שכבת הגנה 1: תאריך לא תקין ═══
        const dateCellRaw = row[dateCol];
        const dateCellStr = String(dateCellRaw || '').trim();

        // ═══ שכבת הגנה 2: מילות מפתח של מע"מ/סה"כ בתא התאריך ═══
        if (xlIsVatOrTotal(dateCellStr)) { filteredRows++; continue; }

        // ═══ שכבת הגנה 3: תא התאריך מכיל נוסחה ═══
        if (xlLooksLikeFormula(dateCellRaw)) { filteredRows++; continue; }

        let date = xlParseDate(dateCellRaw);
        if (date && date.startsWith('__DAY__')) {
          const day = parseInt(date.replace('__DAY__', ''), 10);
          date = (day >= 1 && day <= daysInMonth) ? `${month}-${String(day).padStart(2, '0')}` : null;
        }
        if (!date) continue;

        const rowNotes = cols.notes >= 0 ? String(row[cols.notes] || '').trim() : '';
        const rowDriver = cols.driver >= 0 ? String(row[cols.driver] || '').trim() : '';

        if (isMatrix) {
          priceCols.forEach(pc => {
            const rawVal = row[pc.idx];

            // ═══ שכבת הגנה 4: בדיקת מספר תקין ═══
            if (!xlIsValidNumber(rawVal)) {
              if (rawVal !== '' && rawVal !== null && rawVal !== undefined) {
                const s = String(rawVal).trim();
                if (/^=/.test(s) || xlIsVatOrTotal(s)) filteredRows++;
              }
              return;
            }

            const price = parseFloat(String(rawVal).replace(/[^\d.\-]/g, ''));
            pending.push({
              id: 'pend_' + Date.now() + Math.random().toString(36).slice(2, 7),
              importBatchId: batchId,
              source: 'excel',
              reviewStatus: 'pending',
              status: 'ok',
              dup: false,
              date, price,
              route: `${lineName} · ${pc.name}`,
              line: lineName,
              columnKey: pc.name,
              origin: lineName,
              destination: pc.name,
              notes: rowNotes,
              driver: rowDriver,
              customerId,
              sheet: sheet.name
            });
          });
        } else {
          const rawPrice = cols.price >= 0 ? row[cols.price] : '';
          if (!xlIsValidNumber(rawPrice) && rawPrice !== '') {
            filteredRows++;
            continue;
          }
          const price = xlIsValidNumber(rawPrice) ? parseFloat(String(rawPrice).replace(/[^\d.\-]/g, '')) : 0;
          const route = cols.route >= 0 ? String(row[cols.route] || '').trim() : '';
          if (!date && !price && !route) continue;

          pending.push({
            id: 'pend_' + Date.now() + Math.random().toString(36).slice(2, 7),
            importBatchId: batchId,
            source: 'excel',
            reviewStatus: 'pending',
            status: (!price) ? 'warn' : 'ok',
            dup: false,
            date: date || month + '-01',
            price: price || 0,
            route,
            origin: cols.origin >= 0 ? String(row[cols.origin] || '') : '',
            destination: cols.destination >= 0 ? String(row[cols.destination] || '') : '',
            driver: rowDriver,
            notes: rowNotes,
            line: lineName,
            columnKey: '',
            customerId,
            sheet: sheet.name
          });
        }
      }
    });

    // סיווג סטטוס + כפילויות
    pending.forEach(p => {
      if (!p.date || !p.price) p.status = 'error';
      else if (!p.customerId) p.status = 'warn';
      else p.status = 'ok';
      if (p.status !== 'error') {
        const dups = (state.trips || []).filter(t =>
          t.date === p.date &&
          Math.abs((t.price || 0) - (p.price || 0)) < 0.01 &&
          (t.route || '') === (p.route || '') &&
          (!p.customerId || t.customerId === p.customerId)
        );
        if (dups.length) { p.status = 'warn'; p.dup = true; }
      }
    });

    // שמור
    if (typeof _importPending !== 'undefined') try { _importPending = pending; } catch (_) {}
    if (typeof _importBatchId !== 'undefined') try { _importBatchId = batchId; } catch (_) {}
    state.importPending = pending;

    if (typeof renderPendingTable === 'function') renderPendingTable();
    document.getElementById('excelPendingBox')?.classList.remove('hidden');

    let msg = pending.length + ' רשומות מוכנות לבדיקה';
    if (filteredRows > 0) msg += ' · 🚫 סוננו ' + filteredRows + ' שורות (מע"מ/סה"כ/נוסחאות)';
    toastMsg(msg, 4500);
  };

  // ============================================================
  // 6. EVENT HOOKS
  // ============================================================
  function hookRefresh() {
    const origShowTab = window.showTab;
    if (typeof origShowTab === 'function' && !origShowTab.__premium4) {
      const wrapped = function (name) {
        const r = origShowTab.apply(this, arguments);
        if (name === 'dashboard') setTimeout(enhanceDashboard, 200);
        if (name === 'customers') setTimeout(refreshSidebar, 200);
        if (name === 'import') setTimeout(() => {
          // וודא שהפילטרים של Excel פעילים
          if (typeof window.startExcelImport === 'function') {
            // override כבר פעיל
          }
        }, 100);
        return r;
      };
      wrapped.__premium4 = true;
      window.showTab = wrapped;
    }

    const origSave = window.saveState;
    if (typeof origSave === 'function' && !origSave.__premium4) {
      const wrapped = function () {
        const r = origSave.apply(this, arguments);
        setTimeout(refreshSidebar, 500);
        setTimeout(() => {
          const dashTab = document.getElementById('tab-dashboard');
          if (dashTab && !dashTab.classList.contains('hidden')) {
            const byC = document.getElementById('dashByCustomer');
            const rt = document.getElementById('dashRoutes');
            if (byC) byC.dataset.premium = '';
            if (rt) rt.dataset.premium = '';
            // איפוס empty state
            const box = document.getElementById('smartAlertsBox');
            if (box) box.dataset.startState = '';
            enhanceDashboard();
          }
        }, 600);
        return r;
      };
      wrapped.__premium4 = true;
      window.saveState = wrapped;
    }
  }

  // ============================================================
  // 7. BOOT
  // ============================================================
  function boot() {
    injectPremiumStyles();
    buildSidebar();
    hookRefresh();

    let tries = 0;
    const waitForState = () => {
      tries++;
      if (state && Array.isArray(state.customers)) {
        refreshSidebar();
        enhanceDashboard();
      } else if (tries < 30) {
        setTimeout(waitForState, 300);
      }
    };
    waitForState();

    setInterval(refreshSidebar, 15000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 800));
  } else {
    setTimeout(boot, 800);
  }
  window.addEventListener('load', () => setTimeout(boot, 600));

})();
