/* ============================================================
   Cloud Sync layer - Supabase
   All business data lives in Supabase, protected by RLS.
   No business data is stored in localStorage.
   ============================================================ */
(function () {
  'use strict';

  const cfg = window.SUPABASE_CONFIG || {};
  let client = null;
  let currentUser = null;
  let channel = null;
  let saveTimer = null;
  let pendingState = null;
  let callbacks = {};
  let applyingRealtime = false;

  function configReady() {
    return !!(cfg.url && cfg.anonKey && !String(cfg.url).includes('YOUR_'));
  }

  async function init(opts) {
    callbacks = opts || {};
    if (!configReady()) {
      throw new Error('יש להגדיר SUPABASE_CONFIG ב-supabase-config.js לפני פרסום ב-GitHub');
    }
    if (!window.supabase || !window.supabase.createClient) {
      throw new Error('ספריית Supabase לא נטענה');
    }
    client = window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });

    client.auth.onAuthStateChange(async (_event, session) => {
      currentUser = session?.user || null;
      if (callbacks.onAuth) callbacks.onAuth(currentUser);
      if (currentUser) {
        await loadCloudState();
        subscribeRealtime();
      } else {
        if (channel) { try { await client.removeChannel(channel); } catch (_) {} }
        channel = null;
      }
    });

    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    currentUser = data.session?.user || null;
    if (callbacks.onAuth) callbacks.onAuth(currentUser);

    if (currentUser) {
      const state = await loadCloudState();
      subscribeRealtime();
      return { user: currentUser, state };
    }
    return { user: null, state: null };
  }

  async function loadCloudState() {
    if (!currentUser) return null;
    const { data, error } = await client
      .from('app_state')
      .select('payload, updated_at')
      .eq('user_id', currentUser.id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      // First login: seed from the application's safe defaults.
      const fresh = {
        customers: JSON.parse(JSON.stringify(window.DEFAULT_CUSTOMERS || [])),
        trips: [],
        drivers: JSON.parse(JSON.stringify(window.DEFAULT_DRIVERS || [])),
        workingMonth: (typeof currentMonthStr === 'function' ? currentMonthStr() : ''),
        defaultVat: 18,
        deskPrefs: {},
        geminiApiKey: '',
        lastBackupAt: 0
      };
      await saveNow(fresh);
      if (callbacks.onState) callbacks.onState(fresh, 'initial');
      return fresh;
    }

    const state = data.payload || {};
    if (callbacks.onState) callbacks.onState(state, 'cloud');
    return state;
  }

  function subscribeRealtime() {
    if (!client || !currentUser) return;
    if (channel) { try { client.removeChannel(channel); } catch (_) {} }
    channel = client.channel('trip-manager-sync-' + currentUser.id)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'app_state', filter: 'user_id=eq.' + currentUser.id },
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
        if (typeof toast === 'function') toast('⚠️ השמירה לענן נכשלה: ' + (err.message || err), 5000);
      });
    }, 450);
  }

  async function saveNow(state) {
    if (!client || !currentUser) throw new Error('אין משתמש מחובר');
    applyingRealtime = true;
    try {
      const { error } = await client.from('app_state').upsert({
        user_id: currentUser.id,
        payload: state,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      if (error) throw error;
    } finally {
      setTimeout(() => { applyingRealtime = false; }, 300);
    }
  }

  async function signIn(email, password) {
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  }

  async function signUp(email, password) {
    const { data, error } = await client.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    if (!client) return;
    await client.auth.signOut();
  }

  window.CloudSync = {
    init, scheduleSave, saveNow, signIn, signUp, signOut,
    get currentUser() { return currentUser; },
    set currentUser(v) { currentUser = v; }
  };
})();
