/* ============================================================
   Auto Cloud Sync – no login screen.
   Room ID is derived from SUPABASE_CONFIG.roomKey (hashed).
   ============================================================ */
(function () {
  'use strict';

  const cfg = window.SUPABASE_CONFIG || {};
  let client = null;
  let currentRoomId = null;
  let channel = null;
  let saveTimer = null;
  let pendingState = null;
  let callbacks = {};
  let applyingRealtime = false;

  function configReady() {
    return !!(cfg.url && cfg.anonKey && !String(cfg.url).includes('YOUR_'));
  }

  async function sha256(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function computeRoomId() {
    const key = String(cfg.roomKey || 'trip-manager-default-room').trim();
    // hash so the raw key is never sent or stored in the DB
    const h = await sha256('tripmanager-v1:' + key);
    return h.slice(0, 40);
  }

  async function init(opts) {
    callbacks = opts || {};

    if (!configReady()) {
      // No cloud configured → run in pure-local mode so app still works
      const local = safeReadLocal();
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

    currentRoomId = await computeRoomId();

    // Load (or seed) the room
    const { data, error } = await client
      .from('app_rooms')
      .select('payload, updated_at')
      .eq('room_id', currentRoomId)
      .maybeSingle();
    if (error) throw error;

    let state;
    if (!data) {
      state = defaultState();
      await saveNow(state);       // create empty room
      if (callbacks.onState) callbacks.onState(state, 'initial');
    } else {
      state = data.payload || defaultState();
      if (callbacks.onState) callbacks.onState(state, 'cloud');
    }

    subscribeRealtime();
    if (callbacks.onAuth) callbacks.onAuth({ mode: 'cloud', roomId: currentRoomId });
    return { user: { mode: 'cloud', roomId: currentRoomId }, state };
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

  function subscribeRealtime() {
    if (!client || !currentRoomId) return;
    if (channel) { try { client.removeChannel(channel); } catch (_) {} }
    channel = client
      .channel('trip-manager-room-' + currentRoomId)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'app_rooms',
          filter: 'room_id=eq.' + currentRoomId },
        payload => {
          if (applyingRealtime) return;
          const next = payload?.new?.payload;
          if (next && callbacks.onState) callbacks.onState(next, 'realtime');
        })
      .subscribe();
  }

  function scheduleSave(state) {
    pendingState = state;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveNow(pendingState).catch(err => {
        console.error('Cloud save failed', err);
        if (typeof toast === 'function')
          toast('⚠️ שמירה נכשלה: ' + (err.message || err), 5000);
      });
    }, 450);
  }

  async function saveNow(state) {
    if (!client || !currentRoomId) {
      // offline / local-only fallback
      writeLocal(state);
      return;
    }
    applyingRealtime = true;
    try {
      const { error } = await client.from('app_rooms').upsert({
        room_id: currentRoomId,
        payload: state,
        updated_at: new Date().toISOString()
      }, { onConflict: 'room_id' });
      if (error) throw error;
      writeLocal(state); // local mirror as offline backup
    } finally {
      setTimeout(() => { applyingRealtime = false; }, 300);
    }
  }

  // Local mirror helpers (used as offline cache / fallback)
  const LS_KEY = 'tripManager_localMirror_v1';
  function writeLocal(state) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (_) {}
  }
  function safeReadLocal() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  // No-op auth stubs so nothing else in the app breaks
  async function signIn() { return null; }
  async function signUp() { return null; }
  function signOut() { /* nothing to sign out of */ }

  window.CloudSync = {
    init,
    scheduleSave,
    saveNow,
    signIn,
    signUp,
    signOut,
    get currentUser() { return currentRoomId ? { roomId: currentRoomId } : null; }
  };
})();
