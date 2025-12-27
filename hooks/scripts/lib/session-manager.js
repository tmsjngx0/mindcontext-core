/**
 * session-manager.js
 *
 * Session tracking for MindContext hooks.
 * Manages active_sessions in focus.json for multi-session awareness.
 */

const { readFocus, writeFocus, findProjectRoot } = require('./focus-manager');

/**
 * Build a focus key string from current focus object.
 *
 * @param {Object} currentFocus - Current focus from focus.json
 * @returns {string} - Focus key like "epic:context-management/task:003"
 */
function buildFocusKey(currentFocus) {
  if (!currentFocus) return 'none';

  const parts = [];
  if (currentFocus.epic) parts.push(`epic:${currentFocus.epic}`);
  if (currentFocus.task) parts.push(`task:${currentFocus.task}`);

  return parts.length > 0 ? parts.join('/') : currentFocus.name || 'none';
}

/**
 * Register a new session in focus.json.
 *
 * @param {string} cwd - Current working directory
 * @param {string} sessionId - Unique session ID from Claude Code
 * @param {Object} focus - Current focus.json content
 * @returns {Promise<Object>} - Updated focus object
 */
async function registerSession(cwd, sessionId, focus) {
  const projectRoot = findProjectRoot(cwd);
  if (!projectRoot) return focus;

  // Initialize active_sessions if missing
  if (!focus.active_sessions) {
    focus.active_sessions = {};
  }

  // Register this session
  focus.active_sessions[sessionId] = {
    focus: buildFocusKey(focus.current_focus),
    started: new Date().toISOString(),
    last_active: new Date().toISOString(),
    cwd: cwd
  };

  // Update timestamp
  focus.last_updated = new Date().toISOString();

  // Write atomically
  await writeFocus(cwd, focus);

  return focus;
}

/**
 * Remove a session from focus.json.
 *
 * @param {string} cwd - Current working directory
 * @param {string} sessionId - Session ID to remove
 * @param {Object} focus - Current focus.json content
 * @returns {Promise<Object>} - Updated focus object
 */
async function removeSession(cwd, sessionId, focus) {
  const projectRoot = findProjectRoot(cwd);
  if (!projectRoot) return focus;

  // Remove session if exists
  if (focus.active_sessions && focus.active_sessions[sessionId]) {
    delete focus.active_sessions[sessionId];
  }

  // Update timestamp
  focus.last_updated = new Date().toISOString();

  // Write atomically
  await writeFocus(cwd, focus);

  return focus;
}

/**
 * Get active sessions for the same project (by cwd).
 * Used to detect concurrent sessions.
 *
 * @param {Object} focus - Focus.json content
 * @param {string} currentSessionId - Current session to exclude
 * @param {string} currentCwd - Current working directory
 * @param {number} staleMinutes - Consider sessions older than this as stale
 * @returns {Array<Object>} - List of other active sessions
 */
function getActiveSessions(focus, currentSessionId, currentCwd, staleMinutes = 30) {
  if (!focus.active_sessions) return [];

  const now = new Date();
  const staleThreshold = staleMinutes * 60 * 1000;

  const activeSessions = [];

  for (const [id, data] of Object.entries(focus.active_sessions)) {
    // Skip current session
    if (id === currentSessionId) continue;

    // Only include sessions with same cwd (same project)
    if (data.cwd !== currentCwd) continue;

    // Skip stale sessions
    const lastActive = new Date(data.last_active || data.started);
    if (now - lastActive > staleThreshold) continue;

    activeSessions.push({
      id,
      ...data
    });
  }

  return activeSessions;
}

/**
 * Build concurrent session warning message.
 *
 * @param {Array<Object>} activeSessions - Other active sessions
 * @returns {string|null} - Warning message or null
 */
function buildConcurrencyWarning(activeSessions) {
  if (!activeSessions || activeSessions.length === 0) return null;

  const count = activeSessions.length;
  const sessionWord = count === 1 ? 'session' : 'sessions';

  return `\n> **Warning:** ${count} other active ${sessionWord} detected for this project. Changes may conflict.`;
}

/**
 * Save a brief session summary before ending.
 *
 * @param {string} cwd - Current working directory
 * @param {Object} focus - Current focus.json content
 * @param {Array<string>} workDone - List of work items completed
 * @returns {Promise<Object>} - Updated focus object
 */
async function saveSummary(cwd, focus, workDone = []) {
  const projectRoot = findProjectRoot(cwd);
  if (!projectRoot) return focus;

  // Update session summary
  focus.session_summary = {
    date: new Date().toISOString().split('T')[0],
    work_done: workDone.length > 0 ? workDone : (focus.session_summary?.work_done || [])
  };

  // Update timestamp
  focus.last_updated = new Date().toISOString();

  // Write atomically
  await writeFocus(cwd, focus);

  return focus;
}

/**
 * Update last_active timestamp for a session.
 *
 * @param {string} cwd - Current working directory
 * @param {string} sessionId - Session ID to update
 * @param {Object} focus - Current focus.json content
 * @returns {Promise<Object>} - Updated focus object
 */
async function touchSession(cwd, sessionId, focus) {
  const projectRoot = findProjectRoot(cwd);
  if (!projectRoot) return focus;

  if (focus.active_sessions && focus.active_sessions[sessionId]) {
    focus.active_sessions[sessionId].last_active = new Date().toISOString();
  }

  focus.last_updated = new Date().toISOString();
  await writeFocus(cwd, focus);

  return focus;
}

/**
 * Clean up stale sessions from focus.json.
 *
 * @param {string} cwd - Current working directory
 * @param {Object} focus - Current focus.json content
 * @param {number} staleMinutes - Remove sessions older than this
 * @returns {Promise<Object>} - Updated focus object
 */
async function cleanupStaleSessions(cwd, focus, staleMinutes = 60) {
  const projectRoot = findProjectRoot(cwd);
  if (!projectRoot || !focus.active_sessions) return focus;

  const now = new Date();
  const staleThreshold = staleMinutes * 60 * 1000;
  let cleaned = false;

  for (const [id, data] of Object.entries(focus.active_sessions)) {
    const lastActive = new Date(data.last_active || data.started);
    if (now - lastActive > staleThreshold) {
      delete focus.active_sessions[id];
      cleaned = true;
    }
  }

  if (cleaned) {
    focus.last_updated = new Date().toISOString();
    await writeFocus(cwd, focus);
  }

  return focus;
}

module.exports = {
  buildFocusKey,
  registerSession,
  removeSession,
  getActiveSessions,
  buildConcurrencyWarning,
  saveSummary,
  touchSession,
  cleanupStaleSessions
};
