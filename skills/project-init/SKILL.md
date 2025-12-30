---
name: project-init
description: Initialize project with context management structure. Creates .project/context/, focus.json, and CLAUDE.md. Use when user says "init project", "initialize", "setup project", or "project init".
---

# Project Init (Core)

Initialize any project with basic context management structure.

## When to Use

- Starting a new project
- Adding context management to existing project
- User says "init", "initialize project", "setup project"

## What to Do

### 1. Check Existing Structure

```bash
# Check if already initialized
if [ -d ".project/context" ]; then
  echo "Project already initialized"
  # Show current state
fi

# Check for git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  git init
  echo "✓ Initialized git repository"
fi
```

### 2. Create Directory Structure

```bash
mkdir -p .project/context
```

### 3. Detect Installed Integrations

Check for installed plugins/tools and store in config:

```javascript
function detectIntegrations() {
  const integrations = {
    workflow: null,      // "mindcontext-skills" | "openspec" | null
    tdd: null,           // "superpowers" | "built-in" | null
    code_analysis: null  // "feature-dev" | "serena" | null
  };

  // Detect workflow plugin
  if (fs.existsSync('.project/prds') || fs.existsSync('.project/epics')) {
    integrations.workflow = 'mindcontext-skills';
  } else if (fs.existsSync('.openspec') || fs.existsSync('specs/')) {
    integrations.workflow = 'openspec';
  }

  // Detect TDD tool
  if (fs.existsSync('.superpowers')) {
    integrations.tdd = 'superpowers';
  }

  // Detect code analysis
  if (fs.existsSync('.serena')) {
    integrations.code_analysis = 'serena';
  }

  return integrations;
}
```

**Detection markers:**

| Plugin | Detection |
|--------|-----------|
| mindcontext-skills | `.project/prds/` or `.project/epics/` exists |
| openspec | `.openspec/` or `specs/` exists |
| superpowers | `.superpowers/` config exists |
| feature-dev | Check plugin registry (manual) |
| serena | `.serena/` config exists |

### 4. Create focus.json

Include detected integrations in config:

```json
{
  "current_focus": {
    "type": "none",
    "name": null,
    "started": null,
    "status": "idle"
  },
  "key_decisions": {},
  "session_summary": {
    "date": null,
    "work_done": []
  },
  "next_session_tasks": [],
  "last_updated": "[timestamp]",
  "context_level": "minimal",
  "active_sessions": {},
  "config": {
    "workflow_enforcement": "remind",
    "integrations": {
      "workflow": null,
      "tdd": null,
      "code_analysis": null
    }
  }
}
```

**After detection, update integrations:**

```json
"integrations": {
  "workflow": "mindcontext-skills",
  "tdd": "superpowers",
  "code_analysis": "feature-dev"
}
```

### 5. Create CLAUDE.md

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

[Brief description - ask user or infer from package.json/README]

## Development Guidelines

- Follow existing code patterns
- Write tests for new functionality
- Use meaningful commit messages

## Context Files

- `.project/context/focus.json` - Current work focus and session state
- `.project/context/progress.md` - Session progress notes

## Commands

- `/sod` - Start of day (sync and load context)
- `/eod` - End of day (check uncommitted work)
- `/focus` - Show/set current focus
- `/update-context` - Save session state
- `/commit` - Smart commit with conventional format
```

### 6. Create progress.md

```markdown
# Progress

Session progress and notes.

## Current Session

[Auto-updated by context hooks]
```

### 7. Output

```
PROJECT INITIALIZED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Created:
  ✓ .project/context/focus.json
  ✓ .project/context/progress.md
  ✓ CLAUDE.md

Detected Integrations:
  Workflow: [mindcontext-skills | openspec | none]
  TDD: [superpowers | built-in | none]
  Code Analysis: [feature-dev | serena | none]

Next steps:
  • Set focus: /focus on [task name]
  • Start working: /sod
```

### 8. Suggest Missing Integrations

If no workflow detected:
```
No workflow plugin detected.

Options:
  • mindcontext-skills - PRD → Epic → Task methodology
  • openspec - Spec-driven development

Install: /plugin install [name]@[marketplace]
```

## Notes

- Generic initialization for any project
- Creates minimal structure for session persistence
- Workflow plugins (mindcontext-skills, openspec) can extend with additional structure
- Does NOT create PRD/Epic structure (that's workflow-specific)
