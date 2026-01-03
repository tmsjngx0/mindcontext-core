/**
 * context-builder.js
 *
 * Tiered context building for MindContext Core session hooks.
 * Builds context strings at different verbosity levels to optimize token usage.
 *
 * Levels:
 *   - minimal (~250 tokens): Focus summary, 2-3 key decisions, next task, hint
 *   - standard (~500 tokens): + active task details, last session work
 *   - full (~2000 tokens): + all key decisions, progress summary
 *
 * Integrations:
 *   - OpenSpec: Detects openspec/ directory and active changes
 *   - Claude-Mem: Detects MCP availability (placeholder for future)
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

/**
 * Select top key decisions, prioritizing epic-related ones.
 *
 * @param {Object} keyDecisions - All key decisions from focus.json
 * @param {string} currentEpic - Current epic name to prioritize
 * @param {number} count - Number of decisions to select
 * @returns {Array<[string, string]>} - Selected [key, value] pairs
 */
function selectKeyDecisions(keyDecisions, currentEpic, count = 3) {
  if (!keyDecisions || Object.keys(keyDecisions).length === 0) {
    return [];
  }

  const entries = Object.entries(keyDecisions);

  // Separate epic-related and other decisions
  const epicRelated = [];
  const others = [];

  for (const [key, value] of entries) {
    // Check if key or value mentions the current epic
    const keyLower = key.toLowerCase();
    const valueLower = (value || '').toLowerCase();
    const epicLower = (currentEpic || '').toLowerCase();

    if (epicLower && (keyLower.includes(epicLower) || valueLower.includes(epicLower))) {
      epicRelated.push([key, value]);
    } else {
      others.push([key, value]);
    }
  }

  // Prioritize epic-related, fill with others
  const selected = [...epicRelated, ...others].slice(0, count);
  return selected;
}

/**
 * Format detected integrations for display.
 *
 * @param {Object} config - Config object from focus.json
 * @returns {string|null} - Formatted integrations line or null
 */
function formatIntegrations(config) {
  const integrations = config?.integrations;
  if (!integrations) return null;

  const parts = [];
  if (integrations.workflow) parts.push(integrations.workflow);
  if (integrations.tdd) parts.push(integrations.tdd);
  if (integrations.code_analysis) parts.push(integrations.code_analysis);

  return parts.length > 0 ? parts.join(' + ') : null;
}

/**
 * Build minimal context (~250 tokens).
 * Focus summary, 2-3 key decisions, next task, hint.
 *
 * @param {Object} focus - Focus.json content
 * @returns {string} - Minimal context markdown
 */
function buildMinimal(focus) {
  const lines = [];
  const cf = focus.current_focus || {};

  lines.push('# MindContext Session');
  lines.push('');

  // Show integrations if detected
  const integrationsLine = formatIntegrations(focus.config);
  if (integrationsLine) {
    lines.push(`**Integrations:** ${integrationsLine}`);
  }

  // One-line focus summary
  const focusType = cf.type || 'none';
  const focusName = cf.name || 'No active focus';
  lines.push(`**Focus:** ${focusType} - ${focusName}`);

  // Epic/Task/Phase on one line
  const parts = [];
  if (cf.epic) parts.push(`**Epic:** ${cf.epic}`);
  if (cf.task) parts.push(`**Task:** ${cf.task}`);
  if (cf.phase) parts.push(`**Phase:** ${cf.phase}`);
  if (parts.length > 0) {
    lines.push(parts.join(' | '));
  }

  lines.push('');

  // Top 2-3 key decisions (epic-related first)
  const selectedDecisions = selectKeyDecisions(
    focus.key_decisions,
    cf.epic,
    3
  );

  if (selectedDecisions.length > 0) {
    lines.push('**Key Decisions:**');
    for (const [key, value] of selectedDecisions) {
      // Truncate long values
      const shortValue = value.length > 60 ? value.slice(0, 57) + '...' : value;
      lines.push(`- ${key}: ${shortValue}`);
    }
    lines.push('');
  }

  // Next task (just the first one)
  const nextTasks = focus.next_session_tasks || [];
  if (nextTasks.length > 0) {
    lines.push(`**Next:** ${nextTasks[0]}`);
    lines.push('');
  }

  // Hint for more context
  lines.push('> Say "load context" for full project details');

  return lines.join('\n');
}

/**
 * Build standard context (~500 tokens).
 * Minimal + active task details + last session work.
 *
 * @param {Object} focus - Focus.json content
 * @param {string|null} taskContent - Active task file content (if available)
 * @returns {string} - Standard context markdown
 */
function buildStandard(focus, taskContent = null) {
  const lines = [];
  const cf = focus.current_focus || {};

  lines.push('# MindContext Session');
  lines.push('');

  // Current focus section
  lines.push('## Current Focus');
  lines.push(`- **Type:** ${cf.type || 'none'}`);
  lines.push(`- **Name:** ${cf.name || 'No active focus'}`);
  if (cf.epic) lines.push(`- **Epic:** ${cf.epic}`);
  if (cf.task) lines.push(`- **Task:** ${cf.task}`);
  if (cf.phase) lines.push(`- **Phase:** ${cf.phase}`);
  lines.push('');

  // Key decisions (top 3, epic-related first)
  const selectedDecisions = selectKeyDecisions(
    focus.key_decisions,
    cf.epic,
    3
  );

  if (selectedDecisions.length > 0) {
    lines.push('## Key Decisions');
    for (const [key, value] of selectedDecisions) {
      lines.push(`- **${key}:** ${value}`);
    }
    lines.push('');
  }

  // Active task acceptance criteria (if task content provided)
  if (taskContent) {
    const criteria = extractAcceptanceCriteria(taskContent);
    if (criteria.length > 0) {
      lines.push('## Active Task Criteria');
      for (const item of criteria.slice(0, 5)) {
        lines.push(item);
      }
      lines.push('');
    }
  }

  // Last session work
  const ss = focus.session_summary || {};
  if (ss.work_done && ss.work_done.length > 0) {
    lines.push('## Last Session');
    if (ss.date) lines.push(`**Date:** ${ss.date}`);
    for (const item of ss.work_done.slice(0, 3)) {
      lines.push(`- ${item}`);
    }
    lines.push('');
  }

  // Next tasks
  const nextTasks = focus.next_session_tasks || [];
  if (nextTasks.length > 0) {
    lines.push('## Next Tasks');
    for (const task of nextTasks.slice(0, 3)) {
      lines.push(`- ${task}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Build full context (~2000 tokens).
 * Standard + all key decisions + progress summary.
 *
 * @param {Object} focus - Focus.json content
 * @param {string|null} taskContent - Active task file content
 * @param {string|null} progressContent - Progress.md content
 * @returns {string} - Full context markdown
 */
function buildFull(focus, taskContent = null, progressContent = null) {
  const lines = [];
  const cf = focus.current_focus || {};

  lines.push('# MindContext: Full Project Context');
  lines.push('');

  // Current focus section
  lines.push('## Current Focus');
  lines.push(`- **Type:** ${cf.type || 'none'}`);
  lines.push(`- **Name:** ${cf.name || 'No active focus'}`);
  if (cf.epic) lines.push(`- **Epic:** ${cf.epic}`);
  if (cf.task) lines.push(`- **Task:** ${cf.task}`);
  if (cf.phase) lines.push(`- **Phase:** ${cf.phase}`);
  if (cf.status) lines.push(`- **Status:** ${cf.status}`);
  lines.push('');

  // ALL key decisions
  const kd = focus.key_decisions || {};
  if (Object.keys(kd).length > 0) {
    lines.push('## Key Decisions');
    for (const [key, value] of Object.entries(kd)) {
      lines.push(`- **${key}:** ${value}`);
    }
    lines.push('');
  }

  // Active task details
  if (taskContent) {
    const criteria = extractAcceptanceCriteria(taskContent);
    if (criteria.length > 0) {
      lines.push('## Active Task Criteria');
      for (const item of criteria) {
        lines.push(item);
      }
      lines.push('');
    }
  }

  // Session summary
  const ss = focus.session_summary || {};
  if (ss.work_done && ss.work_done.length > 0) {
    lines.push('## Last Session');
    if (ss.date) lines.push(`**Date:** ${ss.date}`);
    lines.push('**Work Done:**');
    for (const item of ss.work_done) {
      lines.push(`- ${item}`);
    }
    lines.push('');
  }

  // Next tasks
  const nextTasks = focus.next_session_tasks || [];
  if (nextTasks.length > 0) {
    lines.push('## Next Tasks');
    for (const task of nextTasks) {
      lines.push(`- ${task}`);
    }
    lines.push('');
  }

  // Progress summary (first 30 lines)
  if (progressContent) {
    const progressLines = progressContent.split('\n').slice(0, 30);
    lines.push('## Recent Progress');
    lines.push(progressLines.join('\n'));
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Extract acceptance criteria from task markdown content.
 *
 * @param {string} content - Task file content
 * @returns {Array<string>} - List of criteria lines
 */
function extractAcceptanceCriteria(content) {
  const lines = content.split('\n');
  const criteria = [];
  let inCriteria = false;

  for (const line of lines) {
    // Start capturing after "## Acceptance Criteria"
    if (line.match(/^##\s*Acceptance Criteria/i)) {
      inCriteria = true;
      continue;
    }

    // Stop at next section
    if (inCriteria && line.match(/^##\s/)) {
      break;
    }

    // Capture checklist items
    if (inCriteria && line.match(/^[-*]\s*\[[ x]\]/i)) {
      criteria.push(line);
    }
  }

  return criteria;
}

/**
 * Read task file content for the current focus.
 *
 * @param {string} projectRoot - Project root path
 * @param {Object} currentFocus - Current focus object
 * @returns {Promise<string|null>} - Task content or null
 */
async function readActiveTask(projectRoot, currentFocus) {
  if (!currentFocus?.epic || !currentFocus?.task) {
    return null;
  }

  // Try different task ID formats (001, 01, 1)
  const taskId = currentFocus.task.toString().padStart(3, '0');
  const taskPath = path.join(
    projectRoot,
    '.project',
    'epics',
    currentFocus.epic,
    `${taskId}.md`
  );

  try {
    return await fs.readFile(taskPath, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Read progress.md content.
 *
 * @param {string} projectRoot - Project root path
 * @returns {Promise<string|null>} - Progress content or null
 */
async function readProgress(projectRoot) {
  const progressPath = path.join(projectRoot, '.project', 'context', 'progress.md');
  try {
    return await fs.readFile(progressPath, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Build context based on level setting.
 *
 * @param {Object} focus - Focus.json content
 * @param {string} projectRoot - Project root path
 * @param {string} level - Context level (minimal|standard|full)
 * @returns {Promise<string>} - Context markdown
 */
async function buildContext(focus, projectRoot, level = 'minimal') {
  const cf = focus.current_focus;

  switch (level) {
    case 'full': {
      const taskContent = await readActiveTask(projectRoot, cf);
      const progressContent = await readProgress(projectRoot);
      return buildFull(focus, taskContent, progressContent);
    }

    case 'standard': {
      const taskContent = await readActiveTask(projectRoot, cf);
      return buildStandard(focus, taskContent);
    }

    case 'minimal':
    default:
      return buildMinimal(focus);
  }
}

/**
 * Detect OpenSpec integration status.
 *
 * @param {string} projectRoot - Project root path
 * @returns {Promise<{installed: boolean, activeChanges: number, currentChange: string|null}>}
 */
async function detectOpenSpec(projectRoot) {
  const openspecDir = path.join(projectRoot, 'openspec');
  const changesDir = path.join(openspecDir, 'changes');

  try {
    await fs.access(openspecDir);
  } catch {
    return { installed: false, activeChanges: 0, currentChange: null };
  }

  // Count active changes (exclude archive/)
  let activeChanges = 0;
  let currentChange = null;

  try {
    const entries = await fs.readdir(changesDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'archive') {
        activeChanges++;
        if (!currentChange) currentChange = entry.name;
      }
    }
  } catch {
    // No changes directory
  }

  return { installed: true, activeChanges, currentChange };
}

/**
 * Detect Claude-Mem MCP availability.
 * Checks if the claude-mem MCP tools are available.
 *
 * @returns {Promise<boolean>}
 */
async function detectClaudeMem() {
  // For now, we can't directly detect MCP availability from hooks
  // This is a placeholder that always returns false
  // In the future, we could check for specific environment variables
  // or configuration files that indicate claude-mem is configured
  return false;
}

/**
 * Build OpenSpec context section.
 *
 * @param {string} projectRoot - Project root path
 * @returns {Promise<string|null>} - OpenSpec context or null
 */
async function buildOpenSpecContext(projectRoot) {
  const openspec = await detectOpenSpec(projectRoot);

  if (!openspec.installed) {
    return null;
  }

  const lines = [];

  if (openspec.activeChanges > 0) {
    lines.push(`**OpenSpec:** ${openspec.activeChanges} active change(s)`);
    if (openspec.currentChange) {
      lines.push(`**Current Change:** ${openspec.currentChange}`);
    }
  } else {
    lines.push('**OpenSpec:** Initialized (no active changes)');
  }

  return lines.join('\n');
}

module.exports = {
  buildMinimal,
  buildStandard,
  buildFull,
  buildContext,
  selectKeyDecisions,
  extractAcceptanceCriteria,
  readActiveTask,
  readProgress,
  detectOpenSpec,
  detectClaudeMem,
  buildOpenSpecContext
};
