---
name: end-of-day
description: Wrap up development session by checking uncommitted work and saving session state. Use when user says "end of day", "eod", "wrap up", "done for today", or "switching workstations".
---

# End of Day

Wrap up your development session safely.

## When to Use

- Ending a work session
- Switching workstations
- Before a break
- User says "eod", "end of day", "wrap up", "done for today"

## What to Do

### 1. Check Uncommitted Changes

```bash
git status --short
```

If changes exist:
```
⚠️ UNCOMMITTED CHANGES
  [list of files]

Commit now? (yes/no/stash)
```

### 2. Check Unpushed Commits

```bash
git log origin/[branch]..HEAD --oneline
```

If unpushed:
```
⚠️ UNPUSHED COMMITS
  [list of commits]

Push now? (yes/no)
```

### 3. Save Session State

Update `.project/context/focus.json` (if exists):
- Set `session_summary.date` to today
- Preserve `session_summary.work_done` (or ask user for summary)
- Update `last_updated` timestamp

### 4. Documentation Reminder

Check if documentation needs updating:

```
📝 Documentation check:
  - CHANGELOG.md updated? (for features/fixes added today)
  - README.md updated? (if user-facing changes)
  - progress.md updated? (session notes)
```

If significant work was done (features/fixes), remind user before ending.

### 5. Summary

```
END OF DAY - [date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHECKLIST
  [✓/✗] All changes committed
  [✓/✗] All commits pushed
  [✓/✗] Session state saved
  [✓/✗] Documentation updated

WORK DONE TODAY
  • [item from session_summary or git log]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SESSION ENDED
```

## Options

- `eod` - Interactive mode (prompts for uncommitted)
- `eod quick` - Just show status, no prompts

## Notes

- Generic session wrap-up
- Works with any project structure
- Updates focus.json if available
- Can be extended by workflow plugins
