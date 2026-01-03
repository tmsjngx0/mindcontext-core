---
description: Find and display the next task from openspec changes
argument-hint: [change-name]
---

# Next Task

Find the next incomplete task from OpenSpec changes.

## Step 1: Check Focus

First, check `.project/context/focus.json` for an active change:

```bash
cat .project/context/focus.json 2>/dev/null
```

Look for `current_focus.openspec_change` or `current_focus.name` where `type` is "change".

**If focus.json has an active change:** Use that change directly (skip to Step 3).

**If no focus or focus.json missing:** Continue to Step 2.

## Step 2: Check for OpenSpec

Check if openspec directory exists:

```bash
ls openspec/changes/ 2>/dev/null
```

**If no openspec directory:**
```
No openspec/ directory found.

To use /next, either:
1. Run: openspec init --tools claude
2. Or run: /project-init and choose openspec workflow
```
Exit here.

**Find active changes** (exclude `archive/`):

```bash
ls -d openspec/changes/*/ 2>/dev/null | grep -v archive
```

**If no changes found:**
```
No active changes in openspec/changes/

Create a new change with: /openspec:proposal
```
Exit here.

## Step 3: Select Change

**Priority order:**
1. If argument provided (`$ARGUMENTS`): Use that change name
2. If focus.json has `current_focus.openspec_change`: Use that
3. If single change found: Use it directly
4. If multiple changes: Ask user

**Multiple changes prompt:**
```json
{
  "questions": [{
    "question": "Which change do you want to work on?",
    "header": "Change",
    "options": [
      {"label": "[change-1]", "description": "[X incomplete tasks]"},
      {"label": "[change-2]", "description": "[Y incomplete tasks]"}
    ],
    "multiSelect": false
  }]
}
```

## Step 4: Parse Tasks

Read `openspec/changes/[change-name]/tasks.md` and find incomplete tasks:

Pattern to match: `- [ ]` (incomplete task)
Pattern to skip: `- [x]` (complete task)

Find the **first** incomplete task.

## Step 5: Update Focus

Update `.project/context/focus.json` to track the current change:

Read existing focus.json, then update `current_focus`:

```json
{
  "current_focus": {
    "type": "change",
    "name": "[change-name]",
    "openspec_change": "[change-name]",
    "task": "[task-id]",
    "phase": "implementation",
    "status": "in_progress"
  }
}
```

**Important:** Preserve all other fields in focus.json, only update `current_focus`.

## Step 6: Display Next Task

Show the first incomplete task:

```
NEXT TASK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Change: [change-name]
Task:   [task description]
File:   openspec/changes/[change-name]/tasks.md

Progress: [X]/[Y] tasks complete

To implement: /openspec:apply [change-name]
To mark complete: edit tasks.md, change [ ] to [x]
```

## All Tasks Complete

If all tasks in the change are complete:

```
ALL TASKS COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All tasks in [change-name] are done!

Next steps:
1. Run: openspec validate [change-name] --strict
2. Archive: /openspec:archive [change-name]
```
