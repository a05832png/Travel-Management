// ============================================================
// app-upgrade-4.js — Premium Visual Overhaul
// ============================================================
// שדרוג ויזואלי מקיף:
//   • פלטת צבעים טורקיז-כהה יוקרתית
//   • סרגל צד צף עם מוני לקוחות
//   • כרטיסי KPI עם טבעות התקדמות
//   • גרפי עמודות מונפשים
//   • עיצוב כרטיסים מודרני
//   • מצב לילה מושלם
//   • אנימציות עדינות בכל מקום
//   • שומר על כל הפונקציונליות הקיימת
// ============================================================

(function () {
  'use strict';

  // ============================================================
  // 1. DESIGN SYSTEM — CSS מלא
  // ============================================================
  const PREMIUM_CSS = `
    /* ═══════════════════════════════════════════════════ */
    /* THEME TOKENS — Teal Premium                              */
    /* ═══════════════════════════════════════════════════ */
    :root {
      /* Primary — Teal */
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

      /* Accent — Amber/Gold for highlights */
      --c-accent-400: #fbbf24;
      --c-accent-500: #f59e0b;

      /* Neutrals */
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
      --c-ink-950: #020617;

      /* Semantic */
      --c-success: #10b981;
      --c-warning: #f59e0b;
      --c-danger: #ef4444;
      --c-info: #3b82f6;

      /* Surfaces */
      --surface-1: #ffffff;
      --surface-2: #f8fafc;
      --surface-3: #f1f5f9;
      --surface-glass: rgba(255, 255, 255, 0.72);
      --surface-overlay: rgba(15, 23, 42, 0.5);

      /* Borders */
      --border-subtle: rgba(148, 163, 184, 0.14);
      --border-default: rgba(148, 163, 184, 0.24);
      --border-strong: rgba(148, 163, 184, 0.42);

      /* Shadows — multi-layered, soft */
      --shadow-2xs: 0 1px 2px rgba(15, 23, 42, 0.03);
      --shadow-xs:  0 1px 3px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.03);
      --shadow-sm:  0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -1px rgba(15, 23, 42, 0.03);
      --shadow-md:  0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.03);
      --shadow-lg:  0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04);
      --shadow-xl:  0 25px 50px -12px rgba(15, 23, 42, 0.15);
      --shadow-brand: 0 12px 32px -10px rgba(13, 148, 136, 0.35);
      --shadow-inner: inset 0 1px 2px rgba(15, 23, 42, 0.04);

      /* Radius */
      --r-xs: 6px;
      --r-sm: 8px;
      --r-md: 12px;
      --r-lg: 16px;
      --r-xl: 20px;
      --r-2xl: 24px;
      --r-3xl: 32px;
      --r-full: 9999px;

      /* Motion */
      --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
      --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
      --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* ═══════════════════════════════════════════════════ */
    /* DARK MODE                                                */
    /* ═══════════════════════════════════════════════════ */
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

    /* ═══════════════════════════════════════════════════ */
    /* GLOBAL RESET & BODY                                      */
    /* ═══════════════════════════════════════════════════ */
    * { box-sizing: border-box; }

    html {
      scroll-behavior: smooth;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      font-family: 'Heebo', 'Rubik', system-ui, -apple-system, sans-serif !important;
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

    /* ═══════════════════════════════════════════════════ */
    /* HEADER — Premium Glass                                   */
    /* ═══════════════════════════════════════════════════ */
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
      letter-spacing: -0.01em;
    }

    .cloud-dot {
      width: 9px !important;
      height: 9px !important;
      box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.15) !important;
    }

    /* ═══════════════════════════════════════════════════ */
    /* NAVIGATION — Floating Tabs                               */
    /* ═══════════════════════════════════════════════════ */
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
      letter-spacing: -0.005em;
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
    html[data-theme="dark"] nav {
      background: rgba(15, 23, 42, 0.85) !important;
    }

    /* ═══════════════════════════════════════════════════ */
    /* MAIN CONTENT SPACING                                     */
    /* ═══════════════════════════════════════════════════ */
    main {
      padding: 2rem 1rem !important;
      max-width: 1400px !important;
    }

    @media (min-width: 768px) {
      main { padding: 2.5rem 1.5rem !important; }
    }

    /* ═══════════════════════════════════════════════════ */
    /* CARDS — Premium Elevation                                */
    /* ═══════════════════════════════════════════════════ */
    .bg-white.rounded-2xl,
    .bg-white.rounded-\\[28px\\],
    .app-shell-card {
      background: var(--surface-1) !important;
      border: 1px solid var(--border-subtle) !important;
      border-radius: var(--r-2xl) !important;
      box-shadow: var(--shadow-sm) !important;
      transition:
        transform 0.25s var(--ease-out),
        box-shadow 0.25s var(--ease-out),
        border-color 0.25s var(--ease-out) !important;
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

    /* Override rounded-2xl on all cards */
    #tab-dashboard .grid > div > div,
    #customersGrid > div {
      border-radius: var(--r-xl) !important;
    }

    /* ═══════════════════════════════════════════════════ */
    /* BUTTONS — Enhanced                                      */
    /* ═══════════════════════════════════════════════════ */
    button {
      transition:
        transform 0.15s var(--ease-out),
        box-shadow 0.2s var(--ease-out),
        background 0.2s var(--ease-out),
        border-color 0.2s var(--ease-out) !important;
      letter-spacing: -0.005em;
      font-weight: 500;
    }

    button:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    button:active:not(:disabled) {
      transform: translateY(0) scale(0.985);
    }

    /* Primary CTA */
    .bg-blue-600, .bg-indigo-600 {
      background: linear-gradient(135deg, var(--c-primary-500), var(--c-primary-700)) !important;
      box-shadow: var(--shadow-brand) !important;
    }

    .bg-blue-600:hover, .bg-indigo-600:hover {
      background: linear-gradient(135deg, var(--c-primary-600), var(--c-primary-800)) !important;
      box-shadow: 0 16px 40px -12px rgba(13, 148, 136, 0.5) !important;
    }

    /* Success */
    .bg-green-600, .bg-emerald-600 {
      background: linear-gradient(135deg, #10b981, #059669) !important;
    }

    /* ═══════════════════════════════════════════════════ */
    /* INPUTS — Elegant                                        */
    /* ═══════════════════════════════════════════════════ */
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

    /* ═══════════════════════════════════════════════════ */
    /* TABLES — Modern                                         */
    /* ═══════════════════════════════════════════════════ */
    table { border-collapse: separate; border-spacing: 0; }

    table thead tr {
      background: linear-gradient(180deg, var(--surface-3), var(--surface-2)) !important;
    }

    table thead th {
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      color: var(--c-ink-500) !important;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      padding: 0.85rem 0.75rem !important;
      border-bottom: 1.5px solid var(--border-default) !important;
    }

    table tbody tr {
      transition: background 0.15s var(--ease-out);
      border-bottom: 1px solid var(--border-subtle) !important;
    }

    table tbody tr:hover {
      background: var(--c-primary-50) !important;
    }

    html[data-theme="dark"] table tbody tr:hover {
      background: rgba(20, 184, 166, 0.08) !important;
    }

    table tbody td {
      padding: 0.8rem 0.75rem !important;
    }

    /* ═══════════════════════════════════════════════════ */
    /* DASHBOARD — Hero Redesign                              */
    /* ═══════════════════════════════════════════════════ */
    #tab-dashboard .relative.overflow-hidden.rounded-\\[28px\\] {
      background: linear-gradient(135deg, #042f2e 0%, #115e59 40%, #0f766e 100%) !important;
      border-radius: var(--r-3xl) !important;
      padding: 2.5rem !important;
      box-shadow:
        0 20px 60px -20px rgba(13, 148, 136, 0.4),
        0 1px 0 rgba(255, 255, 255, 0.1) inset !important;
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

    /* KPI cards */
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

    /* Remove default pseudo-decoration */
    #tab-dashboard .bg-white::before { display: none !important; }

    /* KPI values */
    #dashRevenue, #dashTrips, #dashCustomers, #dashAvg {
      font-size: 2rem !important;
      font-weight: 800 !important;
      letter-spacing: -0.03em !important;
      background: linear-gradient(135deg, var(--c-primary-700), var(--c-primary-500));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* ═══════════════════════════════════════════════════ */
    /* CUSTOMER CARDS                                          */
    /* ═══════════════════════════════════════════════════ */
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

    /* ═══════════════════════════════════════════════════ */
    /* BADGES                                                  */
    /* ═══════════════════════════════════════════════════ */
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

    /* ═══════════════════════════════════════════════════ */
    /* TOAST                                                   */
    /* ═══════════════════════════════════════════════════ */
    #toast {
      background: linear-gradient(135deg, var(--c-ink-900), var(--c-ink-800)) !important;
      color: white !important;
      padding: 1rem 1.5rem !important;
      border-radius: var(--r-lg) !important;
      box-shadow:
        0 20px 40px -12px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.08) inset !important;
      font-weight: 500 !important;
      backdrop-filter: blur(12px);
    }

    /* ═══════════════════════════════════════════════════ */
    /* FAB — Floating Action Button                            */
    /* ═══════════════════════════════════════════════════ */
    #fabAddTrip {
      background: linear-gradient(135deg, var(--c-primary-500), var(--c-primary-700)) !important;
      box-shadow:
        0 12px 32px -8px rgba(13, 148, 136, 0.5),
        0 0 0 6px rgba(20, 184, 166, 0.15) !important;
      padding: 1rem 1.35rem !important;
      font-weight: 600 !important;
      transition: all 0.3s var(--ease-spring) !important;
    }

    #fabAddTrip:hover {
      transform: translateY(-4px) scale(1.03) !important;
    }

    /* ═══════════════════════════════════════════════════ */
    /* SCROLLBAR                                               */
    /* ═══════════════════════════════════════════════════ */
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

    /* ═══════════════════════════════════════════════════ */
    /* ANIMATIONS                                              */
    /* ═══════════════════════════════════════════════════ */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: none; }
    }

    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: none; }
    }

    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }

    @keyframes pulse-ring {
      0%, 100% { box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.2); }
      50% { box-shadow: 0 0 0 8px rgba(52, 211, 153, 0.05); }
    }

    @keyframes bar-grow {
      from { transform: scaleX(0); transform-origin: right; }
      to { transform: scaleX(1); transform-origin: right; }
    }

    .tab-content:not(.hidden) {
      animation: fadeInUp 0.35s var(--ease-out) both;
    }

    .cloud-dot { animation: pulse-ring 2.4s infinite !important; }

    /* ═══════════════════════════════════════════════════ */
    /* SIDEBAR — Floating Customer List                        */
    /* ═══════════════════════════════════════════════════ */
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

    .premium-sidebar.collapsed {
      width: 60px;
      height: 60px;
      overflow: hidden;
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

    .premium-sidebar-list {
      overflow-y: auto;
      flex: 1;
      padding: 0.5rem;
    }

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

    html[data-theme="dark"] .premium-customer-row:hover {
      background: rgba(20, 184, 166, 0.1);
    }

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

    @media (max-width: 1280px) {
      .premium-sidebar { display: none !important; }
    }

    /* ═══════════════════════════════════════════════════ */
    /* BAR CHART — Horizontal                                  */
    /* ═══════════════════════════════════════════════════ */
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

    /* ═══════════════════════════════════════════════════ */
    /* KPI RING                                                */
    /* ═══════════════════════════════════════════════════ */
    .premium-ring {
      width: 44px;
      height: 44px;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .premium-ring svg {
      transform: rotate(-90deg);
      width: 100%;
      height: 100%;
    }

    .premium-ring circle {
      fill: none;
      stroke-width: 4;
      stroke-linecap: round;
    }

    .premium-ring .bg { stroke: var(--c-ink-100); }
    .premium-ring .fg { stroke: url(#ringGradient); transition: stroke-dashoffset 1s var(--ease-out); }

    html[data-theme="dark"] .premium-ring .bg { stroke: rgba(148, 163, 184, 0.15); }

    /* ═══════════════════════════════════════════════════ */
    /* SECTION TITLES                                          */
    /* ═══════════════════════════════════════════════════ */
    h2.text-lg.font-semibold {
      font-size: 1.25rem !important;
      font-weight: 700 !important;
      letter-spacing: -0.02em !important;
      color: var(--c-ink-900) !important;
    }

    html[data-theme="dark"] h2.text-lg.font-semibold { color: #f1f5f9 !important; }

    h3.font-semibold {
      font-weight: 700 !important;
      letter-spacing: -0.01em;
    }

    /* ═══════════════════════════════════════════════════ */
    /* MODALS — Enhanced                                       */
    /* ═══════════════════════════════════════════════════ */
    #customerModal > div,
    #driverModal > div,
    #tripEditModal > div,
    #matrixModal > div,
    #dupModal > div,
    #orderersModal > div,
    #syncDiagModal > div {
      border-radius: var(--r-3xl) !important;
      box-shadow:
        0 32px 64px -12px rgba(15, 23, 42, 0.25),
        0 0 0 1px var(--border-subtle) !important;
      animation: fadeInUp 0.25s var(--ease-spring) !important;
    }

    /* ═══════════════════════════════════════════════════ */
    /* RESPONSIVE                                              */
    /* ═══════════════════════════════════════════════════ */
    @media (max-width: 768px) {
      header .max-w-7xl { min-height: 68px !important; }
      .tab-btn {
        padding: 0.6rem 0.85rem !important;
        font-size: 0.78rem !important;
      }
      main { padding: 1.25rem 0.75rem !important; }
      #tab-dashboard .relative.overflow-hidden.rounded-\\[28px\\] {
        padding: 1.5rem !important;
      }
    }

    /* ═══════════════════════════════════════════════════ */
    /* ACCESSIBILITY                                           */
    /* ═══════════════════════════════════════════════════ */
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
  // 2. SIDEBAR — Floating Customer List
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
        <span id="premiumSidebarToggle" style="font-size:1.2rem;opacity:0.7;">⇄</span>
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
    }
  }

  function refreshSidebar() {
    const list = document.getElementById('premiumSidebarList');
    if (!list || _sidebarCollapsed) return;

    const month = state.workingMonth;
    const counts = {};
    (state.trips || []).forEach(t => {
      if (!t.date || !t.date.startsWith(month)) return;
      counts[t.customerId] = (counts[t.customerId] || 0) + 1;
    });

    const customers = (state.customers || [])
      .map(c => ({ ...c, count: counts[c.id] || 0 }))
      .sort((a, b) => b.count - a.count);

    if (!customers.length) {
      list.innerHTML = '<div style="padding:1rem;text-align:center;color:#94a3b8;font-size:0.8rem;">אין לקוחות</div>';
      return;
    }

    list.innerHTML = customers.map(c => `
      <div class="premium-customer-row" onclick="window.__sidebarOpenCustomer('${escAttr(c.id)}')">
        <span class="cust-name">${escHtml(c.name)}</span>
        <span class="cust-count">${c.count}</span>
      </div>
    `).join('');
  }

  window.__sidebarOpenCustomer = function (cid) {
    // קרא לפונקציה הקיימת של עריכת לקוח
    if (typeof window.editCustomer === 'function') {
      window.editCustomer(cid);
    }
  };

  function escAttr(s) {
    return String(s || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
  }
  function escHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  // ============================================================
  // 3. DASHBOARD ENHANCEMENT — rings, charts
  // ============================================================
  function enhanceDashboard() {
    // החלף את "הכנסות לפי לקוח" בגרף עמודות מונפש
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

    // הוסף KPI "ללא מחיר"
    injectMissingPriceKPI();
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
      box.innerHTML = '<p class="text-slate-400 text-sm">אין נתונים</p>';
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
          <div class="premium-bar-value">${v.count} · ${(v.sum).toLocaleString('he-IL')}₪</div>
        </div>
      `;
    }).join('');
  }

  function injectMissingPriceKPI() {
    const grid = document.querySelector('#tab-dashboard .grid.sm\\:grid-cols-2.lg\\:grid-cols-4');
    if (!grid || grid.dataset.premiumKpi) return;
    grid.dataset.premiumKpi = '1';

    const month = state.workingMonth;
    const missing = (state.trips || []).filter(t =>
      t.date && t.date.startsWith(month) && (!t.price || t.price === 0)
    ).length;

    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl border border-slate-200 p-5 shadow-sm';
    card.innerHTML = `
      <div class="flex items-start justify-between">
        <div>
          <div class="text-xs font-medium text-slate-500 mb-2">נסיעות ללא מחיר</div>
          <div class="text-2xl font-bold ${missing > 0 ? 'text-amber-600' : 'text-emerald-600'}">${missing}</div>
          ${missing > 0 ? '<div class="text-xs text-amber-600 mt-1">⚠️ דורש טיפול</div>' : '<div class="text-xs text-emerald-600 mt-1">✓ הכל מלא</div>'}
        </div>
        <div class="w-10 h-10 rounded-xl ${missing > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'} flex items-center justify-center text-lg">
          ${missing > 0 ? '⚠️' : '✓'}
        </div>
      </div>
    `;
    grid.appendChild(card);
  }

  // ============================================================
  // 4. EVENT HOOKS — refresh on changes
  // ============================================================
  function hookRefresh() {
    // עטוף showTab
    const origShowTab = window.showTab;
    if (typeof origShowTab === 'function' && !origShowTab.__premium) {
      const wrapped = function (name) {
        const r = origShowTab.apply(this, arguments);
        if (name === 'dashboard') {
          setTimeout(enhanceDashboard, 200);
        }
        if (name === 'customers') {
          setTimeout(refreshSidebar, 200);
        }
        return r;
      };
      wrapped.__premium = true;
      window.showTab = wrapped;
    }

    // עטוף saveState לדחיפת רענון לסרגל
    const origSave = window.saveState;
    if (typeof origSave === 'function' && !origSave.__premium) {
      const wrapped = function () {
        const r = origSave.apply(this, arguments);
        setTimeout(refreshSidebar, 500);
        setTimeout(() => {
          const dashTab = document.getElementById('tab-dashboard');
          if (dashTab && !dashTab.classList.contains('hidden')) {
            const byC = document.getElementById('dashByCustomer');
            const rt = document.getElementById('dashRoutes');
            if (byC) { byC.dataset.premium = ''; }
            if (rt) { rt.dataset.premium = ''; }
            enhanceDashboard();
          }
        }, 600);
        return r;
      };
      wrapped.__premium = true;
      window.saveState = wrapped;
    }
  }

  // ============================================================
  // 5. HEADER ENHANCEMENT — Modern touches
  // ============================================================
  function enhanceHeader() {
    const header = document.querySelector('header');
    if (!header || header.dataset.premium === '1') return;
    header.dataset.premium = '1';
    // הוסף אפקט זוהר
    header.style.position = 'sticky';
    header.style.top = '0';
    header.style.zIndex = '50';
  }

  // ============================================================
  // 6. BOOT
  // ============================================================
  function boot() {
    injectPremiumStyles();
    enhanceHeader();
    buildSidebar();
    hookRefresh();

    // המתן שה-state יהיה זמין
    let tries = 0;
    const waitForState = () => {
      tries++;
      if (state && Array.isArray(state.customers) && state.customers.length) {
        refreshSidebar();
        enhanceDashboard();
      } else if (tries < 30) {
        setTimeout(waitForState, 300);
      }
    };
    waitForState();

    // רענון תקופתי של הסרגל
    setInterval(refreshSidebar, 15000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 800));
  } else {
    setTimeout(boot, 800);
  }
  window.addEventListener('load', () => {
    setTimeout(boot, 600);
  });

})();
