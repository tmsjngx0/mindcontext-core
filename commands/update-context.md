---
description: Update context - capture current session state before clearing memory or switching tasks
---

# Update Context

Save current session knowledge to context files for continuity across memory clears.

**Usage:**
```
/update-context         # Interactive update
/update-context quick   # Fast update without prompts
```

**Workflow:**
```
/update-context  → Save session state
/clear           → Clear Claude's memory
/sod             → Start fresh with prime-context
```

Invoke the update-context skill: "update context"
