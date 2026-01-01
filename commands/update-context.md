---
description: Save session state and wrap up safely before clearing memory or switching tasks
---

# Update Context

Save your session state and wrap up safely.

**Usage:**
```
/update-context         # Interactive update
/update-context quick   # Fast update without prompts
```

**Session Lifecycle:**
```
prime-context    → Load context (start session)
update-context   → Save context (end session)
```

Invoke the update-context skill: "update context", "eod", "wrap up"
