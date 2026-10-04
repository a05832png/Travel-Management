// ============================================================
// app-upgrade-2.js — Comprehensive upgrade pack
// ============================================================
// מכיל:
//   Fix  ייבוא אקסל V2 (multi-sheet, cellFormula:false, נרמול שמות)
//   Fix  ייבוא וואטסאפ V2 (ZIP, פורמטים נוספים, סינון חכם)
//   Fix  מנגנון למידה V2 (סף אישורים, orderer count, סינון טלפונים)
//   #10  PDF חשבונית
//   #12  דוח חודשי השוואתי
//   UX   חלופה 1 — למידה שקופה inline
// ============================================================

(function () {
  'use strict';

  // ============================================================
  // HELPERS
  // ============================================================
  function fmtMoney(n) { return (n || 0).toLocaleString('he-IL') + ' ₪'; }
  function fmtDate(iso) {
    if (!iso) return '';
    const [y, m, d] = String(iso).split('-');
    return `${d}/${m}/${y}`;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }
  function uidFn() {
    if (typeof uid === 'function') return uid();
    return 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function toastMsg(msg, ms) { if (typeof toast === 'function') toast(msg, ms || 2500); }
  function getCust(cid) {
    if (typeof getCustomer === 'function') return getCustomer(cid);
    return (state.customers || []).find(c => c.id === cid);
  }
  function curMonth() {
    if (typeof state === 'object' && state.workingMonth) return state.workingMonth;
    if (typeof currentMonthStr === 'function') return currentMonthStr();
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }
  function monthLabelHe(month) {
    const names = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
    const [y, m] = String(month).split('-').map(Number);
    return `${names[m - 1]} ${y}`;
  }
  function monthOffset(month, delta) {
    const [y, m] = String(month).split('-').map(Number);
    let ny = y, nm = m + delta;
    while (nm > 12) { nm -= 12; ny++; }
    while (nm < 1) { nm += 12; ny--; }
    return `${ny}-${String(nm).padStart(2, '0')}`;
  }
  function heMonthNum(s) {
    return { 'ינואר':1,'פברואר':2,'מרץ':3,'מרס':3,'אפריל':4,'מאי':5,'יוני':6,'יולי':7,'אוגוסט':8,'ספטמבר':9,'אוקטובר':10,'נובמבר':11,'דצמבר':12 }[s] || null;
  }
  function loadScriptOnce(url) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${url}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = url;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  const PHONE_RE = /^(?:\+?972|0)?[\d\-\s\(\)]{7,15}$/;
  function isPhoneNumber(s) {
    if (!s) return false;
    const c = String(s).replace(/[\s\-\(\)]/g, '');
    if (c.length < 9 || c.length > 13) return false;
    if (!/^\+?\d+$/.test(c)) return false;
    return PHONE_RE.test(String(s));
  }

  // ============================================================
  // 1. EXCEL IMPORT V2
  // ============================================================
  let _xlWorkbook = null;
  let _xlSheets = [];
  let _xlSheetIdx = 0;

  function normLine(s) {
    return String(s || '').replace(/["'׳"]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function matchCustomerLine(c, sheetName) {
    if (!c || !c.lines || !c.lines.length) return sheetName;
    const t = normLine(sheetName);
    let hit = c.lines.find(l => normLine(l) === t);
    if (hit) return hit;
    hit = c.lines.find(l => {
      const n = normLine(l);
      return n && (n.includes(t) || t.includes(n));
    });
    if (hit) return hit;
    const toks = t.split(' ').filter(x => x.length > 1);
    return c.lines.find(l => toks.some(tok => normLine(l).includes(tok))) || sheetName;
  }

  function parseXLDate(v) {
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
    m = t.match(/(\d{1,2})\s+ב?([א-ת]+)\s+(\d{4})/);
    if (m) {
      const mo = heMonthNum(m[2]);
      if (mo) return `${m[3]}-${String(mo).padStart(2,'0')}-${m[1].padStart(2,'0')}`;
    }
    m = t.match(/יום\s+\S+,?\s+(\d{1,2})\b/);
    if (m) return '__DAY__' + m[1];
    const n = parseFloat(t);
    if (!isNaN(n) && n > 30000 && n < 60000) {
      const d = new Date(Date.UTC(1899, 11, 30) + n * 86400000);
      return d.toISOString().slice(0, 10);
    }
    return null;
  }

  function detectHeaderRow(rows) {
    const hints = /תאריך|מחיר|תיאור|יעד|מוצא|הערות|מזמין|קו\s*\d|^\d{1,2}:\d{2}|פתיחה|הלוך|חזור/i;
    for (let i = 0; i < Math.min(5, rows.length); i++) {
      const row = rows[i];
      if (!row || row.length < 2) continue;
      const cells = row.map(c => String(c || '').trim()).filter(Boolean);
      if (cells.length >= 2 && cells.some(c => hints.test(c))) return i;
    }
    return 0;
  }

  function autoFieldForHeader(hs) {
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
    if (/קו\s*\d|^\d{1,2}:\d{2}|פתיחה|הלוך|חזור/i.test(hs)) return 'priceCol:' + hs;
    return 'skip';
  }

  // override: startExcelImport — קורא עם cellFormula:false
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
        _xlWorkbook = wb;
        _xlWorkbook.__mappings = {};
        _xlSheets = wb.SheetNames.map((name, idx) => {
          const ws = wb.Sheets[name];
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: true, blankrows: false });
          return { name, idx, rows };
        });

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

        window.__xlRenderMapping();
        document.getElementById('excelMappingBox')?.classList.remove('hidden');
        document.getElementById('excelPendingBox')?.classList.add('hidden');
        toastMsg('קובץ נטען: ' + _xlSheets.length + ' גיליונות');
      } catch (err) {
        console.error(err);
        toastMsg('שגיאה בקריאת הקובץ: ' + (err.message || err));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  window.__xlSelectSheet = function (idx) {
    _xlSheetIdx = parseInt(idx, 10) || 0;
    window.__xlRenderMapping();
  };

  window.__xlSetMap = function (colIdx, value) {
    const sheet = _xlSheets[_xlSheetIdx];
    if (!sheet || !_xlWorkbook.__mappings) return;
    _xlWorkbook.__mappings[sheet.name][colIdx] = value;
  };

  window.__xlRenderMapping = function () {
    const sheet = _xlSheets[_xlSheetIdx];
    if (!sheet) return;
    const rows = sheet.rows;
    const box = document.getElementById('excelMappingTable');
    if (!box) return;
    if (!rows.length) { box.innerHTML = '<div class="text-slate-400 text-sm p-2">גיליון ריק</div>'; return; }

    const headerIdx = detectHeaderRow(rows);
    const header = rows[headerIdx] || [];

    if (!_xlWorkbook.__mappings[sheet.name]) {
      _xlWorkbook.__mappings[sheet.name] = {};
      header.forEach((h, i) => {
        const hs = String(h || '').trim();
        _xlWorkbook.__mappings[sheet.name][i] = hs ? autoFieldForHeader(hs) : 'skip';
      });
    }
    const mapping = _xlWorkbook.__mappings[sheet.name];

    const sheetOpts = _xlSheets.map((s, i) =>
      `<option value="${i}" ${i === _xlSheetIdx ? 'selected' : ''}>${esc(s.name)} (${s.rows.length} שורות)</option>`
    ).join('');

    let html = `
      <div class="flex flex-wrap gap-2 items-center mb-3">
        <label class="text-xs text-slate-500">גיליון:</label>
        <select onchange="window.__xlSelectSheet(this.value)" class="border border-slate-300 rounded-lg px-2 py-1 text-sm">${sheetOpts}</select>
        <span class="text-xs text-slate-400">שורת כותרת: ${headerIdx + 1}</span>
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
        return `<option value="${esc(v)}" ${isSel ? 'selected' : ''}>${esc(l)}</option>`;
      }).join('');
      html += `<tr>
        <td class="border px-2 py-1">${esc(hs)}</td>
        <td class="border px-2 py-1"><select data-col="${i}" onchange="window.__xlSetMap(${i}, this.value)" class="border rounded px-1 py-0.5 text-xs w-full">${opts}</select></td>
      </tr>`;
    });
    html += '</tbody></table>';
    box.innerHTML = html;
  };

  // override: runExcelParse — מיפוי לפי גיליון
  window.runExcelParse = function () {
    if (!_xlWorkbook || !_xlSheets.length) return;
    const customerId = document.getElementById('excelCustomer')?.value || '';
    const batchId = 'IMP-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 6);
    if (typeof _importBatchId !== 'undefined') _importBatchId = batchId;

    const pending = [];
    const c = customerId ? getCust(customerId) : null;
    const [y, mo] = curMonth().split('-').map(Number);
    const daysInMonth = new Date(y, mo, 0).getDate();

    _xlSheets.forEach(sheet => {
      if (/סה.?כ|סיכום|total/i.test(sheet.name)) return;
      const rows = sheet.rows;
      if (!rows.length) return;
      const headerIdx = detectHeaderRow(rows);
      const header = rows[headerIdx] || [];
      const mapping = (_xlWorkbook.__mappings && _xlWorkbook.__mappings[sheet.name]) || {};

      const cols = { date: -1, price: -1, route: -1, origin: -1, destination: -1, driver: -1, notes: -1, orderNum: -1 };
      const priceCols = [];
      Object.entries(mapping).forEach(([i, f]) => {
        const idx = +i;
        if (!f || f === 'skip') return;
        if (String(f).startsWith('priceCol:')) { priceCols.push({ idx, name: String(f).replace('priceCol:', '') }); return; }
        if (cols[f] === -1) cols[f] = idx;
      });

      const dateCol = cols.date >= 0 ? cols.date : 0;
      const lineName = c ? matchCustomerLine(c, sheet.name) : sheet.name;
      const isMatrix = priceCols.length >= 1 && priceCols.some(pc => pc.idx > dateCol);

      for (let r = headerIdx + 1; r < rows.length; r++) {
        const row = rows[r];
        if (!row || !row.length) continue;
        let date = parseXLDate(row[dateCol]);
        if (date && date.startsWith('__DAY__')) {
          const day = parseInt(date.replace('__DAY__', ''), 10);
          date = (day >= 1 && day <= daysInMonth) ? `${curMonth()}-${String(day).padStart(2, '0')}` : null;
        }

        const rowNotes = cols.notes >= 0 ? String(row[cols.notes] || '').trim() : '';
        const rowDriver = cols.driver >= 0 ? String(row[cols.driver] || '').trim() : '';

        if (isMatrix) {
          if (!date) continue;
          priceCols.forEach(pc => {
            const val = row[pc.idx];
            const price = parseFloat(String(val).replace(/[^\d.\-]/g, ''));
            if (!price || isNaN(price) || price <= 0) return;
            pending.push({
              id: 'pend_' + uidFn(), importBatchId: batchId, source: 'excel',
              reviewStatus: 'pending', status: 'ok', dup: false,
              date, price,
              route: `${lineName} · ${pc.name}`,
              line: lineName, columnKey: pc.name,
              origin: lineName, destination: pc.name,
              notes: rowNotes, driver: rowDriver,
              customerId, sheet: sheet.name
            });
          });
        } else {
          const price = cols.price >= 0 ? parseFloat(String(row[cols.price] || '').replace(/[^\d.\-]/g, '')) : 0;
          const route = cols.route >= 0 ? String(row[cols.route] || '').trim() : '';
          if (!date && !price && !route) continue;
          if (!date) date = curMonth() + '-01';
          pending.push({
            id: 'pend_' + uidFn(), importBatchId: batchId, source: 'excel',
            reviewStatus: 'pending', status: (!price) ? 'warn' : 'ok', dup: false,
            date, price: price || 0, route,
            origin: cols.origin >= 0 ? String(row[cols.origin] || '') : '',
            destination: cols.destination >= 0 ? String(row[cols.destination] || '') : '',
            driver: rowDriver,
            notes: rowNotes,
            line: lineName, columnKey: '',
            customerId, sheet: sheet.name
          });
        }
      }
    });

    // סיווג סטטוס + זיהוי כפילויות
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

    // שמור את הרשימה ב-state so שהפונקציות המקוריות יעבדו
    if (typeof _importPending !== 'undefined') _importPending = pending;
    state.importPending = pending;

    if (typeof renderPendingTable === 'function') renderPendingTable();
    document.getElementById('excelPendingBox')?.classList.remove('hidden');
    toastMsg(pending.length + ' רשומות מוכנות לבדיקה');
  };

  // ============================================================
  // 2. WHATSAPP IMPORT V2
  // ============================================================
  function looksLikeTripV2(body) {
    if (!body || body.length < 3) return false;
    const t = String(body);
    if (/הוצפן|צורף|נמחק|הוסר|שינה את|יצר קבוצה|הוסיף את|הצטרף|עזב|שיחת וידאו|שיחת קול/i.test(t)) return false;

    const routeKw = /(?:^|\s)(בב|ים|ספר|נתניה|אשדוד|שמש|טלז|אלעד|חולון|פת|עטרות|הלוך|חזור|פנימי|שדה|טבריה|צפת|רעננה|ראש העין|אופקים|נתיבות|מירון|בני ברק|ירושלים|מודיעין)(?:\s|$)/;
    const hasRoute = routeKw.test(t);
    const hasPriceMark = /(?:₪|ש"ח|ש״ח|שח|מחיר)/.test(t);

    if (!hasRoute && !hasPriceMark) return false;
    if (t.length < 8 && !hasPriceMark) return false;
    if (isPhoneNumber(t.trim())) return false;
    return true;
  }

  function parseWATxtV2(text) {
    const lines = String(text).split(/\r?\n/);
    const messages = [];
    const headerRes = [
      /^(?:\u200f)?\[(\d{1,2})[\/\.](\d{1,2})[\/\.](\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\]\s*([^:]+):\s*(.*)$/,
      /^(?:\u200f)?(\d{1,2})[\/\.](\d{1,2})[\/\.](\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–]\s*([^:]+):\s*(.*)$/,
      /^(?:\u200f)?(\d{1,2})[\.\/](\d{1,2})[\.\/](\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–]?\s*([^:]+):\s*(.*)$/
    ];
    let current = null;
    for (const line of lines) {
      let m = null;
      for (const re of headerRes) { m = line.match(re); if (m) break; }
      if (m) {
        if (current) messages.push(current);
        let day = m[1].padStart(2, '0'), month = m[2].padStart(2, '0');
        const year = m[3].length === 2 ? '20' + m[3] : m[3];
        if (parseInt(month, 10) > 12) [day, month] = [month, day];
        current = { date: `${year}-${month}-${day}`, time: m[4], sender: m[5].trim(), body: (m[6] || '').trim() };
      } else if (current && line.trim()) {
        current.body += '\n' + line.trim();
      }
    }
    if (current) messages.push(current);
    return messages;
  }

  function resolveRelativeDate(text, fallback) {
    const t = String(text || '').toLowerCase();
    const today = new Date();
    if (/\bהיום\b/.test(t)) return today.toISOString().slice(0, 10);
    if (/\bאתמול\b/.test(t)) { const d = new Date(today); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); }
    if (/\bשלשום\b/.test(t)) { const d = new Date(today); d.setDate(d.getDate() - 2); return d.toISOString().slice(0, 10); }
    return fallback || null;
  }

  function extractTripV2(text, fallback) {
    const t = String(text || '');
    let date = resolveRelativeDate(t, fallback);
    let price = null, route = '', notes = '';

    const dm = t.match(/(\d{1,2})[\/\.](\d{1,2})(?:[\/\.](\d{2,4}))?/);
    if (dm) {
      let day = dm[1].padStart(2, '0'), mo = dm[2].padStart(2, '0');
      const year = dm[3] ? (dm[3].length === 2 ? '20' + dm[3] : dm[3]) : (curMonth() || '').slice(0, 4);
      if (parseInt(mo, 10) > 12) [day, mo] = [mo, day];
      date = `${year}-${mo}-${day}`;
    }

    const pm = t.match(/(?:₪|ש"ח|ש״ח|שח|מחיר)\s*[:\-]?\s*(\d{2,5})/);
    if (pm) price = parseInt(pm[1], 10);
    if (!price) {
      const all = [...t.matchAll(/\b(\d{2,5})\b/g)];
      for (const m of all) {
        const n = parseInt(m[1], 10);
        if (n >= 40 && n <= 8000) {
          const before = t.slice(Math.max(0, m.index - 3), m.index);
          if (/0\d{2,}$/.test(before)) continue;
          price = n; break;
        }
      }
    }

    const known = (typeof COMMON_ROUTES !== 'undefined') ? COMMON_ROUTES : [];
    for (const r of known) { if (t.includes(r)) { route = r; break; } }
    if (!route) {
      const rm = t.match(/(?:^|\s)([א-ת]{2,15}(?:\s+[א-ת]{2,15})?)(?:\s|$|[,\.])/);
      if (rm && !/^(?:אתמול|היום|שלשום|מחיר|בב|ים)$/.test(rm[1])) route = rm[1].trim();
    }

    const noteKw = ['ספיישל', 'ספרינטר', 'המתנה', 'קאפ', 'מיניבוס', 'סיינה', 'פנימי', 'תחנות', 'הלוך', 'חזור', 'משלוח'];
    notes = noteKw.filter(k => t.includes(k)).join(', ');

    return { date, price, route, notes };
  }

  function processWAText(text) {
    let clean = String(text || '');
    if (clean.charCodeAt(0) === 0xFEFF) clean = clean.slice(1);
    const messages = parseWATxtV2(clean);
    const tripLike = messages.filter(m => looksLikeTripV2(m.body));
    state.importPending = tripLike.map(m => {
      const parsed = extractTripV2(m.body, m.date);
      return {
        selected: true,
        date: parsed.date || m.date || '',
        price: parsed.price || 0,
        route: parsed.route || '',
        notes: parsed.notes || '',
        raw: m.body,
        sender: isPhoneNumber(m.sender) ? '' : (m.sender || '')
      };
    });
    if (typeof renderImportResults === 'function') renderImportResults();
    toastMsg(`נמצאו ${tripLike.length} הודעות שנראות כנסיעות (מתוך ${messages.length})`, 3500);
  }

  window.looksLikeTrip = looksLikeTripV2;
  window.parseWhatsAppTxt = parseWATxtV2;
  window.extractTripFromText = extractTripV2;

  window.parseWhatsAppFile = async function () {
    const fileInput = document.getElementById('importFile');
    const file = fileInput?.files?.[0];
    if (!file) { toastMsg('בחר קובץ'); return; }

    if (/\.zip$/i.test(file.name)) {
      try {
        if (typeof JSZip === 'undefined') {
          toastMsg('טוען ספריית ZIP...');
          await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
        }
        const zip = await JSZip.loadAsync(file);
        const txts = Object.keys(zip.files).filter(n => /\.txt$/i.test(n) && !zip.files[n].dir);
        if (!txts.length) { toastMsg('לא נמצא קובץ TXT בתוך ה-ZIP'); return; }
        let allText = '';
        for (const name of txts) allText += await zip.files[name].async('text') + '\n';
        processWAText(allText);
      } catch (err) {
        console.error(err);
        toastMsg('שגיאה בקריאת ZIP: ' + (err.message || err));
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => processWAText(e.target.result);
    reader.onerror = () => toastMsg('שגיאה בקריאת הקובץ');
    reader.readAsText(file, 'UTF-8');
  };

  // ============================================================
  // 3. LEARNING V2
  // ============================================================
  function normPlaceV2(s) {
    if (typeof normalizePlace === 'function') return normalizePlace(s);
    return String(s || '').trim().toLowerCase();
  }

  window.learnFromTrip = function (trip, opts) {
    if (!trip || !trip.customerId) return null;
    const c = getCust(trip.customerId);
    if (!c) return null;
    opts = opts || {};
    const learned = [];

    if (!c.typicalRoutes) c.typicalRoutes = [];
    if (!c.orderers) c.orderers = [];
    if (!c.priceList) c.priceList = [];
    if (!c.ordererByRoute) c.ordererByRoute = {};
    if (!c.ordererByRouteCount) c.ordererByRouteCount = {};
    if (!c.preferredRoutes) c.preferredRoutes = [];
    if (!c._priceHistory) c._priceHistory = [];

    // === 1. מזמין (סינון טלפונים) ===
    const orderer = (trip.driver || '').trim();
    if (orderer && !isPhoneNumber(orderer)) {
      if (!c.orderers.includes(orderer)) {
        c.orderers.push(orderer);
        learned.push('מזמין חדש: ' + orderer);
      }
    }

    // === 2. מסלול נפוץ ===
    const route = (trip.route || trip.columnKey || [trip.origin, trip.destination].filter(Boolean).join(' ')).trim();
    if (route) {
      let pref = c.preferredRoutes.find(p => p.route === route);
      if (!pref) { pref = { route, count: 0, lastPrice: 0, lastDate: '' }; c.preferredRoutes.push(pref); }
      pref.count = (pref.count || 0) + 1;
      if (trip.price) pref.lastPrice = trip.price;
      if (trip.date) pref.lastDate = trip.date;
      c.preferredRoutes.sort((a, b) => (b.count || 0) - (a.count || 0));
      if (c.preferredRoutes.length > 30) c.preferredRoutes = c.preferredRoutes.slice(0, 30);

      if (!c.typicalRoutes.includes(route)) {
        c.typicalRoutes.unshift(route);
        if (c.typicalRoutes.length > 40) c.typicalRoutes = c.typicalRoutes.slice(0, 40);
        learned.push('מסלול חדש: ' + route);
      } else {
        c.typicalRoutes = [route, ...c.typicalRoutes.filter(r => r !== route)];
      }
    }

    // === 3. ordererByRoute עם count ===
    if (orderer && route && !isPhoneNumber(orderer)) {
      if (!c.ordererByRouteCount[route]) c.ordererByRouteCount[route] = {};
      c.ordererByRouteCount[route][orderer] = (c.ordererByRouteCount[route][orderer] || 0) + 1;
      const best = Object.entries(c.ordererByRouteCount[route]).sort((a, b) => b[1] - a[1])[0];
      if (best && best[1] >= 2) {
        const prev = c.ordererByRoute[route];
        if (prev !== best[0]) {
          c.ordererByRoute[route] = best[0];
          learned.push(`שיוך מזמין: ${route} → ${best[0]} (${best[1]})`);
        }
      }
    }

    // === 4. מחירון עם סף אישורים (2+) ===
    const price = parseFloat(trip.price);
    if (price > 0) {
      const origin = (trip.origin || trip.line || '').trim();
      const destination = (trip.destination || trip.columnKey || route || '').trim();
      let o = origin, d = destination;
      if ((!o || !d) && route) {
        const parts = route.split(/\s+/).filter(Boolean);
        if (parts.length >= 2 && !o) { o = parts[0]; d = parts.slice(1).join(' '); }
      }
      if (trip.line && trip.columnKey) { o = trip.line; d = trip.columnKey; }

      if (o || d) {
        const histKey = normPlaceV2(o) + '→' + normPlaceV2(d);
        let hist = c._priceHistory.find(h => h.key === histKey);
        if (!hist) { hist = { key: histKey, origin: o, destination: d, entries: [] }; c._priceHistory.push(hist); }
        hist.entries.unshift({ price, date: trip.date });
        hist.entries = hist.entries.slice(0, 10);

        const recent = hist.entries.slice(0, 3);
        const samePriceCount = recent.filter(h => Math.abs(h.price - price) < 0.5).length;

        const match = c.priceList.find(p =>
          normPlaceV2(p.origin || '') === normPlaceV2(o) &&
          normPlaceV2(p.destination || '') === normPlaceV2(d)
        );

        if (match) {
          if (match.price !== price && samePriceCount >= 2) {
            match.price = price;
            match.active = true;
            match.updatedAt = new Date().toISOString();
            match.confirmCount = (match.confirmCount || 1) + 1;
            learned.push('מחירון עודכן: ' + (o || '') + ' → ' + (d || '') + ' = ₪' + price);
          } else if (match.price === price) {
            match.confirmCount = (match.confirmCount || 0) + 1;
          }
        } else if (samePriceCount >= 2) {
          c.priceList.push({
            id: 'pl_learn_' + uidFn(),
            origin: o || route || 'כללי',
            destination: d || route || '',
            price, tripType: 'רגיל', active: true,
            confirmCount: samePriceCount,
            notes: 'נלמד מהזנה',
            learnedAt: new Date().toISOString()
          });
          learned.push('מחירון חדש: ' + (o || '') + ' → ' + (d || '') + ' = ₪' + price);
        }
      }
    }

    // === 5. קו חדש ===
    if (trip.line && c.lines && Array.isArray(c.lines) && !c.lines.includes(trip.line)) {
      if (c.lines.length > 0) {
        c.lines.push(trip.line);
        learned.push('קו חדש: ' + trip.line);
      }
    }

    if (learned.length) {
      c.updatedAt = new Date().toISOString();
      if (typeof saveState === 'function') saveState();
    }
    return learned.length ? learned : null;
  };

  window.learnFromTrips = function (trips, opts) {
    const all = [];
    (trips || []).forEach(t => {
      const L = window.learnFromTrip(t, opts);
      if (L) all.push(...L);
    });
    return [...new Set(all)];
  };

  // ============================================================
  // 4. TRANSPARENT LEARNING UI (חלופה 1)
  // ============================================================
  // הוספת מידע inline בשדות הרלוונטיים — בלי מסך חדש, בלי כפתור בתפריט

  // שדרוג applyOrdererSuggestion — הצגת כמה פעמים המזמין הוזמן במסלול זה
  function applyOrdererSuggestionV2() {
    const cid = document.getElementById('formCustomer')?.value;
    const route = document.getElementById('formRoute')?.value || '';
    const sugBox = document.getElementById('ordererSuggestBox');
    const drv = document.getElementById('formDriver');
    if (!cid || !route) {
      if (sugBox) sugBox.classList.add('hidden');
      return;
    }
    const c = getCust(cid);
    if (!c) { if (sugBox) sugBox.classList.add('hidden'); return; }

    // מצא מזמין מומלץ + ספור כמה פעמים
    const r = route.trim().toLowerCase();
    let suggested = null, count = 0;

    // קודם מה-ordererByRouteCount
    if (c.ordererByRouteCount) {
      for (const [key, counts] of Object.entries(c.ordererByRouteCount)) {
        if (r === key.toLowerCase() || r.includes(key.toLowerCase()) || key.toLowerCase().includes(r)) {
          const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
          if (best) { suggested = best[0]; count = best[1]; break; }
        }
      }
    }

    // אם לא נמצא, חפש בהיסטוריית נסיעות
    if (!suggested) {
      const counts = {};
      state.trips.filter(t => t.customerId === cid && t.driver && t.route && !isPhoneNumber(t.driver)).forEach(t => {
        const tr = (t.route || '').toLowerCase();
        if (tr === r || tr.includes(r) || r.includes(tr)) {
          counts[t.driver] = (counts[t.driver] || 0) + 1;
        }
      });
      const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      if (best) { suggested = best[0]; count = best[1]; }
    }

    if (!suggested) { if (sugBox) sugBox.classList.add('hidden'); return; }
    if (drv && !drv.value.trim()) drv.value = suggested;

    if (sugBox) {
      sugBox.classList.remove('hidden');
      const confidence = count >= 5 ? '🟢' : count >= 3 ? '🟡' : '⚪';
      sugBox.innerHTML = `
        <div class="flex items-center gap-2 flex-wrap">
          <span>${confidence} <b>${esc(suggested)}</b> מוזמן בדרך כלל למסלול זה (${count} פעמים)</span>
          <button type="button" class="underline text-indigo-700 hover:text-indigo-900" onclick="window.__applyOrderer('${esc(suggested).replace(/'/g, "\\'")}')">החל</button>
        </div>
      `;
    }
  }

  window.__applyOrderer = function (name) {
    const el = document.getElementById('formDriver');
    if (el) el.value = name;
    const box = document.getElementById('ordererSuggestBox');
    if (box) box.classList.add('hidden');
  };

  window.applyOrdererSuggestion = applyOrdererSuggestionV2;

  // שדרוג refreshPriceSuggestion — הצגת היסטוריית מחירים מועשרת
  // (המקורי כבר מציג היסטוריה. אנחנו מוסיפים "מבוסס על X נסיעות")
  function refreshPriceSuggestionV2() {
    const customerId = document.getElementById('formCustomer')?.value;
    const origin = document.getElementById('formOrigin')?.value || '';
    const destination = document.getElementById('formDestination')?.value || '';
    const route = document.getElementById('formRoute')?.value || '';
    const date = document.getElementById('formDate')?.value || '';

    const box = document.getElementById('priceSuggestionBox');
    if (!box) return;
    if (!customerId) {
      if (typeof hidePriceBoxes === 'function') hidePriceBoxes();
      return;
    }
    if (typeof suggestPrice !== 'function') return;

    const s = suggestPrice(customerId, origin, destination, route, date);
    if (typeof _lastSuggestion !== 'undefined') window._lastSuggestion = s;

    if (s.price != null) {
      box.classList.remove('hidden');
      document.getElementById('priceSuggestionMain').textContent = formatMoney(s.price);
      document.getElementById('priceSuggestionSource').textContent = s.source;
      let hint = '';
      if (s.stats && s.stats.count) {
        const conf = s.stats.count >= 5 ? '🟢 מבוסס על היסטוריה רחבה' :
                     s.stats.count >= 3 ? '🟡 מבוסס על היסטוריה חלקית' :
                     '⚪ מבוסס על נסיעה בודדת';
        hint = `${conf} · אחרון ${formatMoney(s.stats.last)} · ממוצע ${formatMoney(s.stats.avg)} · מינ׳ ${formatMoney(s.stats.min)} · מקס׳ ${formatMoney(s.stats.max)} · ${s.stats.count} נסיעות`;
      } else if (s.sourceTier <= 2) {
        hint = '🎯 מבוסס על מחירון הלקוח';
      }
      document.getElementById('priceHistoryHint').textContent = hint;
    } else {
      box.classList.remove('hidden');
      document.getElementById('priceSuggestionMain').textContent = '—';
      document.getElementById('priceSuggestionSource').textContent = s.source;
      document.getElementById('priceHistoryHint').textContent = '⚪ אין מספיק נתונים להצעת מחיר — הזן ידנית';
    }

    if (typeof onPriceInput === 'function') onPriceInput();
  }

  window.refreshPriceSuggestion = refreshPriceSuggestionV2;

  // ============================================================
  // 5. #10 PDF INVOICE
  // ============================================================
  function generateInvoiceHTML(customerId, month) {
    const c = getCust(customerId);
    if (!c) return '';
    const trips = (state.trips || []).filter(t =>
      t.customerId === c.id && t.date && t.date.startsWith(month)
    ).sort((a, b) => (a.date || '').localeCompare(b.date || ''));

    const subtotal = trips.reduce((s, t) => s + (t.price || 0), 0);
    const vatRate = state.defaultVat || 18;
    const useVat = c.vat !== false;
    const vatAmount = useVat ? Math.round(subtotal * (vatRate / 100) * 100) / 100 : 0;
    const total = subtotal + vatAmount;

    const [y, mo] = month.split('-');
    const monthLabel = `${mo}/${y}`;
    const invoiceNum = `INV-${y}${mo}-${String(c.id || '').slice(0, 4).toUpperCase()}`;
    const today = new Date().toLocaleDateString('he-IL');

    const rows = trips.map((t, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${fmtDate(t.date)}</td>
        <td>${esc(t.line || '')}</td>
        <td>${esc(t.route || t.columnKey || '—')}</td>
        <td>${esc(t.driver || '')}</td>
        <td class="num">${(t.price || 0).toLocaleString('he-IL')}</td>
      </tr>`).join('');

    return `<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="UTF-8">
<title>חשבונית ${invoiceNum} · ${esc(c.name)}</title>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Heebo', sans-serif; margin: 0; padding: 24px; color: #0f172a; background: #f8fafc; }
  .invoice { max-width: 800px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 24px rgba(15,23,42,.08); }
  .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 3px solid #2563eb; margin-bottom: 24px; }
  .header h1 { margin: 0; font-size: 28px; color: #1e3a8a; }
  .header .sub { color: #64748b; font-size: 14px; margin-top: 4px; }
  .header .meta { text-align: left; font-size: 14px; }
  .header .meta div { margin-bottom: 4px; }
  .badge { display: inline-block; padding: 4px 12px; background: #dbeafe; color: #1e40af; border-radius: 999px; font-size: 12px; font-weight: 500; margin-top: 8px; }
  .client { background: #f1f5f9; padding: 16px; border-radius: 8px; margin-bottom: 24px; display: flex; justify-content: space-between; }
  .client .label { color: #64748b; font-size: 12px; }
  .client .value { font-weight: 600; font-size: 16px; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  thead th { background: #eef2ff; color: #1e3a8a; padding: 10px 8px; text-align: right; font-size: 13px; font-weight: 600; border-bottom: 2px solid #c7d2fe; }
  thead th.num { text-align: center; }
  tbody td { padding: 8px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
  tbody td.num { text-align: center; font-weight: 600; color: #065f46; }
  tbody tr:nth-child(even) { background: #fafbff; }
  .totals { margin-right: auto; width: 320px; }
  .totals tr td { padding: 8px 12px; font-size: 14px; }
  .totals .label { color: #64748b; }
  .totals .final { background: linear-gradient(135deg, #1e40af, #4338ca); color: white !important; font-weight: 700; font-size: 16px; border-radius: 8px; }
  .totals .final td { padding: 14px 12px; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px; }
  .actions { text-align: center; margin-top: 24px; }
  .actions button { padding: 12px 32px; background: #1e40af; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; margin: 0 4px; font-family: inherit; }
  .actions button.secondary { background: #e2e8f0; color: #334155; }
  @media print { body { background: white; padding: 0; } .invoice { box-shadow: none; padding: 20px; } .actions { display: none; } @page { size: A4; margin: 12mm; } }
</style></head><body>
  <div class="invoice">
    <div class="header">
      <div><h1>חשבונית עסקית</h1><div class="sub">מערכת ניהול נסיעות</div></div>
      <div class="meta">
        <div><b>מספר:</b> ${invoiceNum}</div>
        <div><b>תאריך הפקה:</b> ${today}</div>
        <div><b>חודש חיוב:</b> ${monthLabel}</div>
        <span class="badge">${useVat ? 'כולל מע״מ ' + vatRate + '%' : 'פטור ממע״מ'}</span>
      </div>
    </div>
    <div class="client">
      <div>
        <div class="label">לכבוד</div>
        <div class="value">${esc(c.name)}</div>
        ${c.notes ? `<div class="label" style="margin-top:6px">${esc(c.notes)}</div>` : ''}
      </div>
      <div style="text-align:left">
        <div class="label">מספר נסיעות</div>
        <div class="value">${trips.length}</div>
      </div>
    </div>
    ${trips.length === 0 ? `<div style="text-align:center;padding:40px;color:#94a3b8">אין נסיעות בחודש זה</div>` : `
    <table><thead><tr>
      <th style="width:40px">#</th><th style="width:90px">תאריך</th><th style="width:110px">קו</th>
      <th>תיאור המסלול</th><th style="width:120px">מזמין</th><th class="num" style="width:90px">מחיר (₪)</th>
    </tr></thead><tbody>${rows}</tbody></table>
    <table class="totals">
      <tr><td class="label">סה״כ לפני מע״מ</td><td style="text-align:left;font-weight:600">${subtotal.toLocaleString('he-IL')} ₪</td></tr>
      ${useVat ? `<tr><td class="label">מע״מ ${vatRate}%</td><td style="text-align:left;font-weight:600">${vatAmount.toLocaleString('he-IL')} ₪</td></tr>` : ''}
      <tr class="final"><td>סה״כ לתשלום</td><td style="text-align:left">${total.toLocaleString('he-IL')} ₪</td></tr>
    </table>`}
    <div class="footer">הופק על ידי מערכת ניהול נסיעות · ${new Date().getFullYear()}</div>
  </div>
  <div class="actions">
    <button onclick="window.print()">🖨️ הדפס / שמור כ-PDF</button>
    <button class="secondary" onclick="window.close()">סגור</button>
  </div>
</body></html>`;
  }

  function openInvoice(customerId, month) {
    const m = month || curMonth();
    const html = generateInvoiceHTML(customerId, m);
    if (!html) { toastMsg('לקוח לא נמצא'); return; }
    const win = window.open('', '_blank', 'width=900,height=1000');
    if (!win) { toastMsg('⚠️ הדפדפן חסם פתיחת חלון'); return; }
    win.document.write(html);
    win.document.close();
  }

  // ============================================================
  // 6. #12 MONTHLY COMPARISON
  // ============================================================
  function renderMonthlyComparison() {
    const cur = curMonth();
    const prev = monthOffset(cur, -1);
    const curTrips = (state.trips || []).filter(t => t.date && t.date.startsWith(cur));
    const prevTrips = (state.trips || []).filter(t => t.date && t.date.startsWith(prev));

    const curTotal = curTrips.reduce((s, t) => s + (t.price || 0), 0);
    const prevTotal = prevTrips.reduce((s, t) => s + (t.price || 0), 0);
    const totalDelta = prevTotal > 0 ? Math.round(((curTotal - prevTotal) / prevTotal) * 100) : 0;
    const curCustCount = new Set(curTrips.map(t => t.customerId)).size;
    const prevCustCount = new Set(prevTrips.map(t => t.customerId)).size;
    const avgCur = curTrips.length ? Math.round(curTotal / curTrips.length) : 0;
    const avgPrev = prevTrips.length ? Math.round(prevTotal / prevTrips.length) : 0;

    const curByCust = {}, prevByCust = {};
    curTrips.forEach(t => { curByCust[t.customerId] = (curByCust[t.customerId] || 0) + (t.price || 0); });
    prevTrips.forEach(t => { prevByCust[t.customerId] = (prevByCust[t.customerId] || 0) + (t.price || 0); });
    const allIds = new Set([...Object.keys(curByCust), ...Object.keys(prevByCust)]);
    const perCustomer = [...allIds].map(cid => {
      const curVal = curByCust[cid] || 0;
      const prevVal = prevByCust[cid] || 0;
      const delta = prevVal > 0 ? Math.round(((curVal - prevVal) / prevVal) * 100) : (curVal > 0 ? 100 : 0);
      const curN = curTrips.filter(t => t.customerId === cid).length;
      const prevN = prevTrips.filter(t => t.customerId === cid).length;
      const c = getCust(cid);
      return { cid, name: c ? c.name : cid, curVal, prevVal, delta, curN, prevN };
    }).sort((a, b) => b.curVal - a.curVal);

    const growth = perCustomer.filter(c => c.delta > 10 && c.curVal > 0).slice(0, 5);
    const decline = perCustomer.filter(c => c.delta < -10 && c.prevVal > 0).slice(0, 5);
    const newCust = perCustomer.filter(c => c.prevVal === 0 && c.curVal > 0);
    const lostCust = perCustomer.filter(c => c.curVal === 0 && c.prevVal > 0);
    const trendIcon = (n) => n > 5 ? '📈' : n < -5 ? '📉' : '➡️';
    const trendColor = (n) => n > 5 ? 'text-emerald-600' : n < -5 ? 'text-red-600' : 'text-slate-500';

    return `
      <div class="space-y-5">
        <div class="bg-gradient-to-l from-indigo-600 to-blue-700 text-white rounded-2xl p-5 shadow-lg">
          <div class="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div class="text-xs opacity-80">השוואה חודשית</div>
              <div class="text-2xl font-bold mt-1">${monthLabelHe(cur)} <span class="opacity-60 text-base font-normal">מול</span> ${monthLabelHe(prev)}</div>
            </div>
            <div class="text-right">
              <div class="text-xs opacity-80">שינוי בסה״כ</div>
              <div class="text-3xl font-bold">${(totalDelta > 0 ? '+' : '') + totalDelta}%</div>
            </div>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="bg-white rounded-xl border border-slate-200 p-4">
            <div class="text-xs text-slate-500">סה״כ החודש</div>
            <div class="text-xl font-bold text-indigo-700 mt-1">${fmtMoney(curTotal)}</div>
            <div class="text-xs mt-1 ${trendColor(totalDelta)}">${trendIcon(totalDelta)} ${(totalDelta > 0 ? '+' : '') + totalDelta}% מ-${fmtMoney(prevTotal)}</div>
          </div>
          <div class="bg-white rounded-xl border border-slate-200 p-4">
            <div class="text-xs text-slate-500">מספר נסיעות</div>
            <div class="text-xl font-bold text-slate-800 mt-1">${curTrips.length}</div>
            <div class="text-xs text-slate-500 mt-1">לעומת ${prevTrips.length} בחודש שעבר</div>
          </div>
          <div class="bg-white rounded-xl border border-slate-200 p-4">
            <div class="text-xs text-slate-500">לקוחות פעילים</div>
            <div class="text-xl font-bold text-slate-800 mt-1">${curCustCount}</div>
            <div class="text-xs text-slate-500 mt-1">לעומת ${prevCustCount} בחודש שעבר</div>
          </div>
          <div class="bg-white rounded-xl border border-slate-200 p-4">
            <div class="text-xs text-slate-500">ממוצע לנסיעה</div>
            <div class="text-xl font-bold text-emerald-700 mt-1">${fmtMoney(avgCur)}</div>
            <div class="text-xs text-slate-500 mt-1">לעומת ${fmtMoney(avgPrev)} בחודש שעבר</div>
          </div>
        </div>

        ${newCust.length || lostCust.length ? `
        <div class="grid sm:grid-cols-2 gap-3">
          ${newCust.length ? `<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div class="font-semibold text-emerald-900 text-sm mb-2">✨ לקוחות חדשים החודש (${newCust.length})</div>
            ${newCust.map(c => `<div class="text-sm flex justify-between py-0.5"><span>${esc(c.name)}</span><span class="font-medium">${fmtMoney(c.curVal)}</span></div>`).join('')}
          </div>` : ''}
          ${lostCust.length ? `<div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div class="font-semibold text-amber-900 text-sm mb-2">⚠️ לקוחות שלא חזרו (${lostCust.length})</div>
            ${lostCust.map(c => `<div class="text-sm flex justify-between py-0.5"><span>${esc(c.name)}</span><span class="text-slate-500">היה ${fmtMoney(c.prevVal)}</span></div>`).join('')}
          </div>` : ''}
        </div>` : ''}

        ${growth.length || decline.length ? `
        <div class="grid sm:grid-cols-2 gap-3">
          ${growth.length ? `<div class="bg-white rounded-xl border border-slate-200 p-4">
            <div class="font-semibold text-slate-800 text-sm mb-3">📈 צמיחה בולטת</div>
            ${growth.map(c => `<div class="flex justify-between py-1.5 border-b border-slate-100 last:border-0 text-sm"><span>${esc(c.name)}</span><span class="text-emerald-600 font-semibold">+${c.delta}%</span></div>`).join('')}
          </div>` : ''}
          ${decline.length ? `<div class="bg-white rounded-xl border border-slate-200 p-4">
            <div class="font-semibold text-slate-800 text-sm mb-3">📉 ירידה בולטת</div>
            ${decline.map(c => `<div class="flex justify-between py-1.5 border-b border-slate-100 last:border-0 text-sm"><span>${esc(c.name)}</span><span class="text-red-600 font-semibold">${c.delta}%</span></div>`).join('')}
          </div>` : ''}
        </div>` : ''}

        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div class="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h3 class="font-semibold text-slate-800 text-sm">פירוט מלא לפי לקוח</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 text-slate-600 text-xs"><tr>
                <th class="text-right py-2 px-3 font-medium">לקוח</th>
                <th class="text-center py-2 px-3 font-medium">${monthLabelHe(prev)}</th>
                <th class="text-center py-2 px-3 font-medium">${monthLabelHe(cur)}</th>
                <th class="text-center py-2 px-3 font-medium">שינוי</th>
                <th class="text-center py-2 px-3 font-medium">נסיעות</th>
                <th class="text-center py-2 px-3 font-medium">PDF</th>
              </tr></thead>
              <tbody>
                ${perCustomer.map(c => `<tr class="border-t border-slate-100 hover:bg-slate-50">
                  <td class="py-2 px-3 font-medium text-slate-800">${esc(c.name)}</td>
                  <td class="py-2 px-3 text-center text-slate-600">${fmtMoney(c.prevVal)}</td>
                  <td class="py-2 px-3 text-center font-semibold">${fmtMoney(c.curVal)}</td>
                  <td class="py-2 px-3 text-center ${trendColor(c.delta)} font-medium">${(c.delta > 0 ? '+' : '') + c.delta}%</td>
                  <td class="py-2 px-3 text-center text-slate-500 text-xs">${c.prevN}→${c.curN}</td>
                  <td class="py-2 px-3 text-center">
                    <button onclick="window.openInvoice('${c.cid}', '${cur}')" class="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2.5 py-1 rounded-lg">🖨️ PDF</button>
                  </td>
                </tr>`).join('') || '<tr><td colspan="6" class="text-center py-8 text-slate-400">אין נתונים</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <button onclick="window.__exportComparisonPDF()" class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2.5 rounded-xl font-medium">🖨️ הפק דוח השוואה כ-PDF</button>
          <button onclick="window.__exportComparisonExcel()" class="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2.5 rounded-xl font-medium">⬇️ הורד כאקסל</button>
        </div>
      </div>`;
  }

  function exportComparisonPDF() {
    const cur = curMonth();
    const prev = monthOffset(cur, -1);
    const curTrips = (state.trips || []).filter(t => t.date && t.date.startsWith(cur));
    const prevTrips = (state.trips || []).filter(t => t.date && t.date.startsWith(prev));
    const curTotal = curTrips.reduce((s, t) => s + (t.price || 0), 0);
    const prevTotal = prevTrips.reduce((s, t) => s + (t.price || 0), 0);
    const delta = prevTotal > 0 ? Math.round(((curTotal - prevTotal) / prevTotal) * 100) : 0;

    const curByCust = {}, prevByCust = {};
    curTrips.forEach(t => { curByCust[t.customerId] = (curByCust[t.customerId] || 0) + (t.price || 0); });
    prevTrips.forEach(t => { prevByCust[t.customerId] = (prevByCust[t.customerId] || 0) + (t.price || 0); });
    const allIds = new Set([...Object.keys(curByCust), ...Object.keys(prevByCust)]);
    const rows = [...allIds].map(cid => {
      const cv = curByCust[cid] || 0, pv = prevByCust[cid] || 0;
      const d = pv > 0 ? Math.round(((cv - pv) / pv) * 100) : 0;
      const c = getCust(cid);
      return { name: c ? c.name : cid, curVal: cv, prevVal: pv, delta: d };
    }).sort((a, b) => b.curVal - a.curVal);

    const html = `<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="UTF-8">
<title>דוח השוואה · ${monthLabelHe(cur)}</title>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  body { font-family: 'Heebo', sans-serif; padding: 32px; max-width: 900px; margin: auto; }
  h1 { color: #1e3a8a; margin: 0 0 8px; }
  .sub { color: #64748b; margin-bottom: 24px; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
  .card { padding: 16px; background: #f1f5f9; border-radius: 8px; }
  .card .label { color: #64748b; font-size: 12px; }
  .card .val { font-size: 20px; font-weight: 700; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { background: #eef2ff; color: #1e3a8a; padding: 10px; text-align: right; }
  td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; }
  .pos { color: #059669; } .neg { color: #dc2626; }
  @media print { body { padding: 0; } @page { size: A4; margin: 12mm; } }
</style></head><body>
<h1>דוח השוואה חודשית</h1>
<div class="sub">${monthLabelHe(cur)} מול ${monthLabelHe(prev)}</div>
<div class="grid">
  <div class="card"><div class="label">סה״כ החודש</div><div class="val">${fmtMoney(curTotal)}</div></div>
  <div class="card"><div class="label">חודש שעבר</div><div class="val">${fmtMoney(prevTotal)}</div></div>
  <div class="card"><div class="label">שינוי</div><div class="val ${delta >= 0 ? 'pos' : 'neg'}">${(delta > 0 ? '+' : '') + delta}%</div></div>
</div>
<table><thead><tr><th>לקוח</th><th>${monthLabelHe(prev)}</th><th>${monthLabelHe(cur)}</th><th>שינוי</th></tr></thead>
<tbody>${rows.map(r => `<tr><td>${esc(r.name)}</td><td>${fmtMoney(r.prevVal)}</td><td><b>${fmtMoney(r.curVal)}</b></td><td class="${r.delta >= 0 ? 'pos' : 'neg'}">${(r.delta > 0 ? '+' : '') + r.delta}%</td></tr>`).join('')}</tbody></table>
<div style="text-align:center;margin-top:32px"><button onclick="window.print()" style="padding:12px 32px;background:#1e40af;color:white;border:none;border-radius:8px;font-size:16px;cursor:pointer;font-family:inherit">🖨️ הדפס / PDF</button></div>
</body></html>`;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
  }

  function exportComparisonExcel() {
    if (typeof XLSX === 'undefined') { toastMsg('ספריית Excel לא נטענה'); return; }
    const cur = curMonth();
    const prev = monthOffset(cur, -1);
    const curTrips = (state.trips || []).filter(t => t.date && t.date.startsWith(cur));
    const prevTrips = (state.trips || []).filter(t => t.date && t.date.startsWith(prev));
    const curByCust = {}, prevByCust = {};
    curTrips.forEach(t => { curByCust[t.customerId] = (curByCust[t.customerId] || 0) + (t.price || 0); });
    prevTrips.forEach(t => { prevByCust[t.customerId] = (prevByCust[t.customerId] || 0) + (t.price || 0); });
    const allIds = new Set([...Object.keys(curByCust), ...Object.keys(prevByCust)]);
    const rows = [['לקוח', monthLabelHe(prev), monthLabelHe(cur), 'שינוי %', 'שינוי ₪']];
    [...allIds].forEach(cid => {
      const cv = curByCust[cid] || 0, pv = prevByCust[cid] || 0;
      const d = pv > 0 ? Math.round(((cv - pv) / pv) * 100) : 0;
      const c = getCust(cid);
      rows.push([c ? c.name : cid, pv, cv, d + '%', cv - pv]);
    });
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 22 }, { wch: 14 }, { wch: 14 }, { wch: 10 }, { wch: 12 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'השוואה');
    XLSX.writeFile(wb, `השוואה_${cur}_מול_${prev}.xlsx`);
  }

  // ============================================================
  // 7. UI WIRING
  // ============================================================
  // הוספת כפתור PDF לכרטיסי לקוח
  function addInvoiceButtonsToCustomersGrid() {
    const grid = document.getElementById('customersGrid');
    if (!grid) return;
    grid.querySelectorAll(':scope > div').forEach(card => {
      if (card.dataset.invoiceBtn === '1') return;
      const editBtn = card.querySelector('button[onclick*="editCustomer"]');
      if (!editBtn) return;
      const m = editBtn.getAttribute('onclick').match(/editCustomer\('([^']+)'\)/);
      if (!m) return;
      card.dataset.invoiceBtn = '1';
      const actions = editBtn.parentNode;
      const pdfBtn = document.createElement('button');
      pdfBtn.onclick = (e) => { e.stopPropagation(); openInvoice(m[1], curMonth()); };
      pdfBtn.className = 'text-red-600 hover:text-red-800 text-sm font-medium mr-2';
      pdfBtn.textContent = '🖨️ PDF';
      actions.insertBefore(pdfBtn, editBtn);
    });
  }

  // הזרקת דוח השוואה לטאב דוחות
  function injectReportsComparison() {
    const tab = document.getElementById('tab-reports');
    if (!tab || tab.dataset.comparisonAdded === '1') return;
    tab.dataset.comparisonAdded = '1';
    const box = document.createElement('div');
    box.id = 'comparisonReportBox';
    box.className = 'bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-4';
    tab.insertBefore(box, tab.firstChild);
    try { box.innerHTML = renderMonthlyComparison(); }
    catch (e) { box.innerHTML = '<div class="text-red-600 text-sm p-4">שגיאה: ' + esc(e.message || e) + '</div>'; }
  }

  function refreshComparisonBox() {
    const box = document.getElementById('comparisonReportBox');
    if (!box) return;
    try { box.innerHTML = renderMonthlyComparison(); }
    catch (e) { box.innerHTML = '<div class="text-red-600 text-sm p-4">שגיאה: ' + esc(e.message || e) + '</div>'; }
  }

  window.openInvoice = openInvoice;
  window.__exportComparisonPDF = exportComparisonPDF;
  window.__exportComparisonExcel = exportComparisonExcel;

  // ============================================================
  // 8. BOOT
  // ============================================================
  function boot() {
    // עטוף showTab לרענון דוחות ולכפתורי PDF
    const origShowTab = window.showTab;
    if (typeof origShowTab === 'function' && !origShowTab.__upgrade2) {
      const wrapped = function (name) {
        const r = origShowTab.apply(this, arguments);
        if (name === 'reports') setTimeout(refreshComparisonBox, 80);
        if (name === 'customers') setTimeout(addInvoiceButtonsToCustomersGrid, 200);
        return r;
      };
      wrapped.__upgrade2 = true;
      window.showTab = wrapped;
    }

    setTimeout(injectReportsComparison, 700);
    setTimeout(addInvoiceButtonsToCustomersGrid, 900);

    // MutationObservers
    const grid = document.getElementById('customersGrid');
    if (grid && window.MutationObserver) {
      new MutationObserver(() => setTimeout(addInvoiceButtonsToCustomersGrid, 50))
        .observe(grid, { childList: true });
    }
    const reports = document.getElementById('tab-reports');
    if (reports && window.MutationObserver) {
      new MutationObserver(() => {
        if (reports.dataset.comparisonAdded !== '1') injectReportsComparison();
      }).observe(reports, { childList: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  window.addEventListener('load', () => {
    setTimeout(injectReportsComparison, 500);
    setTimeout(addInvoiceButtonsToCustomersGrid, 700);
  });

})();
