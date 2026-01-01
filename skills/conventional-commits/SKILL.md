---
name: conventional-commits
description: Reference for Conventional Commits 1.0.0 format. Auto-loads when user asks "how to write commits", "commit message format", "what is conventional commits", "commit best practices".
---

# Conventional Commits

Reference for writing commit messages following [Conventional Commits 1.0.0](https://www.conventionalcommits.org/).

## Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Types

| Type | When to Use |
|------|-------------|
| `feat` | New feature for the user |
| `fix` | Bug fix for the user |
| `docs` | Documentation only changes |
| `style` | Formatting, missing semicolons (no code change) |
| `refactor` | Code change that neither fixes bug nor adds feature |
| `perf` | Performance improvement |
| `test` | Adding or correcting tests |
| `build` | Build system or external dependencies |
| `ci` | CI configuration files and scripts |
| `chore` | Other changes that don't modify src or test files |
| `revert` | Reverts a previous commit |

## Examples

**Simple feature:**
```
feat: add user authentication
```

**With scope:**
```
feat(auth): add JWT token validation
```

**With body:**
```
fix(api): handle null response from payment gateway

The payment gateway occasionally returns null instead of
an error object. This caused unhandled exceptions.

Closes #123
```

**Breaking change:**
```
feat(api)!: change authentication to OAuth2

BREAKING CHANGE: API now requires OAuth2 tokens instead of API keys.
All existing API keys will be invalidated on March 1st.
```

## Breaking Changes

Two ways to indicate:

1. **Exclamation mark** after type/scope:
   ```
   feat(api)!: remove deprecated endpoints
   ```

2. **Footer:**
   ```
   feat: update authentication

   BREAKING CHANGE: passwords now require 12 characters minimum
   ```

## Scope

Optional context in parentheses:

- `feat(auth):` - authentication module
- `fix(ui):` - user interface
- `docs(api):` - API documentation
- `refactor(db):` - database layer

## Best Practices

1. **Imperative mood** - "add" not "added" or "adds"
2. **Lowercase** - start with lowercase
3. **No period** - don't end with a period
4. **50 char limit** - for the subject line
5. **Why not what** - body explains motivation, not implementation

## Quick Reference

```
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Formatting
refactor: Code restructuring
perf:     Performance
test:     Tests
build:    Build system
ci:       CI/CD
chore:    Maintenance
revert:   Revert commit
```

## Semantic Versioning

Conventional Commits maps to SemVer:

| Commit Type | Version Bump |
|-------------|--------------|
| `fix:` | PATCH (0.0.X) |
| `feat:` | MINOR (0.X.0) |
| `BREAKING CHANGE` | MAJOR (X.0.0) |
