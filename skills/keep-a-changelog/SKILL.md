---
name: keep-a-changelog
description: Reference for Keep a Changelog format. Auto-loads when user asks "how to write changelog", "changelog format", "what goes in changelog", "changelog best practices".
---

# Keep a Changelog

Reference for writing changelogs following [Keep a Changelog](https://keepachangelog.com/).

## Format

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

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

## [1.0.0] - 2025-01-01

### Added
- Initial release
```

## Change Types

| Type | Description |
|------|-------------|
| **Added** | New features |
| **Changed** | Changes in existing functionality |
| **Deprecated** | Soon-to-be removed features |
| **Removed** | Now removed features |
| **Fixed** | Bug fixes |
| **Security** | Vulnerability fixes |

## Examples

**Good entries:**
```markdown
### Added
- User authentication with OAuth2 support
- Dark mode theme option
- Export data to CSV format

### Changed
- Improved search performance by 50%
- Updated dashboard layout for better usability

### Fixed
- Login button not responding on mobile devices
- Incorrect date format in exported reports
```

**Bad entries:**
```markdown
### Changed
- Updated stuff          # Too vague
- Fixed bug              # Which bug?
- Minor improvements     # What improvements?
```

## Version Format

```
## [MAJOR.MINOR.PATCH] - YYYY-MM-DD
```

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## Unreleased Section

Always keep an `[Unreleased]` section at the top:

```markdown
## [Unreleased]

### Added
- Feature currently in development

## [1.2.0] - 2025-01-01
...
```

When releasing, move unreleased items to new version.

## Best Practices

1. **Human-readable** - Write for users, not machines
2. **Reverse chronological** - Newest first
3. **One entry per change** - Don't combine unrelated changes
4. **Link to issues** - Reference tickets when relevant
5. **Date format** - Use ISO 8601 (YYYY-MM-DD)
6. **Don't include commits** - Summarize, don't copy git log

## What NOT to Include

- Internal refactoring (unless it affects users)
- Dependency updates (unless they affect functionality)
- Build/CI changes (unless they affect users)
- Code style changes

## Linking

Add links at the bottom:

```markdown
[Unreleased]: https://github.com/user/repo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/user/repo/releases/tag/v1.0.0
```

## Quick Template

```markdown
## [Unreleased]

### Added

### Changed

### Fixed
```
