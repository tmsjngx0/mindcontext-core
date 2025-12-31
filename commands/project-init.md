---
description: Initialize project with context management and workflow selection
---

# Project Init

Initialize any project with MindContext context management.

This command will:
1. Create `.project/context/` directory structure
2. **Ask which workflow you want** (mindcontext-skills, openspec, or none)
3. Create `focus.json` for session state
4. Create `progress.md` for session notes
5. Generate `CLAUDE.md` with project guidelines
6. Guide you to install the chosen workflow plugin

Works for both:
- **Greenfield** - New projects
- **Brownfield** - Existing codebases

Invoke the project-init skill for guided setup.
