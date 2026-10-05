/* ============================================================
   Cloud Sync V5 — Fixed infinite loop
   ============================================================
   חדר יחיד קבוע. כל מי שיש לו קישור לאתר רואה את אותם נתונים.
   
   תיקון הלולאה:
   - כל שמירה מקבלת writeId ייחודי
   - realtime event שמכיל את ה-writeId שלנו → מתעלמים
   - זו הדרך הוודאית לזהות "השינוי שלי חזר אליי"
   ============================================================ */
(function () {
  'use strict';

  const cfg = window.SUPABASE_CONFIG || {};

  // 🔑 החדר היחיד שכולם מתחברים אליו
  const FIXED_ROOM_ID = 'trip-manager-main-room';

  let client = null;
  let channel = null;
  let saveTimer = null;
  let pendingState = null;
  let callbacks = {};
  let applyingRealtime = false;
  let lastSaveAt = 0;
  let lastSaveOk = false;
  let lastReadAt = 0;
  let connectionStatus = 'init';
  let statusListeners = [];
  let lastWriteId = null;   // ← מזהה השמירה האחרונה שלנו

  function configReady() {
    return !!(cfg.url && cfg.anonKey && !String(cfg.url).includes('YOUR_'));
  }

  function setStatus(s, err) {
    connectionStatus = s;
    statusListeners.forEach(fn => {
      try { fn({ status: s, lastSaveAt, lastSaveOk, lastReadAt, roomId: FIXED_ROOM_ID, error: err }); } catch (_) {}
    });
  }

  function onStatusChange(fn) {
    statusListeners.push(fn);
    try { fn({ status: connectionStatus, lastSaveAt, lastSaveOk, lastReadAt, roomId: FIXED_ROOM_ID }); } catch (_) {}
  }

  function defaultState() {
    return {
      customers: JSON.parse(JSON.stringify(window.DEFAULT_CUSTOMERS || [])),
      trips: [],
      drivers: JSON.parse(JSON.stringify(window.DEFAULT_DRIVERS || [])),
      workingMonth: (typeof currentMonthStr === 'function' ? currentMonthStr() : ''),
      defaultVat: 18,
      deskPrefs: {},
      geminiApiKey: '',
      lastBackupAt: 0
    };
  }

  // === Local mirror (fallback בלבד) ===
  const LS_KEY = 'tripManager_localMirror_v4';
  function writeLocal(state) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (_) {}
  }
  function readLocal() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  function genWriteId() {
    return 'w_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
  }

  async function init(opts) {
    callbacks = opts || {};

    if (!configReady()) {
      const local = readLocal();
      setStatus('local');
      if (callbacks.onAuth) callbacks.onAuth({ mode: 'local' });
      if (local && callbacks.onState) setTimeout(() => callbacks.onState(local, 'local'), 0);
      return { user: { mode: 'local' }, state: local };
    }

    if (!window.supabase || !window.supabase.createClient) {
      throw new Error('ספריית Supabase לא נטענה');
    }

    client = window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    try {
      setStatus('retry');

      const { data, error } = await client
        .from('app_rooms')
        .select('payload, updated_at')
        .eq('room_id', FIXED_ROOM_ID)
        .maybeSingle();
      if (error) throw error;

      let state;
      if (!data) {
        state = defaultState();
        await saveNow(state);
        if (callbacks.onState) callbacks.onState(state, 'initial');
      } else {
        state = data.payload || defaultState();
        // זכור את ה-writeId שהגיע מהשרת כדי לא לחשוב שזה שלנו
        lastWriteId = state.__writeId || null;
        lastReadAt = Date.now();
        if (callbacks.onState) callbacks.onState(state, 'cloud');
      }

      subscribeRealtime();
      setStatus('ok');
      if (callbacks.onAuth) callbacks.onAuth({ mode: 'cloud' });
      return { user: { mode: 'cloud' }, state };
    } catch (err) {
      console.error('Cloud init error', err);
      const local = readLocal();
      setStatus('error', err.message || String(err));
      if (callbacks.onAuth) callbacks.onAuth({ mode: 'local-fallback' });
      if (local && callbacks.onState) callbacks.onState(local, 'local');
      return { user: { mode: 'local-fallback' }, state: local };
    }
  }

  function subscribeRealtime() {
    if (!client) return;
    if (channel) { try { client.removeChannel(channel); } catch (_) {} }
    channel = client
      .channel('trip-manager-shared')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'app_rooms', filter: 'room_id=eq.' + FIXED_ROOM_ID },
        payload => {
          const next = payload?.new?.payload;
          if (!next) return;

          // ═══ ההגנה העיקרית ═══
          // אם ה-writeId שחזר מהשרת זהה לזו ששלחנו עכשיו → זה השינוי שלנו.
          // מתעלמים לחלוטין. זה שובר את הלולאה.
          const incomingWriteId = next.__writeId;
          if (incomingWriteId && incomingWriteId === lastWriteId) {
            return;
          }

          if (applyingRealtime) return;

          lastReadAt = Date.now();
          if (callbacks.onState) callbacks.onState(next, 'realtime');
        })
      .subscribe();
  }

  function scheduleSave(state) {
    pendingState = state;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveNow(pendingState).catch(err => {
        console.error('Cloud save failed', err);
        setStatus('error', err.message || String(err));
        if (typeof toast === 'function')
          toast('⚠️ שמירה נכשלה: ' + (err.message || err), 5000);
      });
    }, 450);
  }

  async function saveNow(state) {
    if (!client) {
      writeLocal(state);
      return;
    }

    // הוסף writeId ייחודי לפני השליחה
    const writeId = genWriteId();
    const payloadWithId = { ...state, __writeId: writeId };
    lastWriteId = writeId;

    applyingRealtime = true;
    try {
      const { error } = await client.from('app_rooms').upsert({
        room_id: FIXED_ROOM_ID,
        payload: payloadWithId,
        updated_at: new Date().toISOString()
      }, { onConflict: 'room_id' });
      if (error) throw error;
      lastSaveAt = Date.now();
      lastSaveOk = true;
      writeLocal(payloadWithId);
      if (connectionStatus !== 'ok') setStatus('ok');
    } catch (err) {
      lastSaveOk = false;
      setStatus('error', err.message || String(err));
      writeLocal(payloadWithId);
      throw err;
    } finally {
      // שחרר את הדגל רק אחרי שהשמירה + ה-event שלה חלפו
      setTimeout(() => { applyingRealtime = false; }, 1500);
    }
  }

  // === בדיקת round-trip ===
  async function verifySync() {
    if (!client) return { ok: false, reason: 'אין חיבור לענן' };
    const marker = 'verify_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    const t0 = Date.now();
    try {
      const { data: before } = await client
        .from('app_rooms')
        .select('payload')
        .eq('room_id', FIXED_ROOM_ID)
        .maybeSingle();
      if (!before) return { ok: false, reason: 'החדר לא נמצא' };

      const payload = before.payload || {};
      payload.__verifyMarker = marker;
      const writeId = genWriteId();
      payload.__writeId = writeId;
      lastWriteId = writeId;

      const { error: wErr } = await client.from('app_rooms').upsert({
        room_id: FIXED_ROOM_ID,
        payload,
        updated_at: new Date().toISOString()
      }, { onConflict: 'room_id' });
      if (wErr) throw wErr;

      const { data: after, error: rErr } = await client
        .from('app_rooms')
        .select('payload')
        .eq('room_id', FIXED_ROOM_ID)
        .maybeSingle();
      if (rErr) throw rErr;

      const got = after?.payload?.__verifyMarker;
      const ping = Date.now() - t0;
      if (got === marker) return { ok: true, ping, marker };
      return { ok: false, reason: 'הנתונים לא חזרו מהשרת תואמים', ping };
    } catch (err) {
      return { ok: false, reason: err.message || String(err) };
    }
  }

  async function signIn() { return null; }
  async function signUp() { return null; }
  function signOut() {}

  window.CloudSync = {
    init, scheduleSave, saveNow, verifySync, onStatusChange,
    signIn, signUp, signOut,
    get currentUser() { return { mode: 'cloud' }; },
    get status() { return connectionStatus; },
    get lastSaveAt() { return lastSaveAt; },
    get lastReadAt() { return lastReadAt; },
    get roomId() { return FIXED_ROOM_ID; }
  };
})();
