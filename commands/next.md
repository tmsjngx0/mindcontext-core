---
description: Find and display the next task from openspec changes
argument-hint: [change-name]
---

# Next Task

Find the next incomplete task from OpenSpec changes.

## Step 1: Check for OpenSpec

First, check if openspec directory exists:

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

## Step 2: Find Active Changes

List directories in `openspec/changes/` (exclude `archive/`):

```bash
ls -d openspec/changes/*/ 2>/dev/null | grep -v archive
```

**If no changes found:**
```
No active changes in openspec/changes/

Create a new change with: /openspec:proposal
```
Exit here.

## Step 3: Parse Tasks

For each change directory found, read `tasks.md` and find incomplete tasks:

Pattern to match: `- [ ]` (incomplete task)
Pattern to skip: `- [x]` (complete task)

**Example parsing:**
```
## 1. OpenSpec Integration

### 1.1 Update /project-init Command
- [ ] 1.1.1 Add openspec CLI detection     <- INCOMPLETE (return this)
- [x] 1.1.2 Already done                    <- SKIP
- [ ] 1.1.3 Next task                       <- INCOMPLETE
```

## Step 4: Handle Multiple Changes

**If argument provided:** Use that change name directly.

**If multiple changes with tasks:** Use AskUserQuestion:

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

**If single change:** Use it directly.

## Step 5: Display Next Task

Show the first incomplete task from the selected change:

```
NEXT TASK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Change: [change-name]
Task:   [task description]
File:   openspec/changes/[change-name]/tasks.md

Progress: [X]/[Y] tasks complete

To mark complete, edit tasks.md and change [ ] to [x]
```

## Step 6: Update Focus

Update `.project/context/focus.json`:

```json
{
  "current_focus": {
    "type": "change",
    "name": "[change-name]",
    "task": "[task-id]",
    "phase": "implementation"
  }
}
```

## Step 7: Suggest Action

Based on the task type, suggest next action:

**If task mentions "test":**
```
Suggestion: Start with TDD - write failing test first
```

**If task mentions "create" or "add":**
```
Suggestion: Use feature-dev for guided implementation
```

**If task mentions "update" or "modify":**
```
Suggestion: Read the existing code first, then make changes
```

## All Tasks Complete

If all tasks in all changes are complete:

```
ALL TASKS COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All tasks in [change-name] are done!

Next steps:
1. Review the implementation
2. Run: openspec validate [change-name] --strict
3. Archive: /openspec:archive [change-name]
```
