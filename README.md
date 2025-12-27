# MindContext Core

**Session persistence for Claude Code.** Auto-injects context at session start, preserves state across memory compaction.

> The essential subset of [MindContext Skills](https://github.com/tmsjngx0/mindcontext-skills) — just session management, no workflow enforcement.

## What It Does

| Hook | When | What |
|------|------|------|
| `SessionStart` | Claude session begins | Injects focus, key decisions, next tasks |
| `Stop` | Claude stops/pauses | Saves timestamp to focus.json |
| `PreCompact` | Before memory compaction | Preserves critical context |
| `SessionEnd` | Claude session ends | Cleans up session entry |

**No workflow enforcement.** No TDD blocking. No skill dependencies. Just context persistence.

## Installation

### From Marketplace

```bash
/plugin marketplace add mindcontext/mindcontext-core
/plugin install mindcontext-core@mindcontext
```

### From Local Path

```bash
/plugin marketplace add ./mindcontext-core
/plugin install mindcontext-core@local
```

## How It Works

MindContext Core reads from `.project/context/focus.json` and injects context automatically:

```
Session Start:
┌────────────────────────────────────────┐
│ # MindContext Session                  │
│                                        │
│ **Focus:** epic - user-auth            │
│ **Epic:** user-auth | **Task:** 003    │
│                                        │
│ **Key Decisions:**                     │
│ - auth-method: JWT tokens              │
│ - api-style: REST with OpenAPI         │
│                                        │
│ **Next:** Complete login endpoint      │
└────────────────────────────────────────┘
```

### Tiered Context Levels

Set `context_level` in focus.json:

| Level | Tokens | Includes |
|-------|--------|----------|
| `minimal` | ~250 | Focus, 2-3 decisions, next task |
| `standard` | ~500 | + task criteria, last session work |
| `full` | ~2000 | + all decisions, progress summary |

## Required File Structure

```
your-project/
└── .project/
    └── context/
        ├── focus.json      # Session state (required)
        └── progress.md     # Progress log (optional)
```

### focus.json Schema

```json
{
  "current_focus": {
    "type": "epic",
    "name": "user-auth",
    "epic": "user-auth",
    "task": "003",
    "phase": "implementation"
  },
  "key_decisions": {
    "auth-method": "JWT tokens for stateless auth",
    "api-style": "REST with OpenAPI spec"
  },
  "next_session_tasks": [
    "Complete login endpoint",
    "Add rate limiting"
  ],
  "session_summary": {
    "date": "2025-12-27",
    "work_done": [
      "Implemented user registration",
      "Added password hashing"
    ]
  },
  "context_level": "minimal"
}
```

## Integration

MindContext Core is designed to work alongside:

- **[OpenSpec](https://github.com/Fission-AI/OpenSpec)** — Spec management, change requests
- **[feature-dev](https://github.com/anthropics/claude-code)** — Code exploration, architecture
- **[superpowers](https://github.com/obra/superpowers)** — TDD enforcement, micro-tasks

No conflicts — Core only handles session lifecycle.

## Comparison: Core vs Full

| Feature | Core | Full (mindcontext-skills) |
|---------|------|---------------------------|
| Session hooks | ✅ | ✅ |
| Context injection | ✅ | ✅ |
| Memory compaction handling | ✅ | ✅ |
| TDD enforcement | ❌ | ✅ |
| Workflow enforcement | ❌ | ✅ |
| PRD/Epic/Task skills | ❌ | ✅ |
| 27 skills | ❌ | ✅ |
| Works with OpenSpec | ✅ | ⚠️ conflicts |
| Works with superpowers | ✅ | ⚠️ conflicts |

## License

MIT

## Links

- [mindcontext.io](https://mindcontext.io)
- [Full MindContext Skills](https://github.com/tmsjngx0/mindcontext-skills)
