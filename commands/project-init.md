---
description: Initialize project with context management and workflow selection
argument-hint: [project-name]
---

# Project Init

**IMMEDIATELY do these steps in order. Do NOT skip any step.**

## Step 1: Create Todos

Use TodoWrite NOW to create this list:
- Phase 1: Project Discovery
- Phase 2: Create design.md
- Phase 3: Workflow & Structure Preferences
- Phase 4: Create Files
- Phase 5: Summary

## Step 2: Project Discovery

**USE AskUserQuestion TOOL NOW:**

```json
{
  "questions": [{
    "question": "What are you building? Tell me about your project.",
    "header": "Project",
    "options": [
      {"label": "I'll describe it", "description": "Tell me about the project"}
    ],
    "multiSelect": false
  }]
}
```

Wait for response. Then ask follow-up:
- Who will use this?
- What are 3-5 key features?
- Tech stack?

Summarize and confirm understanding before proceeding.

## Step 3: Create design.md

Create `.project/design.md` with what you learned:

```markdown
# Project Design

## Overview
[Summary from discovery]

## Problem Statement
[What problem it solves]

## Target Users
[Who uses it]

## Key Features
- Feature 1
- Feature 2
- Feature 3

## Technical Approach
[Tech stack]
```

## Step 4: Ask Preferences

**USE AskUserQuestion TOOL:**

```json
{
  "questions": [
    {
      "question": "Which development workflow?",
      "header": "Workflow",
      "options": [
        {"label": "mindcontext-skills (Recommended)", "description": "PRD → Epic → Task with TDD"},
        {"label": "openspec", "description": "Spec-driven development"},
        {"label": "None", "description": "Core only, add later"}
      ],
      "multiSelect": false
    },
    {
      "question": "Repository structure?",
      "header": "Structure",
      "options": [
        {"label": "Shadow Engineering (Recommended)", "description": "Parent + Submodule for clean code"},
        {"label": "Single Repo", "description": "Everything together"}
      ],
      "multiSelect": false
    }
  ]
}
```

## Step 5: Create Structure

```bash
mkdir -p .project/context
```

Create these files:

**`.project/context/focus.json`** - with workflow choice:
```json
{
  "current_focus": {"type": "none", "name": null, "status": "idle"},
  "config": {"integrations": {"workflow": "[user's choice]"}}
}
```

**`.project/context/progress.md`**:
```markdown
# Progress
Project initialized.
```

**`CLAUDE.md`** - with project overview and commands:
```markdown
# CLAUDE.md

## Project Overview
[Copy from design.md]

## Commands
- `/prime-context` - Load context (start session)
- `/update-context` - Save context (end session)
- `/focus` - Show/set current focus
- `/commit` - Smart commit

## Git Commits - NO AI Attribution
Do NOT include AI attribution in commits.
```

## Step 6: Show Results

```
PROJECT INITIALIZED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Created:
  ✓ .project/design.md
  ✓ .project/context/focus.json
  ✓ .project/context/progress.md
  ✓ CLAUDE.md

Workflow: [choice]
Structure: [choice]
```

Then show install commands based on workflow choice:

**mindcontext-skills:**
```
/plugin marketplace add tmsjngx0/mindcontext-skills
/plugin install mindcontext-skills@tmsjngx0
```

**openspec:**
```
/plugin marketplace add Fission-AI/openspec
/plugin install openspec@Fission-AI
```

**NEVER use other command formats like `claude plugins:add` or `npm install`.**
