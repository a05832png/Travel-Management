/* ============================================================
   Local Sync layer - no auth, no cloud.
   Drop-in replacement for cloud-sync.js
   ============================================================ */
(function () {
  'use strict';

  const LS_KEY = 'tripManager_state_v1';
  let saveTimer = null;
  let pendingState = null;
  let callbacks = {};

  function readLocal() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Local read failed', e);
      return null;
    }
  }

  function writeLocal(state) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Local write failed', e);
    }
  }

  async function init(opts) {
    callbacks = opts || {};
    const state = readLocal();
    const user = { email: 'local@device', id: 'local' };

    if (callbacks.onAuth) callbacks.onAuth(user);

    if (state && callbacks.onState) {
      // defer so app can finish setting up
      setTimeout(() => callbacks.onState(state, 'local'), 0);
    }
    return { user, state };
  }

  function scheduleSave(state) {
    pendingState = state;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      writeLocal(pendingState);
    }, 250);
  }

  async function saveNow(state) {
    writeLocal(state);
  }

  // Stub auth methods (kept so nothing else breaks)
  async function signIn() { return { email: 'local@device', id: 'local' }; }
  async function signUp() { return { user: { email: 'local@device', id: 'local' } }; }
  async function signOut() { /* no-op */ }

  window.CloudSync = {
    init,
    scheduleSave,
    saveNow,
    signIn,
    signUp,
    signOut,
    currentUser: { email: 'local@device', id: 'local' }
  };
})();
