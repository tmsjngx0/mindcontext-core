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

### 3. Create focus.json

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
    "workflow_enforcement": "remind"
  }
}
```

### 4. Create CLAUDE.md

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

### 5. Create progress.md

```markdown
# Progress

Session progress and notes.

## Current Session

[Auto-updated by context hooks]
```

### 6. Output

```
PROJECT INITIALIZED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Created:
  ✓ .project/context/focus.json
  ✓ .project/context/progress.md
  ✓ CLAUDE.md

Next steps:
  • Set focus: /focus on [task name]
  • Start working: /sod
```

## Notes

- Generic initialization for any project
- Creates minimal structure for session persistence
- Workflow plugins (mindcontext-skills, openspec) can extend with additional structure
- Does NOT create PRD/Epic structure (that's workflow-specific)
