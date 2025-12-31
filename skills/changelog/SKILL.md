---
name: changelog
description: Manage CHANGELOG.md following Keep a Changelog format. Use when user says "update changelog", "add to changelog", "changelog entry", or "release notes".
---

# Changelog Management

Manage CHANGELOG.md following [Keep a Changelog](https://keepachangelog.com/) format.

## When to Use

- User says "update changelog", "add to changelog"
- User says "changelog entry", "release notes"
- Before a release to document changes
- After significant commits to track changes

## Keep a Changelog Format

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Vulnerability fixes

## [1.0.0] - 2025-01-15

### Added
- Initial release
```

## Categories

Use these categories in this order:

| Category | Description |
|----------|-------------|
| **Added** | New features |
| **Changed** | Changes in existing functionality |
| **Deprecated** | Soon-to-be removed features |
| **Removed** | Now removed features |
| **Fixed** | Bug fixes |
| **Security** | Vulnerability fixes |

## Workflow

### 1. Check if CHANGELOG.md exists

```bash
if [ ! -f "CHANGELOG.md" ]; then
  # Create new changelog
fi
```

### 2. If creating new CHANGELOG.md

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

```

### 3. Adding entries

Add entries under `## [Unreleased]` in the appropriate category:

```markdown
## [Unreleased]

### Added
- New user authentication system
- OAuth2 integration

### Fixed
- Login timeout issue (#123)
```

### 4. Releasing a version

When releasing, move [Unreleased] entries to a new version section:

**Before:**
```markdown
## [Unreleased]

### Added
- Feature X
- Feature Y

### Fixed
- Bug Z
```

**After:**
```markdown
## [Unreleased]

## [1.2.0] - 2025-12-31

### Added
- Feature X
- Feature Y

### Fixed
- Bug Z
```

## Commands

### Add changelog entry

User says: "add to changelog: Added new login feature"

Action:
1. Read CHANGELOG.md
2. Find `## [Unreleased]` section
3. Add entry under appropriate category (### Added)
4. Write updated file

### Create release

User says: "release version 1.2.0"

Action:
1. Read CHANGELOG.md
2. Find `## [Unreleased]` section
3. Create new version section with today's date
4. Move unreleased entries to new version
5. Add empty [Unreleased] section
6. Update version links at bottom

## Best Practices

- **Write for humans** - Explain what changed, not commit hashes
- **Be consistent** - Use same tense and style
- **Group logically** - Related changes together
- **Link issues** - Reference issue numbers (#123)
- **Date format** - Use ISO 8601: YYYY-MM-DD

## Examples

### Good entries
```markdown
### Added
- User authentication with JWT tokens
- Password reset via email (#45)
- Dark mode toggle in settings

### Fixed
- Login form not validating email format (#123)
- Session timeout not refreshing properly
```

### Bad entries
```markdown
### Added
- stuff
- fixed things
- commit abc123
```

## Integration with /commit

When using `/commit full`, the changelog should be updated:

1. Analyze commits since last release
2. Categorize changes (Added/Changed/Fixed/etc.)
3. Add entries to [Unreleased] section
4. Include CHANGELOG.md in commit

## Notes

- Always keep [Unreleased] section at top
- Don't remove old versions
- Use semantic versioning for version numbers
- Date format: YYYY-MM-DD
