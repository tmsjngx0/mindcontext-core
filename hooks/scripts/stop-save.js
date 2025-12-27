#!/usr/bin/env node

/**
 * stop-save.js
 *
 * MindContext hook that runs when Claude Code stops (between responses).
 * Updates the session's last_active timestamp for concurrency detection.
 *
 * PERFORMANCE CRITICAL: Must complete in <500ms
 * - No context building
 * - Minimal file I/O (single read + write)
 * - Fast exit on non-MindContext projects
 *
 * Input: JSON via stdin with { session_id, cwd, hook_event_name }
 * Output: JSON with { hookSpecificOutput: { hookEventName } }
 */

const { readFocus, findProjectRoot } = require('./lib/focus-manager');
const { touchSession } = require('./lib/session-manager');

/**
 * Parse hook input from stdin.
 * Uses a timeout to prevent blocking on empty stdin.
 *
 * @returns {Promise<Object>} - Parsed hook input
 */
async function parseInput() {
  return new Promise((resolve) => {
    let input = '';
    const timeout = setTimeout(() => {
      resolve({ cwd: process.cwd() });
    }, 100); // 100ms timeout for stdin

    process.stdin.on('data', (chunk) => {
      input += chunk;
    });

    process.stdin.on('end', () => {
      clearTimeout(timeout);
      try {
        resolve(JSON.parse(input));
      } catch {
        resolve({ cwd: process.cwd() });
      }
    });

    // Handle case where stdin is empty/closed
    process.stdin.on('error', () => {
      clearTimeout(timeout);
      resolve({ cwd: process.cwd() });
    });
  });
}

/**
 * Main hook execution.
 */
async function main() {
  const hookInput = await parseInput();
  const sessionId = hookInput.session_id || 'unknown';
  const cwd = hookInput.cwd || process.cwd();

  // Fast exit if not a MindContext project
  const projectRoot = findProjectRoot(cwd);
  if (!projectRoot) {
    process.exit(0);
  }

  // Read focus.json
  let focus = await readFocus(cwd);
  if (!focus || Object.keys(focus).length === 0) {
    // No focus data - exit silently
    process.exit(0);
  }

  // Update last_active timestamp for this session
  // This is used for stale session detection
  if (focus.active_sessions && focus.active_sessions[sessionId]) {
    focus = await touchSession(cwd, sessionId, focus);
  }

  // Output hook response (minimal)
  const output = {
    hookSpecificOutput: {
      hookEventName: 'Stop'
    }
  };

  console.log(JSON.stringify(output));
  process.exit(0);
}

main().catch(() => {
  // Silent failure - don't block Claude Code
  process.exit(0);
});
