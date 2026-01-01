---
description: Initialize project with context management and workflow selection
argument-hint: [project-name]
---

# Project Init

Initialize any project with MindContext context management through discovery and workflow selection.

**Arguments:** `$ARGUMENTS` - Optional project name

## Core Principles

- **Discovery first**: Understand the project before creating files
- **User gates**: Get approval at key decision points
- **TodoWrite**: Track all phases for visibility
- **design.md is the foundation**: Workflow plugins build on this

## CRITICAL: Plugin Installation Commands

**Use ONLY these exact commands. NEVER hallucinate alternatives:**

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

## Phase 1: Setup

**Goal**: Initialize tracking and check existing state

**Actions**:
1. Create todo list with all 6 phases:
   - Phase 1: Setup
   - Phase 2: Project Discovery
   - Phase 3: Create design.md
   - Phase 4: User Preferences
   - Phase 5: Create Structure
   - Phase 6: Summary

2. Check existing state:
   ```bash
   # Check if already initialized
   test -d ".project/context" && echo "Already initialized"

   # Check for git
   git rev-parse --git-dir > /dev/null 2>&1 || git init
   ```

3. If already initialized, ask user: "Project already initialized. Reconfigure?"

---

## Phase 2: Project Discovery

**Goal**: Understand what the user is building

**CRITICAL: DO NOT SKIP THIS PHASE**

**Actions**:
1. Mark Phase 2 as in_progress

2. Launch project-discovery agent:
   ```
   Use Task tool with subagent_type: "mindcontext-core:project-discovery"

   Prompt: "Discover what project the user is building. Ask about:
   1. What they're building and why
   2. Who will use it
   3. Key features (3-5)
   4. Tech stack if known
   5. Any constraints

   Return a structured summary for design.md"
   ```

3. Wait for agent to return project information

4. If agent returns insufficient info, ask follow-up questions directly

5. Confirm understanding with user before proceeding

---

## Phase 3: Create design.md

**Goal**: Document project understanding

**Actions**:
1. Mark Phase 3 as in_progress

2. Create `.project/design.md` using Write tool:

```markdown
# Project Design

## Overview

[1-2 paragraph summary from discovery]

## Problem Statement

[What problem does this solve?]

## Target Users

[Who will use this?]

## Key Features

- [Feature 1]: [Description]
- [Feature 2]: [Description]
- [Feature 3]: [Description]

## Technical Approach

[Languages, frameworks, architecture]

## Constraints

[Any limitations mentioned]

## Success Criteria

[How do we know it's done?]

---
*Generated during project initialization*
*This document is the foundation for PRDs, specs, and implementation*
```

3. Show user: "✓ Created .project/design.md"

4. Mark Phase 3 as completed

---

## Phase 4: User Preferences

**Goal**: Get workflow and structure preferences

**Actions**:
1. Mark Phase 4 as in_progress

2. **Use AskUserQuestion** for workflow:
   ```
   Header: "Workflow"
   Question: "Which development workflow would you like to use?"
   Options:
     1. mindcontext-skills - PRD → Epic → Task with TDD (Recommended)
     2. openspec - Spec-driven development
     3. None - Core only, add workflow later
   ```

3. **Use AskUserQuestion** for structure:
   ```
   Header: "Structure"
   Question: "What repository structure do you want?"
   Options:
     1. Shadow Engineering - Parent (AI context) + Submodule (clean code) (Recommended)
     2. Single Repo - Everything together
   ```

4. Store choices for Phase 5

5. Mark Phase 4 as completed

---

## Phase 5: Create Structure

**Goal**: Create all project files

**Actions**:
1. Mark Phase 5 as in_progress

2. Create directory:
   ```bash
   mkdir -p .project/context
   ```

3. Create `.project/context/focus.json`:
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
     "last_updated": "[current ISO timestamp]",
     "context_level": "minimal",
     "active_sessions": {},
     "config": {
       "workflow_enforcement": "remind",
       "integrations": {
         "workflow": "[user's workflow choice or null]",
         "tdd": null,
         "code_analysis": null
       }
     },
     "onboarding": {
       "shown": true,
       "workflow_chosen": "[user's workflow choice]",
       "structure_chosen": "[user's structure choice]",
       "date": "[current ISO date]"
     },
     "repo_structure": {
       "type": "[shadow_engineering | single_repo]",
       "submodule": null
     }
   }
   ```

4. Create `.project/context/progress.md`:
   ```markdown
   # Project Progress

   **Last Updated:** [date]

   ## Current Status

   Project initialized. Ready for development.

   ## Recent Work

   - Project initialized with MindContext

   ## Next Steps

   - [Based on workflow choice]
   ```

5. Create `CLAUDE.md`:
   ```markdown
   # CLAUDE.md

   This file provides guidance to Claude Code when working in this repository.

   ## Project Overview

   [Copy Overview from design.md]

   ## Development Workflow

   [Based on workflow choice:]
   - mindcontext-skills: Follow SDD workflow - design.md → PRD → Epic → Tasks with TDD
   - openspec: Follow spec-driven workflow - design.md → specs → implementation
   - core-only: No enforced workflow, just session persistence

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

   - `/prime-context` - Load context (sync repo + load session)
   - `/update-context` - Save context (check uncommitted + save session)
   - `/focus` - Show/set current focus
   - `/commit` - Smart commit with conventional format
   ```

6. If Shadow Engineering chosen, guide through setup:
   ```
   SHADOW ENGINEERING SETUP
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   This repo is now the PARENT (orchestration layer).

   Next: Create or add a submodule for production code.
   Run: /shadow-setup
   ```

7. Mark Phase 5 as completed

---

## Phase 6: Summary

**Goal**: Show results and next steps

**Actions**:
1. Mark Phase 6 as in_progress

2. Show completion summary:
   ```
   PROJECT INITIALIZED
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Created:
     ✓ .project/design.md        (project understanding)
     ✓ .project/context/focus.json
     ✓ .project/context/progress.md
     ✓ CLAUDE.md

   Workflow: [user's choice]
   Structure: [user's choice]
   ```

3. Show workflow-specific install commands:

   **For mindcontext-skills:**
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NEXT: INSTALL WORKFLOW PLUGIN
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   /plugin marketplace add tmsjngx0/mindcontext-skills
   /plugin install mindcontext-skills@tmsjngx0

   Then run /prd to create your PRD from design.md
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

   **For openspec:**
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NEXT: INSTALL WORKFLOW PLUGIN
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   /plugin marketplace add Fission-AI/openspec
   /plugin install openspec@Fission-AI

   Then follow openspec initialization
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

   **For None:**
   ```
   Core-only mode. Your design.md is ready.
   Add a workflow plugin anytime:
     /plugin marketplace add tmsjngx0/mindcontext-skills
     /plugin marketplace add Fission-AI/openspec
   ```

4. Mark all todos as completed

---

## Checklist

Before completing, verify:
- [ ] design.md created with project understanding
- [ ] focus.json created with user preferences
- [ ] progress.md created
- [ ] CLAUDE.md created with project overview
- [ ] Correct install commands shown (not hallucinated)
