---
description: Initialize project with context management and workflow selection
argument-hint: [project-name]
---

# Project Init

**FIRST ACTION: Call TodoWrite tool with this exact JSON:**

```json
{
  "todos": [
    {"content": "Project Discovery - ask what user is building", "status": "pending", "activeForm": "Discovering project"},
    {"content": "Create design.md", "status": "pending", "activeForm": "Creating design.md"},
    {"content": "Ask workflow & structure preferences", "status": "pending", "activeForm": "Asking preferences"},
    {"content": "Initialize workflow (openspec or skip)", "status": "pending", "activeForm": "Initializing workflow"},
    {"content": "Create files (focus.json, progress.md, CLAUDE.md)", "status": "pending", "activeForm": "Creating files"},
    {"content": "Show summary and next steps", "status": "pending", "activeForm": "Showing summary"}
  ]
}
```

**DO NOT proceed until you have called TodoWrite.**

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
        {"label": "openspec (Recommended)", "description": "Spec-driven development with proposals"},
        {"label": "mindcontext-skills", "description": "PRD → Epic → Task with TDD"},
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

## Step 5: Initialize Workflow

### If user chose "openspec":

**Check if openspec CLI is installed:**
```bash
command -v openspec
```

**If openspec CLI is installed:**
```bash
openspec init --tools claude
```

This creates:
- `openspec/project.md` - Fill with discovery info
- `openspec/AGENTS.md` - AI instructions
- `openspec/specs/` - Specifications
- `openspec/changes/` - Change proposals
- `.claude/commands/openspec/` - proposal, apply, archive commands

**After openspec init, fill `openspec/project.md`** with the project discovery information.

**If openspec CLI is NOT installed:**
Show message:
```
OpenSpec CLI not found. Install with:
  npm install -g @fission-ai/openspec

Then run: openspec init --tools claude
```

Skip openspec setup, continue with core files.

### If user chose "mindcontext-skills":

Show install instructions:
```
/plugin marketplace add tmsjngx0/mindcontext-skills
/plugin install mindcontext-skills@tmsjngx0
```

### If user chose "None":

Continue with core-only setup.

## Step 6: Create Structure

```bash
mkdir -p .project/context
```

Create these files:

**`.project/context/focus.json`**:
```json
{
  "current_focus": {"type": "none", "name": null, "status": "idle"},
  "config": {
    "integrations": {
      "workflow": "[user's choice: openspec | mindcontext-skills | none]",
      "openspec": "[cli | none - based on detection]",
      "claudeMem": "[available | none - detect MCP]"
    }
  },
  "key_decisions": {},
  "next_session_tasks": [],
  "last_updated": "[current ISO timestamp]"
}
```

**`.project/context/progress.md`**:
```markdown
# Progress
Project initialized on [date].

## Workflow
- Type: [openspec | mindcontext-skills | core-only]
- Structure: [shadow | single]

## Next Steps
[Based on workflow choice]
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
- `/next` - Find next task (if openspec)

## Git Commits - NO AI Attribution
Do NOT include AI attribution in commits.
```

## Step 7: Show Results

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
OpenSpec: [installed | not installed]
```

### Next Steps by Workflow:

**If openspec:**
```
Your workflow:
1. /openspec:proposal - Create change proposals
2. /openspec:apply - Implement changes
3. /openspec:archive - Archive completed changes
4. /next - Find next task from active changes
```

**If mindcontext-skills:**
```
Install the plugin:
/plugin marketplace add tmsjngx0/mindcontext-skills
/plugin install mindcontext-skills@tmsjngx0

Then start with: "create prd for [feature]"
```

**If core-only:**
```
Core commands available:
- /prime-context - Load context
- /update-context - Save context
- /commit - Smart commits
- /next - Find tasks (needs openspec)

Add a workflow later with /project-init
```
