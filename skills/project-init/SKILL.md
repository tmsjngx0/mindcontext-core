---
name: project-init
description: Initialize project with context management. Discovers project purpose through conversation, creates design.md, then asks which workflow to use. Use when user says "init project", "initialize", "setup project", or "project init".
---

# Project Init (Core)

Initialize any project with context management through discovery and workflow selection.

## CRITICAL: Plugin Installation Commands

**Use ONLY these exact commands. Do NOT hallucinate alternatives:**

```
# mindcontext-skills
/plugin marketplace add tmsjngx0/mindcontext-skills
/plugin install mindcontext-skills@tmsjngx0

# openspec
/plugin marketplace add Fission-AI/openspec
/plugin install openspec@Fission-AI
```

**NEVER use:** `claude plugins:add`, `npm install`, or any other format.

---

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

### Phase 2: Project Discovery (REQUIRED)

**This is the most important phase. DO NOT SKIP.**

Ask the user about their project through conversation:

```
PROJECT DISCOVERY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Let's understand your project before we set things up.

Tell me about your project:
1. What are you building?
2. What problem does it solve?
3. Who is it for?
```

**Use AskUserQuestion or conversational prompts to discover:**

1. **Project Purpose** - What is being built and why
2. **Target Users** - Who will use this
3. **Key Features** - Main functionality (3-5 bullets)
4. **Tech Stack** - Languages, frameworks, databases (if known)
5. **Constraints** - Timeline, requirements, limitations

Continue the conversation until you have enough to create design.md.

### Phase 3: Create design.md

Based on discovery, create `.project/design.md`:

```markdown
# Project Design

## Overview

[1-2 paragraph summary of what the project is and why it exists]

## Problem Statement

[What problem does this solve? Why does it need to exist?]

## Target Users

[Who will use this? What are their needs?]

## Key Features

- [Feature 1]: [Brief description]
- [Feature 2]: [Brief description]
- [Feature 3]: [Brief description]

## Technical Approach

[High-level technical direction - languages, frameworks, architecture]

## Constraints

[Any limitations, requirements, or boundaries]

## Success Criteria

[How do we know when this is done/successful?]

---
*Generated during project initialization*
*This document is the foundation for PRDs, specs, and implementation*
```

### Phase 4: Create Base Structure

```bash
mkdir -p .project/context
```

Create:
- `.project/design.md` - Project understanding (from Phase 3)
- `.project/context/focus.json` - Session state
- `.project/context/progress.md` - Progress notes
- `CLAUDE.md` - Project guidelines

### Phase 5: Ask Workflow Preference

**Use AskUserQuestion tool:**

```
Header: "Workflow"
Question: "Which development workflow would you like to use?"
Options:
  1. mindcontext-skills - PRD → Epic → Task with TDD (Recommended)
  2. openspec - Spec-driven development
  3. None - Core only, add workflow later
```

### Phase 6: Ask Repository Structure

**Use AskUserQuestion tool:**

```
Header: "Structure"
Question: "What repository structure do you want?"
Options:
  1. Shadow Engineering - Parent (AI context) + Submodule (clean code) (Recommended)
  2. Single Repo - Everything together
```

### Phase 7: Setup Based on Choices

**If Shadow Engineering:** Guide through submodule setup.

**Show workflow installation:**

For **mindcontext-skills**, output EXACTLY:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTALL MINDCONTEXT-SKILLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run these commands:

/plugin marketplace add tmsjngx0/mindcontext-skills
/plugin install mindcontext-skills@tmsjngx0

Then run /prd to create your PRD from design.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

For **openspec**, output EXACTLY:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTALL OPENSPEC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run these commands:

/plugin marketplace add Fission-AI/openspec
/plugin install openspec@Fission-AI

Then follow openspec initialization to create specs from design.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

For **None**:
```
Core-only mode. Your design.md is ready.
Add a workflow plugin anytime with:
  /plugin marketplace add tmsjngx0/mindcontext-skills
  /plugin marketplace add Fission-AI/openspec
```

### Phase 8: Create focus.json

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
    "submodule": "[submodule name if shadow, null otherwise]"
  }
}
```

### Phase 9: Create CLAUDE.md

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

[Copy the Overview section from design.md]

## Development Workflow

[Based on user's workflow choice:]

**mindcontext-skills:** Follow SDD workflow - design.md → PRD → Epic → Tasks with TDD.
**openspec:** Follow spec-driven workflow - design.md → specs → implementation.
**core-only:** No enforced workflow, just session persistence.

## Git Commits - NO AI Attribution

Do NOT include any AI attribution in commit messages:
- No "Generated with Claude Code" footer
- No "Co-Authored-By: Claude" or similar
- Keep commit messages clean and professional

## Context Files

- `.project/design.md` - Project design and understanding
- `.project/context/focus.json` - Current work focus
- `.project/context/progress.md` - Session progress

## Commands

- `/sod` - Start of day (sync and load context)
- `/eod` - End of day (check uncommitted work)
- `/focus` - Show/set current focus
- `/commit` - Smart commit with conventional format
```

### Phase 10: Final Output

```
PROJECT INITIALIZED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Created:
  ✓ .project/design.md        (project understanding)
  ✓ .project/context/focus.json
  ✓ .project/context/progress.md
  ✓ CLAUDE.md

Workflow: [user's choice]
Structure: [shadow_engineering | single_repo]

[Show workflow-specific install commands]

Next: Install your workflow plugin, then it will use design.md
      to create PRDs (mindcontext-skills) or specs (openspec).
```

## Key Points

1. **Always do project discovery first** - Don't skip to structure creation
2. **design.md is the foundation** - Workflow plugins build on this
3. **Core creates understanding** - Workflow plugins create methodology artifacts
4. **Use exact install commands** - Never hallucinate alternatives
