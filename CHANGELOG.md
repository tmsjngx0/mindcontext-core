# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.2.0] - 2026-01-02

### Added
- `/next` command to find and display next task from OpenSpec changes
- OpenSpec integration in `/project-init`:
  - Detects OpenSpec CLI (`command -v openspec`)
  - Runs `openspec init --tools claude` when available
  - Fills `openspec/project.md` with project discovery
- OpenSpec context injection in SessionStart hook:
  - Detects `openspec/` directory
  - Shows count of active changes
  - Shows current change name
- Claude-Mem integration placeholder (future MCP detection)
- New focus.json fields:
  - `config.integrations.openspec` (cli | none)
  - `config.integrations.claudeMem` (available | none)
  - `current_focus.openspec_change` for tracking active change

### Changed
- `/project-init` now recommends OpenSpec as primary workflow
- Updated focus.json schema documentation in README

### Fixed
- Corrected openspec install instructions (npm package, not plugin)

## [1.1.1] - 2026-01-01

### Added
- PreToolUse hook to remind about CHANGELOG/README before git commits

### Fixed
- Simplified project-init command for better compliance
- Added explicit TodoWrite JSON format to ensure todos are created
- Added CLAUDE.md template with correct commands (/prime-context, /update-context)
- Removed project-discovery agent (command asks directly)

## [1.1.0] - 2026-01-01

### Added
- `project-discovery` agent for handling discovery conversation during `/project-init`
- `conventional-commits` skill (teaching reference for commit message format)
- `keep-a-changelog` skill (teaching reference for changelog format)
- `agents` directory in plugin.json

### Changed
- Restructured plugin to follow command+agent pattern
- Commands now orchestrate workflows (not skills)
- Skills now only provide teaching/reference content
- Renamed `sod` command to `prime-context`
- Renamed `eod` command to `update-context`
- Updated README with new structure documentation

### Removed
- Workflow skills that duplicated command functionality:
  - `prime-context` skill (use `/prime-context` command)
  - `update-context` skill (use `/update-context` command)
  - `focus-state` skill (use `/focus` command)
  - `project-init` skill (use `/project-init` command)
  - `smart-commit` skill (use `/commit` command)
  - `changelog` skill (use `/changelog` command)
  - `shadow-setup` skill
  - `start-of-day` skill
  - `end-of-day` skill

## [1.0.4] - 2025-12-31

### Fixed
- Project-init now runs `git init` for greenfield projects
- Smart-commit no longer adds AI attribution footer

## [1.0.3] - 2025-12-31

### Added
- Shadow engineering option to project-init
- Changelog skill (Keep a Changelog format)
- No-AI-attribution rule to CLAUDE.md template
- Documentation reminders to commit, eod, update-context

## [1.0.2] - 2025-12-30

### Added
- Integration detection in project-init
- Session commands (sod, eod, focus, update-context)

## [1.0.1] - 2025-12-28

### Fixed
- Plugin.json invalid path references
- README plugin refs for openspec and superpowers

## [1.0.0] - 2025-12-27

### Added
- Initial release
- Session hooks (SessionStart, SessionEnd, Stop, PreCompact)
- Context injection from focus.json
- Session persistence across memory compaction
- Integration detection for workflow plugins

[Unreleased]: https://github.com/tmsjngx0/mindcontext-core/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/tmsjngx0/mindcontext-core/compare/v1.0.4...v1.1.0
[1.0.4]: https://github.com/tmsjngx0/mindcontext-core/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/tmsjngx0/mindcontext-core/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/tmsjngx0/mindcontext-core/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/tmsjngx0/mindcontext-core/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/tmsjngx0/mindcontext-core/releases/tag/v1.0.0
