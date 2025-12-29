---
name: focus-state
description: Show or set current work focus. Use when user says "what am I working on", "show focus", "set focus to X", or "clear focus".
---

# Focus State

Manage current work focus in `.project/context/focus.json`.

## When to Use

- User asks "what am I working on?"
- Setting focus: "focus on [name]"
- Clearing focus: "clear focus"
- Checking status: "show focus"

## Operations

### Show Current Focus

Read `.project/context/focus.json` and display:

```
CURRENT FOCUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: [current_focus.name or "none"]
Type: [current_focus.type or "none"]
Status: [current_focus.status or "idle"]
Started: [current_focus.started or "n/a"]

Last Updated: [last_updated]
```

### Set Focus

Update `current_focus` in focus.json:

```json
{
  "current_focus": {
    "type": "custom",
    "name": "[user provided]",
    "started": "[timestamp]",
    "status": "in_progress"
  },
  "last_updated": "[timestamp]"
}
```

Output:
```
✓ Focus set to: [name]
```

### Clear Focus

Reset `current_focus`:

```json
{
  "current_focus": {
    "type": "none",
    "name": null,
    "started": null,
    "status": "idle"
  },
  "last_updated": "[timestamp]"
}
```

Output:
```
✓ Focus cleared
```

## File Location

Default: `.project/context/focus.json`

If file doesn't exist:
```
No focus.json found. Initialize with: project init
```

## Notes

- Generic focus management
- Works with `current_focus` object in focus.json
- Workflow plugins can extend with specific focus types (epic, task, spec, etc.)
