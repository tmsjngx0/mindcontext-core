#!/usr/bin/env node
/**
 * session-start.js
 *
 * MindContext hook that runs when a Claude Code session starts.
 * Injects project context automatically with tiered verbosity levels.
 *
 * Input: JSON via stdin with { session_id, cwd, hook_event_name, source }
 * Output: JSON with { hookSpecificOutput: { hookEventName, additionalContext } }
 *
 * Context levels (set via focus.json context_level field):
 *   - minimal (~250 tokens): Focus summary, 2-3 key decisions, next task
 *   - standard (~500 tokens): + active task details, last session work
 *   - full (~2000 tokens): + all key decisions, progress summary
 */

const { readFocus, findProjectRoot } = require('./lib/focus-manager');
const { buildContext } = require('./lib/context-builder');
const {
  registerSession,
  getActiveSessions,
  buildConcurrencyWarning,
  cleanupStaleSessions
} = require('./lib/session-manager');

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
 * Main hook execution.
 */
async function main() {
  const hookInput = await parseInput();
  const sessionId = hookInput.session_id || 'unknown';
  const cwd = hookInput.cwd || process.cwd();

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

  // Clean up stale sessions (older than 60 minutes)
  focus = await cleanupStaleSessions(cwd, focus, 60);

  // Register this session
  focus = await registerSession(cwd, sessionId, focus);

  // Check for concurrent sessions (same project only)
  const activeSessions = getActiveSessions(focus, sessionId, cwd, 30);
  const concurrencyWarning = buildConcurrencyWarning(activeSessions);

  // Get context level (default to minimal)
  const level = focus.context_level || 'minimal';

  // Build context based on level
  let context = await buildContext(focus, projectRoot, level);

  // Append concurrency warning if applicable
  if (concurrencyWarning) {
    context += '\n' + concurrencyWarning;
  }

  // Output hook response
  const output = {
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: context
    }
  };

  console.log(JSON.stringify(output));
  process.exit(0);
}

main().catch(err => {
  console.error('MindContext session-start hook error:', err.message);
  process.exit(1);
});
