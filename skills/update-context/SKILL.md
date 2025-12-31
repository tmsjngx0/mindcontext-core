---
name: update-context
description: Save current session state to context files before clearing memory or switching tasks. Use when user says "update context", "save context", "sync context".
---

# Update Context

Capture current session state for continuity across memory clears.

## When to Use

- Before running `/clear`
- Before switching to different work
- End of significant work block
- User says "update context", "save context"

## What to Do

### 1. Gather Session Info

Ask user (or infer from conversation):
- What was accomplished this session?
- What's the next step?
- Any blockers or notes?

### 2. Update focus.json

Update `.project/context/focus.json`:

```json
{
  "session_summary": {
    "date": "[today]",
    "work_done": [
      "[item 1]",
      "[item 2]"
    ]
  },
  "next_session_tasks": [
    "[next step 1]",
    "[next step 2]"
  ],
  "last_updated": "[timestamp]"
}
```

### 3. Documentation Reminder

If significant work was done this session, check:

```
📝 Documentation check:
  - CHANGELOG.md updated? (for features/fixes)
  - README.md updated? (if user-facing changes)
  - progress.md updated? (detailed session notes)
```

### 4. Confirm

```
CONTEXT UPDATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Saved to: .project/context/focus.json

SESSION SUMMARY
  • [work_done item 1]
  • [work_done item 2]

NEXT SESSION
  • [next task 1]
  • [next task 2]

DOCUMENTATION
  [✓/✗] CHANGELOG.md
  [✓/✗] README.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ready for /clear or session switch
```

## Options

- `update context` - Interactive (asks what was done)
- `update context quick` - Auto-infer from recent activity

## Workflow

```
/update-context  → Save session state
/clear           → Clear Claude's memory
/sod             → Start fresh with context loaded
```

## Notes

- Generic context persistence
- Works with focus.json structure
- Session hooks will auto-load this context on next session start
