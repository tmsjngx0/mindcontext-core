---
name: start-of-day
description: Initialize development session with repo sync, context loading, and status overview. Use when user says "start of day", "sod", "init session", "morning sync", or "what did I do".
---

# Start of Day

Initialize your development session with repository sync and context loading.

## When to Use

- Starting a new work session
- Morning standup meetings
- Switching workstations
- Resuming after a break
- User says "sod", "start of day", "morning sync"

## What to Do

### 1. Repository Sync

Run these commands and report results:
```bash
git fetch origin
git status
git submodule update --remote --merge  # if .gitmodules exists
```

Report:
- Branch name
- Commits ahead/behind origin
- Uncommitted changes count
- Submodule sync status (if applicable)

### 2. Yesterday's Activity

```bash
git log --oneline --since="24 hours ago" --all
```

Display as bullet list of recent commits.

### 3. Current Focus

Read `.project/context/focus.json` (if exists):
- Show `current_focus` (name, type, status)
- Show `next_session_tasks` (if any)
- Show active sessions count

If no focus.json, show "No active focus set."

### 4. Quick Stats

- Commits in last 24h (count)
- Uncommitted changes (count)
- Active sessions (count)

### 5. Issues

Flag any problems:
- Uncommitted changes
- Unpushed commits
- Merge in progress

## Output Format

```
START OF DAY - [date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Repository: [name]
Branch: [branch]

SYNC STATUS
  [up to date / X ahead / X behind]

YESTERDAY
  • [commit or work item]
  • [commit or work item]

TODAY
  Focus: [current focus or "none"]
  Next: [next task or "not set"]

ISSUES
  [issues or "No issues"]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SESSION READY
```

## Notes

- Generic session initialization
- Works with any project structure
- Reads focus.json if available, works without it
- Can be extended by workflow plugins (mindcontext-skills, openspec)
