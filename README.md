# MindContext Core

**Session persistence and foundational commands for Claude Code.** Auto-injects context at session start, preserves state across memory compaction, and provides essential session management commands.

> The foundation layer of [MindContext](https://mindcontext.io) — session management without workflow enforcement.

## Why MindContext Core?

Claude Code sessions are stateless — each time you start a conversation, Claude doesn't remember what you were working on. MindContext Core solves this by:

1. **Persisting session state** to `.project/context/focus.json`
2. **Auto-injecting context** when you start a new session
3. **Preserving context** across memory compaction
4. **Tracking active sessions** for multi-window awareness

### The Problem

Without context management:
- You have to re-explain what you're working on each session
- Memory compaction loses important decisions and progress
- No continuity between work sessions
- Context switching is painful

### The Solution

MindContext Core provides the **foundation layer** that any workflow can build on:

```
┌─────────────────────────────────────────────────────────────┐
│                    WORKFLOW LAYER                           │
│         (choose based on your methodology)                  │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────┐    │
│  │  mindcontext-skills │    │       openspec          │    │
│  │                     │    │                         │    │
│  │  PRD → Epic → Task  │ OR │  Spec-driven dev with   │    │
│  │  methodology        │    │  change requests        │    │
│  └─────────────────────┘    └─────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                    TOOL LAYER                               │
│              (add as needed)                                │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────┐    │
│  │    superpowers      │    │      feature-dev        │    │
│  │                     │    │                         │    │
│  │  TDD enforcement    │    │  Code exploration &     │    │
│  │  micro-tasks        │    │  architecture           │    │
│  └─────────────────────┘    └─────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                  FOUNDATION LAYER                           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              mindcontext-core                        │   │
│  │                                                      │   │
│  │  • Session hooks (SessionStart, Stop, PreCompact)   │   │
│  │  • Context injection (focus.json → session)         │   │
│  │  • Session commands (sod, eod, focus, commit)       │   │
│  │  • Integration detection                            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Design Philosophy

- **Core is minimal** — Just session management, no opinions on workflow
- **Core is compatible** — Works with any workflow plugin (no conflicts)
- **Core detects integrations** — Knows what plugins you have installed
- **Workflow plugins extend** — Add their structure on top of core

## Features

- **Session Persistence** — Auto-inject context at session start
- **Memory Compaction** — Preserve critical context across compaction
- **Session Commands** — sod, eod, focus, update-context, project-init, commit
- **Integration Detection** — Auto-detect installed plugins
- **Works with Any Workflow** — Compatible with OpenSpec, superpowers, feature-dev

## Installation

```bash
# Add marketplace
/plugin marketplace add tmsjngx0/mindcontext-core

# Install
/plugin install mindcontext-core@tmsjngx0
```

## Commands

| Command | Description |
|---------|-------------|
| `/sod` | Start of day — sync repo, load context, show status |
| `/eod` | End of day — check uncommitted work, save session |
| `/focus` | Show or set current work focus |
| `/update-context` | Save session state before /clear |
| `/project-init` | Initialize project with context structure |
| `/commit` | Smart commit with Conventional Commits format |

## Hooks

| Hook | When | What |
|------|------|------|
| `SessionStart` | Session begins | Injects focus, decisions, integrations |
| `Stop` | Between responses | Updates last_active timestamp |
| `PreCompact` | Before compaction | Preserves critical context |
| `SessionEnd` | Session ends | Cleans up session entry |

## Skills

| Skill | Triggers |
|-------|----------|
| `start-of-day` | "sod", "start of day", "morning sync" |
| `end-of-day` | "eod", "end of day", "wrap up" |
| `focus-state` | "what am I working on", "focus on X" |
| `update-context` | "update context", "save context" |
| `project-init` | "init project", "initialize" |
| `smart-commit` | "commit", "smart commit" |

## Project Structure

After running `/project-init`:

```
your-project/
├── .project/
│   └── context/
│       ├── focus.json      # Session state
│       └── progress.md     # Progress log
└── CLAUDE.md               # Project guidelines
```

## focus.json Schema

```json
{
  "current_focus": {
    "type": "task",
    "name": "Implement login",
    "started": "2025-12-27",
    "status": "in_progress"
  },
  "key_decisions": {
    "auth-method": "JWT tokens",
    "api-style": "REST"
  },
  "session_summary": {
    "date": "2025-12-27",
    "work_done": ["Completed registration"]
  },
  "next_session_tasks": [
    "Add login endpoint",
    "Add rate limiting"
  ],
  "context_level": "minimal",
  "active_sessions": {},
  "config": {
    "workflow_enforcement": "remind",
    "integrations": {
      "workflow": "mindcontext-skills",
      "tdd": "superpowers",
      "code_analysis": "feature-dev"
    }
  }
}
```

## Context Levels

Set `context_level` in focus.json:

| Level | Tokens | Includes |
|-------|--------|----------|
| `minimal` | ~250 | Focus, 2-3 decisions, next task, integrations |
| `standard` | ~500 | + task criteria, last session work |
| `full` | ~2000 | + all decisions, progress summary |

## Integration Detection

Core auto-detects installed plugins on session start:

| Plugin | Detection Marker |
|--------|------------------|
| mindcontext-skills | `.project/prds/` or `.project/epics/` |
| openspec | `.openspec/` or `specs/` |
| superpowers | `.superpowers/` |
| serena | `.serena/` |

Detected integrations are stored in `focus.json` and shown in session context:

```
# MindContext Session

**Integrations:** mindcontext-skills + feature-dev
**Focus:** task - Implement login
...
```

## Available Integrations

### Workflow (pick one)

**mindcontext-skills** — PRD → Epic → Task methodology
```bash
/plugin marketplace add tmsjngx0/mindcontext-skills
/plugin install mindcontext-skills@tmsjngx0
```

**openspec** — Spec-driven development with change requests
```bash
/plugin marketplace add openspec/openspec
/plugin install openspec@openspec
```

### TDD Enforcement

**superpowers** — Micro-task TDD with Red-Green-Refactor
```bash
/plugin marketplace add anthropics/superpowers
/plugin install superpowers@anthropics
```

### Code Analysis

**feature-dev** — Codebase exploration and architecture
```bash
/plugin marketplace add anthropics/feature-dev
/plugin install feature-dev@anthropics
```

## Recommended Combinations

| Mode | Plugins | Use Case |
|------|---------|----------|
| **Full MindContext** | core + mindcontext-skills + feature-dev | PRD → Epic → Task workflow |
| **Integration** | core + openspec + superpowers + feature-dev | Spec-driven + TDD |
| **Minimal** | core only | Just session persistence |

## How Plugins Work Together

### Full MindContext Mode

```
You: "start of day"
  │
  ├─→ core: Syncs git, loads focus.json, shows session state
  │
  └─→ skills: Adds epic/task status, shows PRD progress

You: "start task 003"
  │
  ├─→ core: Updates current_focus in focus.json
  │
  └─→ skills: Loads task file, routes to feature-dev, enforces TDD

You: "commit"
  │
  └─→ core: Conventional Commits format, detects change types
```

### Integration Mode (OpenSpec + Superpowers)

```
You: "start of day"
  │
  └─→ core: Syncs git, loads focus.json, shows session state

You: "create spec for auth"
  │
  └─→ openspec: Creates spec in .openspec/, manages change requests

You: "implement login"
  │
  ├─→ superpowers: TDD enforcement, Red-Green-Refactor
  │
  └─→ feature-dev: Code exploration, architecture guidance

You: "commit"
  │
  └─→ core: Conventional Commits format
```

### What Each Plugin Provides

| Plugin | Hooks | Commands | Skills | Focus |
|--------|-------|----------|--------|-------|
| **core** | SessionStart, Stop, PreCompact, SessionEnd | 6 | 6 | Session persistence |
| **mindcontext-skills** | PreToolUse (TDD) | 6 | 18 | PRD/Epic/Task workflow |
| **openspec** | — | varies | varies | Spec management |
| **superpowers** | PreToolUse (TDD) | varies | varies | TDD enforcement |
| **feature-dev** | — | 1 | 3 | Code exploration |

### No Conflicts

Core is designed to **never conflict** with other plugins:

- Core hooks handle session lifecycle only
- Core doesn't enforce workflow (no PreToolUse blocking)
- Core stores generic `current_focus`, not workflow-specific fields
- Workflow plugins add their own structure alongside core

## Comparison: Core vs Skills

| Feature | Core | mindcontext-skills |
|---------|------|-------------------|
| Session hooks | ✅ | ❌ (uses core) |
| Context injection | ✅ | ❌ (uses core) |
| Session commands (sod, eod, etc.) | ✅ | ❌ (uses core) |
| Integration detection | ✅ | ❌ (uses core) |
| TDD enforcement (PreToolUse) | ❌ | ✅ |
| Workflow enforcement | ❌ | ✅ |
| PRD/Epic/Task skills | ❌ | ✅ |
| Works with OpenSpec | ✅ | ⚠️ conflicts |
| Works with superpowers | ✅ | ⚠️ conflicts |

## License

MIT

## Links

- [mindcontext.io](https://mindcontext.io)
- [MindContext Skills](https://github.com/tmsjngx0/mindcontext-skills) — Full workflow plugin
- [GitHub](https://github.com/tmsjngx0/mindcontext-core)
