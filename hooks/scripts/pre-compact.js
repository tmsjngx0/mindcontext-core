#!/usr/bin/env node

/**
 * pre-compact.js
 *
 * MindContext hook that runs before Claude Code compacts memory.
 * Saves critical context to focus.json and returns a system message
 * to preserve important information across the compaction.
 *
 * Input: JSON via stdin with { session_id, cwd, hook_event_name }
 * Output: JSON with { hookSpecificOutput: { hookEventName, systemMessage } }
 *
 * Token budget: <500 tokens for systemMessage
 * Time budget: <2 seconds
 */

const { readFocus, writeFocus, findProjectRoot } = require('./lib/focus-manager');

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
 * Build compact context message (<500 tokens).
 * Focuses on essential information needed to continue work.
 *
 * @param {Object} focus - Focus.json content
 * @returns {string} - Compact context message
 */
function buildCompactContext(focus) {
  const lines = [];
  const cf = focus.current_focus || {};

  lines.push('## MindContext Preserved');
  lines.push('');

  // Current focus (most important)
  if (cf.type && cf.type !== 'none') {
    lines.push(`**Focus:** ${cf.type} - ${cf.name || 'unnamed'}`);

    const parts = [];
    if (cf.epic) parts.push(`Epic: ${cf.epic}`);
    if (cf.task) parts.push(`Task: ${cf.task}`);
    if (cf.phase) parts.push(`Phase: ${cf.phase}`);
    if (parts.length > 0) {
      lines.push(parts.join(' | '));
    }
    lines.push('');
  }

  // Top 2 key decisions (brief)
  const kd = focus.key_decisions || {};
  const decisions = Object.entries(kd).slice(0, 2);
  if (decisions.length > 0) {
    lines.push('**Key Decisions:**');
    for (const [key, value] of decisions) {
      // Truncate long values
      const shortValue = String(value).length > 50
        ? String(value).slice(0, 47) + '...'
        : value;
      lines.push(`- ${key}: ${shortValue}`);
    }
    lines.push('');
  }

  // Next task (if available)
  const nextTasks = focus.next_session_tasks || [];
  if (nextTasks.length > 0) {
    lines.push(`**Next:** ${nextTasks[0]}`);
    lines.push('');
  }

  // Config reminders (if enforcement is on)
  const config = focus.config || {};
  if (config.tdd_enforcement === 'strict') {
    lines.push('**TDD:** Write tests before code');
  }
  if (config.feature_dev_required) {
    lines.push('**Workflow:** Use /feature-dev for tasks');
  }

  // Context files hint
  lines.push('');
  lines.push('> Full context: `.project/context/focus.json`');

  return lines.join('\n');
}

/**
 * Save memory context to focus.json for persistence.
 *
 * @param {string} cwd - Current working directory
 * @param {Object} focus - Current focus.json content
 * @returns {Promise<Object>} - Updated focus object
 */
async function saveMemoryContext(cwd, focus) {
  const projectRoot = findProjectRoot(cwd);
  if (!projectRoot) return focus;

  // Store compaction timestamp and basic state
  focus.memory_context = {
    last_compaction: new Date().toISOString(),
    preserved_focus: focus.current_focus?.name || null,
    preserved_epic: focus.current_focus?.epic || null,
    preserved_task: focus.current_focus?.task || null
  };

  focus.last_updated = new Date().toISOString();

  await writeFocus(cwd, focus);
  return focus;
}

/**
 * Main hook execution.
 */
async function main() {
  const hookInput = await parseInput();
  const cwd = hookInput.cwd || process.cwd();

  // Find project root
  const projectRoot = findProjectRoot(cwd);
  if (!projectRoot) {
    // Not a MindContext project - exit with minimal response
    const output = {
      hookSpecificOutput: {
        hookEventName: 'PreCompact'
      }
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  }

  // Read focus.json
  let focus = await readFocus(cwd);
  if (!focus || Object.keys(focus).length === 0) {
    // No focus data - exit with minimal response
    const output = {
      hookSpecificOutput: {
        hookEventName: 'PreCompact'
      }
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  }

  // Save memory context for persistence
  focus = await saveMemoryContext(cwd, focus);

  // Build compact context message
  const systemMessage = buildCompactContext(focus);

  // Output hook response with system message
  const output = {
    hookSpecificOutput: {
      hookEventName: 'PreCompact',
      systemMessage: systemMessage
    }
  };

  console.log(JSON.stringify(output));
  process.exit(0);
}

main().catch(err => {
  console.error('MindContext pre-compact hook error:', err.message);
  process.exit(1);
});
