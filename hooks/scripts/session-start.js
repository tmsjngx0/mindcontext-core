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
const { writeFocus } = require('./lib/focus-manager');

/**
 * Build one-time onboarding prompt for missing workflow integration.
 * Only shows once per project (tracked via focus.json onboarding.shown).
 *
 * @param {Object} focus - Focus.json content
 * @param {string} cwd - Current working directory
 * @returns {Promise<{prompt: string|null, focus: Object}>}
 */
async function buildOnboardingPrompt(focus, cwd) {
  // Already shown onboarding - skip
  if (focus.onboarding?.shown) {
    return { prompt: null, focus };
  }

  // Workflow already detected - mark onboarding complete
  const integrations = focus.config?.integrations || {};
  if (integrations.workflow) {
    focus.onboarding = { shown: true, date: new Date().toISOString().split('T')[0] };
    await writeFocus(cwd, focus);
    return { prompt: null, focus };
  }

  // Show onboarding prompt once
  focus.onboarding = { shown: true, date: new Date().toISOString().split('T')[0] };
  await writeFocus(cwd, focus);

  const prompt = `
**Welcome to MindContext!** No workflow plugin detected.

Consider installing one for structured development:

**mindcontext-skills** - PRD → Epic → Task methodology
\`\`\`
/plugin marketplace add tmsjngx0/mindcontext-skills
/plugin install mindcontext-skills@tmsjngx0
\`\`\`

**openspec** - Spec-driven development
\`\`\`
/plugin marketplace add Fission-AI/openspec
/plugin install openspec@Fission-AI
\`\`\`

Or continue with core-only (session persistence + context injection).
`;

  return { prompt, focus };
}

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

  // Check for one-time onboarding prompt
  const onboarding = await buildOnboardingPrompt(focus, cwd);
  focus = onboarding.focus;

  // Build context based on level
  let context = await buildContext(focus, projectRoot, level);

  // Append onboarding prompt if first run
  if (onboarding.prompt) {
    context += '\n' + onboarding.prompt;
  }

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
