#!/usr/bin/env node

/**
 * PreToolUse hook: Remind to update CHANGELOG/README before git commit
 */

const fs = require('fs');
const path = require('path');

// Get tool info from environment
const toolName = process.env.CLAUDE_TOOL_NAME || '';
const toolInput = process.env.CLAUDE_TOOL_INPUT || '';

// Only check for Bash tool with git commit
if (toolName !== 'Bash') {
  process.exit(0);
}

// Check if this is a git commit command
if (!toolInput.includes('git commit') && !toolInput.includes('git add') === false) {
  process.exit(0);
}

// Check if we're in a plugin directory (has CHANGELOG.md)
const cwd = process.env.CLAUDE_WORKING_DIRECTORY || process.cwd();
const changelogPath = path.join(cwd, 'CHANGELOG.md');

if (!fs.existsSync(changelogPath)) {
  process.exit(0);
}

// Output reminder
console.log(`
⚠️  COMMIT REMINDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before committing, ensure you've updated:
  • CHANGELOG.md - Document changes
  • README.md - If features changed
  • plugin.json - Bump version if releasing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

process.exit(0);
