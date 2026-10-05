// ============================================================
// app-upgrade-3.js — Dashboard Today + Smart Alerts + Gemini V2
// ============================================================
// מכיל:
//   1. אינדיקטור חיבור אמיתי + כפתור "בדוק סנכרון"
//   2. "מה חסר לי החודש" — דשבורד חכם עם התראות מבוססות דפוסים
//   3. Gemini V2 — fallback אוטומטי בין 4 מודלים
// ============================================================

(function () {
  'use strict';

  // ============================================================
  // HELPERS
  // ============================================================
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }
  function fmtMoney(n) { return (n || 0).toLocaleString('he-IL') + ' ₪'; }
  function toastMsg(msg, ms) { if (typeof toast === 'function') toast(msg, ms || 3000); }
  function getCust(cid) { return typeof getCustomer === 'function' ? getCustomer(cid) : null; }
  function curMonth() {
    if (typeof state === 'object' && state.workingMonth) return state.workingMonth;
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  }

  // ============================================================
  // 1. REAL CONNECTION INDICATOR
  // ============================================================
  function formatRelative(ts) {
    if (!ts) return 'אף פעם';
    const s = Math.round((Date.now() - ts) / 1000);
    if (s < 5) return 'עכשיו';
    if (s < 60) return `לפני ${s} שניות`;
    if (s < 3600) return `לפני ${Math.round(s/60)} דק׳`;
    if (s < 86400) return `לפני ${Math.round(s/3600)} שעות`;
    return `לפני ${Math.round(s/86400)} ימים`;
  }

  function updateHeaderIndicator(status) {
    const el = document.getElementById('cloudHeaderEmail');
    const pill = document.getElementById('cloudHeaderStatus');
    if (!el || !pill) return;

    const s = status.status;
    let dotColor = '#94a3b8';
    let dotGlow = 'rgba(148,163,184,.14)';
    let label = 'בודק…';
    let title = '';

    if (s === 'ok') {
      dotColor = '#34d399';
      dotGlow = 'rgba(52,211,153,.14)';
      label = `☁️ נשמר ${formatRelative(status.lastSaveAt)}`;
      title = `מחובר לענן\nRoom: ${status.roomId || ''}\nשמירה אחרונה: ${status.lastSaveAt ? new Date(status.lastSaveAt).toLocaleTimeString('he-IL') : '—'}\nקריאה אחרונה: ${status.lastReadAt ? new Date(status.lastReadAt).toLocaleTimeString('he-IL') : '—'}`;
    } else if (s === 'retry' || s === 'init') {
      dotColor = '#fbbf24';
      dotGlow = 'rgba(251,191,36,.14)';
      label = '⏳ מתחבר…';
    } else if (s === 'error') {
      dotColor = '#ef4444';
      dotGlow = 'rgba(239,68,68,.18)';
      label = '⚠️ מנותק — מקומי';
      title = 'שגיאה: ' + (status.error || 'לא ידוע') + '\nהנתונים נשמרים מקומית בלבד';
    } else if (s === 'local') {
      dotColor = '#f59e0b';
      dotGlow = 'rgba(245,158,11,.16)';
      label = '💾 מקומי בלבד';
      title = 'הסנכרון לא פעיל';
    }

    el.textContent = label;
    pill.title = title;
    pill.style.cursor = 'pointer';
    pill.onclick = () => openSyncDiagnostics();

    const dot = pill.querySelector('.cloud-dot');
    if (dot) {
      dot.style.background = dotColor;
      dot.style.boxShadow = `0 0 0 4px ${dotGlow}`;
    }
  }

  function openSyncDiagnostics() {
    if (document.getElementById('syncDiagModal')) return;
    const cs = window.CloudSync;
    const status = cs?.status || 'unknown';

    const html = `
      <div id="syncDiagModal" class="fixed inset-0 z-[280] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" style="-webkit-backdrop-filter: blur(8px);">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg modal-enter">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">☁️ בדיקת חיבור לענן</h3>
              <p class="text-xs text-slate-500 mt-0.5">מאמת שהסנכרון אמיתי — לא רק מציג נקודה ירוקה</p>
            </div>
            <button onclick="document.getElementById('syncDiagModal').remove()" class="text-3xl text-slate-400 hover:text-slate-700 leading-none">&times;</button>
          </div>
          <div id="syncDiagBody" class="p-5 space-y-3 text-sm">
            <div class="flex items-center gap-2"><span class="w-4 text-slate-400">•</span><span>סטטוס נוכחי: <b>${esc(status)}</b></span></div>
            <div class="flex items-center gap-2"><span class="w-4 text-slate-400">•</span><span>Room ID: <code class="text-xs bg-slate-100 px-1.5 py-0.5 rounded">${esc(cs?.roomId || '—')}</code></span></div>
            <div class="flex items-center gap-2"><span class="w-4 text-slate-400">•</span><span>שמירה אחרונה: <b>${cs?.lastSaveAt ? new Date(cs.lastSaveAt).toLocaleString('he-IL') : '—'}</b></span></div>
            <div class="flex items-center gap-2"><span class="w-4 text-slate-400">•</span><span>קריאה אחרונה: <b>${cs?.lastReadAt ? new Date(cs.lastReadAt).toLocaleString('he-IL') : '—'}</b></span></div>
            <div id="syncDiagResult" class="hidden mt-3"></div>
          </div>
          <div class="px-5 py-3 border-t border-slate-200 flex flex-wrap gap-2 justify-end">
            <button onclick="window.__syncForceSave()" class="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-2 rounded-xl">☁️ שמור עכשיו</button>
            <button onclick="window.__syncVerify()" id="syncVerifyBtn" class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-xl font-medium">🔍 בדוק סנכרון אמיתי</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  window.__syncForceSave = async function () {
    try {
      if (typeof getPersistedState === 'function' && window.CloudSync) {
        await window.CloudSync.saveNow(getPersistedState());
        toastMsg('✅ נשמר לענן בהצלחה');
      }
    } catch (e) {
      toastMsg('⚠️ שמירה נכשלה: ' + (e.message || e));
    }
  };

  window.__syncVerify = async function () {
    const btn = document.getElementById('syncVerifyBtn');
    const box = document.getElementById('syncDiagResult');
    if (!btn || !box) return;
    btn.disabled = true;
    btn.textContent = '⏳ בודק…';
    box.classList.remove('hidden');
    box.innerHTML = '<div class="text-slate-500">שולח פינג לשרת וממתין לאימות...</div>';

    const r = await window.CloudSync.verifySync();

    if (r.ok) {
      box.innerHTML = `
        <div class="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-3">
          <div class="font-semibold mb-1">✅ סנכרון אמיתי מאומת</div>
          <div class="text-xs space-y-0.5">
            <div>השרת קיבל את הנתונים והחזיר אותם תואמים</div>
            <div>⏱️ זמן round-trip: ${r.ping}ms</div>
            <div>🔑 מזהה אימות: ${esc(r.marker)}</div>
          </div>
        </div>`;
    } else {
      box.innerHTML = `
        <div class="bg-red-50 border border-red-200 text-red-900 rounded-xl p-3">
          <div class="font-semibold mb-1">❌ הבדיקה נכשלה</div>
          <div class="text-xs">${esc(r.reason || 'שגיאה לא ידועה')}</div>
        </div>`;
    }

    btn.disabled = false;
    btn.textContent = '🔍 בדוק סנכרון אמיתי';
  };

  // ============================================================
  // 2. SMART ALERTS — "מה חסר לי החודש"
  // ============================================================
  function analyzeMissingPatterns() {
    const month = curMonth();
    const [y, mo] = month.split('-').map(Number);
    const daysInMonth = new Date(y, mo, 0).getDate();

    const patterns = {};
    const now = new Date(y, mo - 1, 1);
    const twoMonthsAgo = new Date(now); twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    const fromDate = twoMonthsAgo.toISOString().slice(0, 7);

    (state.trips || []).forEach(t => {
      if (!t.date || t.date < fromDate + '-01' || t.date >= month) return;
      if (!t.customerId || !t.line || !t.columnKey) return;
      const key = t.customerId + '|' + t.line + '|' + t.columnKey;
      if (!patterns[key]) {
        patterns[key] = {
          customerId: t.customerId,
          line: t.line,
          columnKey: t.columnKey,
          daysOfWeek: {},
          totalCount: 0,
          prices: []
        };
      }
      const d = new Date(t.date);
      const dow = d.getDay();
      patterns[key].daysOfWeek[dow] = (patterns[key].daysOfWeek[dow] || 0) + 1;
      patterns[key].totalCount++;
      if (t.price > 0) patterns[key].prices.push(t.price);
    });

    const strongPatterns = Object.values(patterns).filter(p => {
      const activeDows = Object.entries(p.daysOfWeek).filter(([_, n]) => n >= 2).map(([d]) => +d);
      return activeDows.length > 0 && p.totalCount >= 4;
    });

    const missing = [];
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === y && (today.getMonth() + 1) === mo;
    const lastDayToCheck = isCurrentMonth ? today.getDate() : daysInMonth;

    strongPatterns.forEach(p => {
      const activeDows = Object.entries(p.daysOfWeek)
        .filter(([_, n]) => n >= 2)
        .map(([d]) => +d);

      const monthTrips = (state.trips || []).filter(t =>
        t.date && t.date.startsWith(month) &&
        t.customerId === p.customerId &&
        t.line === p.line &&
        t.columnKey === p.columnKey
      );
      const existingDates = new Set(monthTrips.map(t => t.date));

      const missingDates = [];
      for (let day = 1; day <= lastDayToCheck; day++) {
        const d = new Date(y, mo - 1, day);
        if (!activeDows.includes(d.getDay())) continue;
        const ds = `${month}-${String(day).padStart(2, '0')}`;
        if (!existingDates.has(ds)) missingDates.push(ds);
      }

      if (missingDates.length > 0) {
        const avgPrice = p.prices.length ? Math.round(p.prices.reduce((a,b) => a+b, 0) / p.prices.length) : 0;
        missing.push({
          ...p,
          missingDates,
          missingCount: missingDates.length,
          totalExpected: missingDates.length + existingDates.size,
          avgPrice,
          estimatedLoss: avgPrice * missingDates.length
        });
      }
    });

    missing.sort((a, b) => b.estimatedLoss - a.estimatedLoss);
    return missing;
  }

  function renderSmartAlerts() {
    const missing = analyzeMissingPatterns();
    if (!missing.length) {
      return `
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold text-slate-900">🔍 בדיקת חוסרים</h3>
            <span class="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">✓ הכל מלא</span>
          </div>
          <div class="text-sm text-slate-500">
            לא זוהו חוסרים בדפוסים הקבועים של הלקוחות. כל הנסיעות הצפויות הוזנו.
          </div>
        </div>`;
    }

    const totalMissing = missing.reduce((s, m) => s + m.missingCount, 0);
    const totalLoss = missing.reduce((s, m) => s + m.estimatedLoss, 0);
    const top = missing.slice(0, 8);

    return `
      <div class="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
        <div class="bg-gradient-to-l from-amber-50 to-orange-50 px-5 py-3 border-b border-amber-200">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 class="font-bold text-amber-900 flex items-center gap-2">
                ⚠️ חוסרים שזוהו החודש
              </h3>
              <p class="text-xs text-amber-700 mt-0.5">לפי דפוסים קבועים של 2 החודשים האחרונים</p>
            </div>
            <div class="flex gap-3 text-sm">
              <div class="text-center">
                <div class="text-xs text-amber-700">חוסרים</div>
                <div class="font-bold text-amber-900">${totalMissing}</div>
              </div>
              <div class="text-center">
                <div class="text-xs text-amber-700">הפסד משוער</div>
                <div class="font-bold text-amber-900">${fmtMoney(totalLoss)}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="divide-y divide-slate-100">
          ${top.map(m => {
            const c = getCust(m.customerId);
            const dayNames = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'];
            const activeDows = Object.entries(m.daysOfWeek)
              .filter(([_, n]) => n >= 2)
              .map(([d]) => dayNames[+d]).join(', ');
            const dates = m.missingDates.slice(0, 6).map(d => parseInt(d.slice(8), 10)).join(', ');
            const more = m.missingDates.length > 6 ? ` +${m.missingDates.length - 6}` : '';
            return `
              <div class="p-4 hover:bg-amber-50/50 transition">
                <div class="flex items-start justify-between gap-3 flex-wrap">
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold text-slate-900">${esc(c ? c.name : m.customerId)} <span class="text-xs text-slate-400 font-normal">· קו ${esc(m.line)} · ${esc(m.columnKey)}</span></div>
                    <div class="text-xs text-slate-500 mt-1">
                      צפוי בימים: ${activeDows} · חסר: ${dates}${more}
                    </div>
                    <div class="text-xs text-amber-700 mt-1">
                      ⚠️ ${m.missingCount} ימים חסרים · הפסד משוער: ${fmtMoney(m.estimatedLoss)}
                    </div>
                  </div>
                  <button onclick="window.__fillMissing('${esc(m.customerId)}','${esc(m.line)}','${esc(m.columnKey)}')"
                    class="shrink-0 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg font-medium">
                    מלא אוטומטית
                  </button>
                </div>
              </div>`;
          }).join('')}
        </div>
        ${missing.length > 8 ? `
          <div class="px-5 py-3 bg-slate-50 text-xs text-slate-500 text-center">
            ועוד ${missing.length - 8} חוסרים נוספים...
          </div>` : ''}
      </div>`;
  }

  window.__fillMissing = function (customerId, line, columnKey) {
    const missing = analyzeMissingPatterns();
    const p = missing.find(m => m.customerId === customerId && m.line === line && m.columnKey === columnKey);
    if (!p) { toastMsg('לא נמצאו חוסרים'); return; }

    const c = getCust(customerId);
    const n = p.missingDates.length;
    const total = p.estimatedLoss;

    if (!confirm(`למלא ${n} נסיעות חסרות עבור ${c?.name || customerId}?\nקו: ${line} · ${columnKey}\nמחיר ממוצע: ${fmtMoney(p.avgPrice)}\nסה״כ: ${fmtMoney(total)}`)) return;

    const priceListHit = (c?.priceList || []).find(pl =>
      (pl.origin === line && pl.destination === columnKey) ||
      (pl.destination === columnKey)
    );
    const price = priceListHit?.price || p.avgPrice || 0;

    if (!price) { toastMsg('לא נמצא מחיר מוגדר למילוי — עדכן במחירון'); return; }

    const uidFn = typeof uid === 'function' ? uid : (() => 'u_' + Date.now() + Math.random().toString(36).slice(2,7));
    let added = 0;
    p.missingDates.forEach(ds => {
      (state.trips || []).push({
        id: uidFn(),
        customerId,
        line,
        columnKey,
        date: ds,
        price,
        route: `${line} · ${columnKey}`,
        origin: line,
        destination: columnKey,
        notes: 'מילוי אוטומטי',
        driver: '',
        source: 'auto-fill',
        createdAt: new Date().toISOString()
      });
      added++;
    });

    if (typeof saveState === 'function') saveState();
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderTrips === 'function') renderTrips();
    toastMsg(`✅ נוספו ${added} נסיעות · ${fmtMoney(added * price)}`);
  };

  // ============================================================
  // 3. INJECT INTO DASHBOARD
  // ============================================================
  function injectDashboardWidgets() {
    const tab = document.getElementById('tab-dashboard');
    if (!tab || tab.dataset.upgrade3 === '1') return;
    tab.dataset.upgrade3 = '1';

    const grid = tab.querySelector('.grid.sm\\:grid-cols-2.lg\\:grid-cols-4');
    if (grid) {
      const wrap = document.createElement('div');
      wrap.id = 'smartAlertsBox';
      wrap.className = 'mt-6 mb-6';
      grid.parentNode.insertBefore(wrap, grid.nextSibling);
    }

    refreshSmartAlerts();
  }

  function refreshSmartAlerts() {
    const box = document.getElementById('smartAlertsBox');
    if (!box) return;
    try {
      box.innerHTML = renderSmartAlerts();
    } catch (e) {
      console.error(e);
      box.innerHTML = '<div class="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">שגיאה בטעינת התראות: ' + esc(e.message || e) + '</div>';
    }
  }

  // ============================================================
  // 4. GEMINI V2 — Multi-model fallback
  // ============================================================
  const GEMINI_MODELS = [
    'gemini-flash-latest',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite'
  ];

  async function geminiCall(prompt, maxTokens) {
    const key = (typeof state === 'object' && state.geminiApiKey) || '';
    if (!key) throw new Error('אין מפתח Gemini בהגדרות');

    let lastErr = null;
    for (const model of GEMINI_MODELS) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const resp = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                  temperature: 0.1,
                  maxOutputTokens: maxTokens || 1024,
                  responseMimeType: 'application/json'
                }
              })
            }
          );
          const data = await resp.json();
          if (resp.ok) {
            let raw = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
            raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
            console.log(`✅ Gemini הצליח עם ${model}`);
            return JSON.parse(raw);
          }
          lastErr = data?.error?.message || ('HTTP ' + resp.status);
          // אם זה high demand / rate limit → נסה את המודל הבא
          if (/high demand|quota|rate|unavailable|overload|503|429/i.test(lastErr)) {
            console.log(`⏭️ ${model} עמוס — עובר למודל הבא`);
            break;
          }
          // שגיאה אחרת — נסה שוב פעם אחת
          if (attempt === 1) {
            await new Promise(r => setTimeout(r, 800));
            continue;
          }
          break;
        } catch (e) {
          lastErr = e.message || String(e);
          if (attempt === 1) await new Promise(r => setTimeout(r, 500));
        }
      }
    }
    throw new Error('כל המודלים עמוסים כרגע — נסה שוב בעוד דקה');
  }

  async function geminiSmartParse(message, customerName) {
    const prompt = `אתה מפרסר הודעות נסיעה בעברית. ההודעה הבאה הגיעה מנהג / מזכיר.
חלץ JSON בלבד בפורמט:
{
  "date": "YYYY-MM-DD או null",
  "price": מספר או null,
  "route": "מסלול בעברית או null",
  "orderer": "שם המזמין או null",
  "notes": "הערות או null",
  "confidence": 0-1
}

כללים:
- תאריך ברירת מחדל: ${new Date().toISOString().slice(0,10)}
- קיצורים: בב=בני ברק, ים=ירושלים, ספר=מודיעין עילית, שמש=בית שמש, פת=פתח תקווה, שדה=שדה תעופה, טלז=טלזסטון
- "הלוש" = הלוך ושוב. הוסף להערות.
- "סיינה" = השכרה לפי שעה. הוסף להערות.
- "ספיישל" / "ספרינטר" / "תחנות" / "המתנה" = הערות
- מזמין הוא לרוב שם או כינוי. אם זה מספר טלפון — השאר null והעבר להערות.

לקוח משויך (אם ידוע): ${customerName || 'לא ידוע'}

ההודעה:
"""
${message}
"""

החזר JSON בלבד, ללא הסברים.`;
    return geminiCall(prompt, 512);
  }

  async function geminiMonthAnalysis() {
    const month = curMonth();
    const trips = (state.trips || []).filter(t => t.date && t.date.startsWith(month));
    const total = trips.reduce((s, t) => s + (t.price || 0), 0);
    const byCustomer = {};
    trips.forEach(t => {
      const c = getCust(t.customerId);
      const name = c ? c.name : t.customerId;
      if (!byCustomer[name]) byCustomer[name] = { count: 0, sum: 0, routes: {} };
      byCustomer[name].count++;
      byCustomer[name].sum += t.price || 0;
      const route = t.columnKey || t.route || '—';
      byCustomer[name].routes[route] = (byCustomer[name].routes[route] || 0) + 1;
    });

    const summary = {
      month,
      totalTrips: trips.length,
      totalRevenue: total,
      customers: Object.entries(byCustomer).map(([name, v]) => ({
        name,
        trips: v.count,
        revenue: v.sum,
        topRoutes: Object.entries(v.routes).sort((a,b) => b[1] - a[1]).slice(0, 3).map(([r, n]) => `${r}: ${n}`)
      }))
    };

    const missing = analyzeMissingPatterns();

    const prompt = `אתה אנליסט עסקי של חברת הסעות. קיבלת סיכום חודשי + חוסרים שזוהו.

סיכום חודשי ${month}:
${JSON.stringify(summary, null, 2)}

חוסרים שזוהו בדפוסים:
${JSON.stringify(missing.slice(0, 5).map(m => ({
  customer: getCust(m.customerId)?.name || m.customerId,
  line: m.line,
  time: m.columnKey,
  missingDays: m.missingCount,
  estimatedLoss: m.estimatedLoss
})), null, 2)}

החזר JSON בפורמט:
{
  "headline": "כותרת קצרה בעברית של 4-8 מילים",
  "summary": "סיכום של 2-3 משפטים",
  "insights": [
    { "icon": "emoji", "text": "תובנה קצרה" }
  ],
  "actions": [
    { "priority": "high|medium|low", "text": "פעולה מומלצת" }
  ]
}

התייחס ל:
- מגמות (גדילה / ירידה)
- לקוחות בולטים
- חוסרים שחשוב למלא
- אי-סדרים אפשריים
- המלצות לפעולה

ענה בעברית, JSON בלבד.`;

    return geminiCall(prompt, 1024);
  }

  function injectAIParseButton() {
    const pasteArea = document.getElementById('pasteArea');
    if (!pasteArea || document.getElementById('aiParseBtn')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'aiParseBtn';
    btn.className = 'mt-2 w-full bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm py-2.5 rounded-xl transition font-medium';
    btn.innerHTML = '✨ נתח עם Gemini AI (מדויק יותר)';
    btn.onclick = window.__aiParseMessage;
    pasteArea.insertAdjacentElement('afterend', btn);
  }

  window.__aiParseMessage = async function () {
    const text = (document.getElementById('pasteArea')?.value || '').trim();
    if (!text) { toastMsg('הדבק הודעה קודם'); return; }

    const key = (typeof state === 'object' && state.geminiApiKey) || '';
    if (!key) {
      toastMsg('⚠️ אין מפתח Gemini — הגדר בהגדרות');
      return;
    }

    const custSel = document.getElementById('formCustomer');
    const custId = custSel?.value;
    const custName = custId ? (getCust(custId)?.name || '') : '';

    const btn = document.getElementById('aiParseBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '⏳ Gemini מפרסר...';
    }

    try {
      const result = await geminiSmartParse(text, custName);
      if (result.date) { const el = document.getElementById('formDate'); if (el) el.value = result.date; }
      if (result.price) { const el = document.getElementById('formPrice'); if (el) el.value = result.price; }
      if (result.route) { const el = document.getElementById('formRoute'); if (el) el.value = result.route; }
      if (result.orderer) { const el = document.getElementById('formDriver'); if (el) el.value = result.orderer; }
      if (result.notes) { const el = document.getElementById('formNotes'); if (el) el.value = result.notes; }

      toastMsg(`✨ Gemini פירסר בהצלחה (ביטחון: ${Math.round((result.confidence || 0) * 100)}%)`, 3500);
      try { if (typeof refreshPriceSuggestion === 'function') refreshPriceSuggestion(); } catch (_) {}
      try { if (typeof applyOrdererSuggestion === 'function') applyOrdererSuggestion(); } catch (_) {}
    } catch (e) {
      console.error(e);
      toastMsg('⚠️ Gemini נכשל: ' + (e.message || e), 5000);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '✨ נתח עם Gemini AI (מדויק יותר)';
      }
    }
  };

  function injectAIAnalysisCard() {
    const tab = document.getElementById('tab-dashboard');
    if (!tab || tab.dataset.aiAnalysis === '1') return;
    tab.dataset.aiAnalysis = '1';

    const hero = tab.querySelector('.relative.overflow-hidden.rounded-\\[28px\\]');
    if (!hero) return;

    const card = document.createElement('div');
    card.id = 'aiAnalysisCard';
    card.className = 'mb-6';
    card.innerHTML = `
      <div class="bg-gradient-to-l from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-5">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 class="font-bold text-purple-900 flex items-center gap-2">✨ ניתוח חודשי AI</h3>
            <p class="text-xs text-purple-700 mt-0.5">תובנות, מגמות והמלצות על סמך נתוני החודש</p>
          </div>
          <button onclick="window.__runAIMonthAnalysis()" id="aiMonthBtn" class="bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm px-4 py-2.5 rounded-xl font-medium transition">
            🤖 נתח עכשיו
          </button>
        </div>
        <div id="aiMonthResult" class="mt-4"></div>
      </div>
    `;
    hero.parentNode.insertBefore(card, hero.nextSibling);
  }

  window.__runAIMonthAnalysis = async function () {
    const box = document.getElementById('aiMonthResult');
    const btn = document.getElementById('aiMonthBtn');
    if (!box || !btn) return;

    const key = (typeof state === 'object' && state.geminiApiKey) || '';
    if (!key) {
      box.innerHTML = `<div class="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 text-sm">⚠️ יש להגדיר מפתח Gemini בהגדרות תחילה.</div>`;
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '⏳ מנתח...';
    box.innerHTML = '<div class="text-sm text-purple-700">שולח נתונים ל-Gemini (עשוי לנסות כמה מודלים)...</div>';

    try {
      const result = await geminiMonthAnalysis();
      box.innerHTML = `
        <div class="bg-white rounded-xl border border-purple-200 p-5">
          <h4 class="font-bold text-purple-900 text-lg mb-2">${esc(result.headline || 'ניתוח חודשי')}</h4>
          <p class="text-sm text-slate-700 mb-4">${esc(result.summary || '')}</p>

          ${result.insights && result.insights.length ? `
          <div class="mb-4">
            <div class="text-xs font-semibold text-slate-500 mb-2">תובנות</div>
            <div class="space-y-1.5">
              ${result.insights.map(i => `
                <div class="flex items-start gap-2 text-sm">
                  <span class="text-lg shrink-0">${esc(i.icon || '•')}</span>
                  <span class="text-slate-700">${esc(i.text)}</span>
                </div>`).join('')}
            </div>
          </div>` : ''}

          ${result.actions && result.actions.length ? `
          <div>
            <div class="text-xs font-semibold text-slate-500 mb-2">פעולות מומלצות</div>
            <div class="space-y-1.5">
              ${result.actions.map(a => {
                const colors = a.priority === 'high' ? 'bg-red-50 border-red-200 text-red-900' :
                               a.priority === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                               'bg-slate-50 border-slate-200 text-slate-700';
                return `<div class="border ${colors} rounded-lg px-3 py-2 text-sm">${esc(a.text)}</div>`;
              }).join('')}
            </div>
          </div>` : ''}
        </div>`;
    } catch (e) {
      console.error(e);
      box.innerHTML = `<div class="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">⚠️ ${esc(e.message || e)}</div>`;
    } finally {
      btn.disabled = false;
      btn.innerHTML = '🤖 נתח עכשיו';
    }
  };

  // ============================================================
  // BOOT
  // ============================================================
  function boot() {
    if (window.CloudSync && typeof window.CloudSync.onStatusChange === 'function') {
      window.CloudSync.onStatusChange(updateHeaderIndicator);
    } else {
      setTimeout(boot, 1000);
      return;
    }

    const origShowTab = window.showTab;
    if (typeof origShowTab === 'function' && !origShowTab.__upgrade3) {
      const wrapped = function (name) {
        const r = origShowTab.apply(this, arguments);
        if (name === 'dashboard') {
          setTimeout(injectDashboardWidgets, 100);
          setTimeout(injectAIAnalysisCard, 150);
          setTimeout(refreshSmartAlerts, 200);
        }
        return r;
      };
      wrapped.__upgrade3 = true;
      window.showTab = wrapped;
    }

    setTimeout(injectAIParseButton, 1200);
    setTimeout(injectDashboardWidgets, 1500);
    setTimeout(injectAIAnalysisCard, 1800);

    setInterval(() => {
      if (window.CloudSync) {
        updateHeaderIndicator({
          status: window.CloudSync.status,
          lastSaveAt: window.CloudSync.lastSaveAt,
          lastReadAt: window.CloudSync.lastReadAt,
          roomId: window.CloudSync.roomId
        });
      }
    }, 10000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 500));
  } else {
    setTimeout(boot, 500);
  }
  window.addEventListener('load', () => {
    setTimeout(injectAIParseButton, 800);
    setTimeout(injectDashboardWidgets, 1200);
    setTimeout(injectAIAnalysisCard, 1400);
  });

})();
