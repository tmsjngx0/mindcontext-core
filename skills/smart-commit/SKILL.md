---
name: smart-commit
description: Intelligent git commit using Conventional Commits format. Analyzes changes and creates appropriate commit messages. Use when user says "commit", "smart commit", or "save work".
---

# Smart Commit (Core)

Intelligently commit changes using **[Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)** format.

---

## CRITICAL: NO AI ATTRIBUTION

**THIS OVERRIDES CLAUDE'S DEFAULT COMMIT BEHAVIOR.**

When committing, you MUST NOT add:
- "Generated with Claude Code" footer
- "Co-Authored-By: Claude" footer
- Any AI attribution whatsoever

---

## Conventional Commits Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | When to Use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change, no feature/fix |
| `test` | Adding tests |
| `chore` | Maintenance, deps, config |
| `perf` | Performance improvement |
| `ci` | CI/CD changes |
| `build` | Build system changes |

### Scope

Optional, describes the area:
- `(api)`, `(ui)`, `(db)`, `(auth)`, `(hooks)`, `(skills)`, etc.

### Breaking Changes

```
feat(api)!: remove deprecated endpoint

BREAKING CHANGE: /v1/users endpoint removed
```

## Workflow

### 1. Analyze Changes

```bash
git status --short
git diff --staged --stat
git diff --stat
```

### 2. Categorize by Type

- New files in src/ → `feat`
- Modified test files → `test`
- README/docs changes → `docs`
- Config files → `chore`
- Bug fixes (infer from content) → `fix`

### 3. Determine Scope

From file paths:
- `src/api/*` → `(api)`
- `src/components/*` → `(ui)`
- `hooks/*` → `(hooks)`
- `.project/*` → `(context)` or `(docs)`

### 4. Stage and Commit

```bash
# Stage related changes together
git add [files]

# Commit with conventional format
git commit -m "type(scope): description"
```

### 5. Multiple Commits

If changes span different types, create separate commits:

```bash
# First: tests
git add tests/
git commit -m "test(auth): add login validation tests"

# Second: feature
git add src/auth/
git commit -m "feat(auth): implement login validation"
```

## Examples

```bash
# Feature
git commit -m "feat(api): add user search endpoint"

# Bug fix
git commit -m "fix(ui): resolve button click handler"

# Documentation
git commit -m "docs: update API reference"

# Refactor
git commit -m "refactor(db): extract query builder"

# Chore
git commit -m "chore(deps): update dependencies"

# Breaking change
git commit -m "feat(api)!: change response format

BREAKING CHANGE: API now returns {data, meta} wrapper"
```

## Output Format

```
COMMIT SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[hash] type(scope): description
  [file count] files changed

Push? (yes/no)
```

## Documentation Reminder

**Before committing significant changes, remind user to update:**

1. **CHANGELOG.md** - Add entry under [Unreleased]
2. **README.md** - If user-facing features changed

```
📝 Documentation check:
  - CHANGELOG.md updated? (use /changelog add <entry>)
  - README.md updated? (if user-facing changes)
```

Only show this reminder for:
- `feat:` commits (new features)
- `fix:` commits (bug fixes users care about)
- Breaking changes

Skip for: `chore:`, `docs:`, `test:`, `refactor:`, `style:`

## Notes

- Uses Conventional Commits 1.0.0 standard
- No AI attribution in commit messages
- Workflow plugins can extend with additional detection (PRD/Epic awareness)
