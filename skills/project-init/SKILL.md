---
name: project-init
description: Initialize project with context management structure. Creates .project/context/, focus.json, and CLAUDE.md. Asks user which workflow to use. Use when user says "init project", "initialize", "setup project", or "project init".
---

# Project Init (Core)

Initialize any project with context management and workflow selection.

## When to Use

- Starting a new project
- Adding context management to existing project
- User says "init", "initialize project", "setup project"

## Workflow

### Phase 1: Check Existing Structure

```bash
# Check if already initialized
if [ -d ".project/context" ]; then
  echo "Project already initialized"
  # Show current state and offer to reconfigure
fi

# Check for git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  git init
  echo "✓ Initialized git repository"
fi
```

### Phase 2: Create Base Structure

```bash
mkdir -p .project/context
```

Create these files:
- `.project/context/focus.json` - Session state
- `.project/context/progress.md` - Progress notes
- `CLAUDE.md` - Project guidelines

### Phase 3: Ask User Preferences

**IMPORTANT: Use AskUserQuestion tool to ask TWO questions:**

#### Question 1: Workflow

```
Which development workflow would you like to use?

1. **mindcontext-skills** (Recommended)
   - PRD → Epic → Task methodology
   - Spec-Driven Development (SDD) with TDD enforcement
   - Structured project management

2. **openspec**
   - Spec-driven development
   - Change request workflow
   - Lightweight specifications

3. **None (core only)**
   - Just session persistence
   - No workflow enforcement
   - Add workflow later if needed
```

**AskUserQuestion parameters:**
- Header: "Workflow"
- Question: "Which development workflow would you like to use?"
- Options:
  1. mindcontext-skills - PRD → Epic → Task with SDD/TDD (Recommended)
  2. openspec - Spec-driven development
  3. None - Core only, add workflow later

#### Question 2: Repository Structure

```
What repository structure do you want?

1. **Shadow Engineering** (Recommended for AI-assisted development)
   - Parent repo: AI context, planning, orchestration
   - Submodule: Clean production code
   - Clean git history in production repo
   - Professional output from AI-assisted dev

2. **Single Repo**
   - Everything in one repository
   - Simpler setup
   - AI context mixed with code
```

**AskUserQuestion parameters:**
- Header: "Structure"
- Question: "What repository structure do you want?"
- Options:
  1. Shadow Engineering - Parent (AI context) + Submodule (clean code) (Recommended)
  2. Single Repo - Everything together

### Phase 4: Setup Based on Choices

#### 4a: Setup Repository Structure

**If Shadow Engineering chosen:**

Guide user through shadow setup:
```
SHADOW ENGINEERING SETUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This repo will be the PARENT (orchestration layer).
You need a SUBMODULE for clean production code.

Options:
1. Create new submodule (for new projects)
2. Add existing repo as submodule (for existing code)

[Ask user which option]
```

**If "Create new submodule":**
```bash
# Create the code submodule
mkdir my-project
cd my-project
git init
echo "# My Project" > README.md
git add . && git commit -m "Initial commit"

# User needs to create GitHub repo, then:
git remote add origin https://github.com/USER/my-project.git
git push -u origin main

# Back to parent, add as submodule
cd ..
git submodule add https://github.com/USER/my-project.git my-project
```

**If "Add existing repo":**
```bash
git submodule add https://github.com/USER/existing-repo.git my-project
```

**If Single Repo chosen:**
No additional setup needed - continue with workflow installation.

#### 4b: Install Workflow Plugin

**If mindcontext-skills:**
```
To install mindcontext-skills, run:

/plugin marketplace add tmsjngx0/mindcontext-skills
/plugin install mindcontext-skills@tmsjngx0

After installing, run /prd to create your first PRD.
```

**If openspec:**
```
To install openspec, run:

/plugin marketplace add Fission-AI/openspec
/plugin install openspec@Fission-AI

After installing, follow openspec's initialization.
```

**If None:**
```
Core-only mode. You can add a workflow plugin anytime:
- /plugin install mindcontext-skills@tmsjngx0
- /plugin install openspec@Fission-AI
```

### Phase 5: Update focus.json

Store the workflow preference:

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
  "last_updated": "[ISO timestamp]",
  "context_level": "minimal",
  "active_sessions": {},
  "config": {
    "workflow_enforcement": "remind",
    "integrations": {
      "workflow": "[user's choice or null]",
      "tdd": null,
      "code_analysis": null
    }
  },
  "onboarding": {
    "shown": true,
    "workflow_chosen": "[user's choice]",
    "structure_chosen": "[shadow_engineering | single_repo]",
    "date": "[ISO date]"
  },
  "repo_structure": {
    "type": "[shadow_engineering | single_repo]",
    "submodule": "[submodule name if shadow engineering, null otherwise]"
  }
}
```

### Phase 6: Create CLAUDE.md

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

[Brief description - ask user or infer from package.json/README]

## Development Workflow

[Based on user's workflow choice:]

**mindcontext-skills:** Follow SDD workflow - PRD first, then Epic, then Tasks with TDD.
**openspec:** Follow spec-driven workflow - specs before implementation.
**core-only:** No enforced workflow, just session persistence.

## Git Commits - NO AI Attribution

**IMPORTANT:** Do NOT include any AI attribution in commit messages:
- No "Generated with Claude Code" footer
- No "Co-Authored-By: Claude" or similar
- No AI-related comments or markers
- Keep commit messages clean and professional

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

### Phase 7: Output

```
PROJECT INITIALIZED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Created:
  ✓ .project/context/focus.json
  ✓ .project/context/progress.md
  ✓ CLAUDE.md

Workflow: [user's choice]

[If workflow plugin needs installing, show install commands]

Next steps:
  [Based on workflow choice]
```

## Workflow-Specific Next Steps

**mindcontext-skills:**
```
Next steps:
  1. Install: /plugin install mindcontext-skills@tmsjngx0
  2. Create PRD: /prd
  3. Start development with SDD workflow
```

**openspec:**
```
Next steps:
  1. Install: /plugin install openspec@Fission-AI
  2. Follow openspec initialization
  3. Create your first spec
```

**core-only:**
```
Next steps:
  • Set focus: /focus on [task name]
  • Start working: /sod
  • Add workflow plugin later if needed
```

## Notes

- Always ask user for workflow preference
- Don't assume or skip the workflow question
- Store choice in focus.json for future sessions
- Guide user to install chosen plugin
- Core only creates base structure, workflow plugin extends it
