---
description: Smart commit using Conventional Commits format - detects changes, auto-detects breaking changes, creates granular commits
---

# Smart Commit

Intelligently analyze and commit changes using **Conventional Commits** format.

This will:
1. Detect changes in submodules, worktrees, PRDs, context files, and code
2. Auto-detect potential breaking changes
3. Create granular commits with proper type(scope): format
4. Warn if commit message exceeds 72 characters
5. Commit in the correct order (submodules first, then parent)
6. Push changes

## Usage

```bash
/commit              # Quick commit (default)
/commit full         # With context file updates (CLAUDE.md, progress.md, README, CHANGELOG)
```

## Context Update Option

Use "full" or "with context" to update documentation before committing:
- `CLAUDE.md` - Project guidelines
- `.project/context/progress.md` - Session progress
- `README.md` - User documentation
- `CHANGELOG.md` - Version history

Invoke the smart-commit skill: "smart commit" or "full commit"
