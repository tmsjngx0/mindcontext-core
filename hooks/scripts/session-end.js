#!/usr/bin/env node
/**
 * session-end.js
 *
 * MindContext hook that runs when a Claude Code session ends.
 * Cleans up session tracking and optionally saves a brief summary.
 *
 * Input: JSON via stdin with { session_id, cwd, hook_event_name, reason }
 * Output: JSON with { hookSpecificOutput: { hookEventName } }
 *
 * Reasons for session end:
 *   - clear: Session cleared with /clear command
 *   - logout: User logged out
 *   - prompt_input_exit: User exited while prompt input was visible
 *   - other: Other exit reasons
 */

const { readFocus, findProjectRoot } = require('./lib/focus-manager');
const { removeSession, saveSummary } = require('./lib/session-manager');

/**
 * Parse hook input from stdin.
 *
 * @returns {Promise<Object>} - Parsed hook input
 */
async function parseInput() {
  let input = '';
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  try {
    return JSON.parse(input);
  } catch {
    return { cwd: process.cwd() };
  }
}

/**
 * Extract brief summary from session.
 * This is a placeholder - in practice, the summary would come from
 * the conversation or be passed via update-context skill.
 *
 * @param {Object} focus - Current focus.json content
 * @param {string} reason - Session end reason
 * @returns {Array<string>} - Work items (empty if no updates)
 */
function extractSessionSummary(focus, reason) {
  // For now, preserve existing summary
  // Future: could parse transcript or use Claude's summary
  return focus.session_summary?.work_done || [];
}

/**
 * Main hook execution.
 */
async function main() {
  const hookInput = await parseInput();
  const sessionId = hookInput.session_id || 'unknown';
  const cwd = hookInput.cwd || process.cwd();
  const reason = hookInput.reason || 'unknown';

  // Find project root
  const projectRoot = findProjectRoot(cwd);
  if (!projectRoot) {
    // Not a MindContext project - exit silently
    process.exit(0);
  }

  // Read focus.json
  let focus = await readFocus(cwd);
  if (!focus || Object.keys(focus).length === 0) {
    // No focus data - exit silently
    process.exit(0);
  }

  // Extract and save session summary
  const workDone = extractSessionSummary(focus, reason);
  if (workDone.length > 0) {
    focus = await saveSummary(cwd, focus, workDone);
  }

  // Remove this session from active_sessions
  focus = await removeSession(cwd, sessionId, focus);

  // Output hook response
  const output = {
    hookSpecificOutput: {
      hookEventName: 'SessionEnd'
    }
  };

  console.log(JSON.stringify(output));
  process.exit(0);
}

main().catch(err => {
  console.error('MindContext session-end hook error:', err.message);
  process.exit(1);
});
