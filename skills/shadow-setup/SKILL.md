---
name: shadow-setup
description: Initialize Shadow Engineering structure - AI orchestration in parent, clean code in submodule. Use when user says "setup shadow engineering", "separate AI context", or "clean git history".
---

# Shadow Engineering Setup

Initialize the Shadow Engineering pattern: AI orchestration in parent repo, clean production code in submodule.

**Note:** This skill automatically runs `project-init` to initialize `.project/` in the parent repo, then adds the submodule pattern for clean code separation.

## What is Shadow Engineering?

**Shadow Engineering** is a development pattern that separates AI orchestration (messy, iterative) from production code (clean, maintainable):

```
Shadow (AI Orchestration)        →    Light (Clean Output)
mgmt-repo/                             actual-project/
├── .claude/                           ├── src/
├── CLAUDE.md                          ├── tests/
├── prompts/                           ├── package.json
├── .project/                          └── Clean git history
├── mindcontext-skills/
└── actual-project/ (submodule)
```

**Why Shadow Engineering?**

✅ **Clean Git History** - No AI artifacts in production repo
✅ **Separation of Concerns** - Orchestration vs. implementation
✅ **Contribution-Ready** - Submodule looks like normal development
✅ **Context Isolation** - Keep AI context separate from code
✅ **Professional Output** - Ship clean code, not AI experiments

**Not about hiding AI usage** - It's about keeping your workspace organized and your output professional.

## When to Use

- Starting a new AI-assisted project
- Converting vibe code to production quality
- Contributing to open source (clean history)
- Professional client work
- Want separation between planning and code

## Structure Overview

### Parent Repo (Shadow / Orchestration Layer)

```
my-project-mgmt/
├── .claude/
│   ├── hooks/              # Custom hooks
│   ├── prompts/            # AI prompts
│   ├── rules/              # Project rules
│   └── settings.json       # Claude config
├── .project/               # MindContext structure
│   ├── prds/
│   ├── epics/
│   └── context/
├── prompts/                # Custom AI prompts
├── docs/                   # Planning docs
├── scripts/                # Build/deploy scripts
├── mindcontext-skills/       # Plugin (optional submodule)
├── my-project/             # Submodule (clean code)
├── CLAUDE.md               # AI instructions
└── README.md               # Project overview
```

### Submodule (Light / Production Code)

```
my-project/                 # Clean, contribution-ready
├── src/
│   ├── components/
│   ├── services/
│   └── utils/
├── tests/
├── package.json
├── .gitignore
├── README.md               # User-facing docs
└── .git                    # Clean git history
```

## Workflow

### Phase 1: Initialize Structure

**Step 1.1: Create Parent Repository**

```bash
# Create orchestration repo
mkdir my-project-mgmt
cd my-project-mgmt
git init
```

**Step 1.2: Initialize MindContext**

```
"initialize MindContext in this project"
```

This creates `.project/` structure for project management.

**Step 1.3: Create Submodule**

```bash
# Initialize the production code repository
mkdir my-project
cd my-project
git init
npm init -y  # or your framework init

# Create initial structure
mkdir -p src tests
echo "# My Project" > README.md

# Initial commit
git add .
git commit -m "Initial commit"

# Add remote (GitHub/GitLab)
git remote add origin https://github.com/user/my-project.git
git push -u origin main

# Go back to parent
cd ..

# Add as submodule
git submodule add https://github.com/user/my-project.git my-project
git commit -m "Add my-project submodule"
```

**Step 1.4: Configure Parent**

Create `.gitignore` in parent:
```gitignore
# Ignore all AI context from submodule backups
*.ai-backup
*.context-snapshot

# Node modules (if parent has scripts)
node_modules/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

Create `CLAUDE.md` in parent:
```markdown
# Shadow Engineering Project

This is the **orchestration layer** (shadow).

The actual code lives in: `./my-project/` (submodule)

## Structure

- `.project/` - MindContext project management
- `./my-project/` - Clean production code (submodule)
- `prompts/` - Custom AI prompts
- `docs/` - Planning and architecture

## Workflow

1. Plan in `.project/` (PRDs, epics, tasks)
2. Develop in `./my-project/`
3. AI context stays in parent
4. Commit to submodule with clean messages
5. Push submodule independently
```

### Phase 2: Development Workflow

**Daily Flow:**

```bash
# 1. Start of day (in parent)
cd my-project-mgmt
git pull
git submodule update --remote

# 2. Work with AI (in parent)
# - Create PRDs in .project/
# - Plan epics
# - AI generates code

# 3. Code goes to submodule (automated or manual)
cd my-project
# Code appears here

# 4. Commit to submodule (clean messages)
git add .
git commit -m "feat: Add user authentication"
git push

# 5. Update parent submodule reference
cd ..
git add my-project
git commit -m "chore: Update my-project submodule"
git push
```

**AI-Generated Code Flow:**

```
1. AI generates code in parent context
2. You review and approve
3. Copy/move to my-project/ submodule
4. Clean up any AI artifacts
5. Commit with professional message
6. Push to submodule remote
```

### Phase 3: Submodule Management

**Updating Submodule:**

```bash
# Update to latest
git submodule update --remote my-project

# Or pull manually
cd my-project
git pull origin main
cd ..
git add my-project
git commit -m "chore: Update submodule to latest"
```

**Working on Feature:**

```bash
# Create feature branch in submodule
cd my-project
git checkout -b feature/new-auth
cd ..

# Work on feature (AI helps in parent)
# Code goes to my-project/

# Commit in submodule
cd my-project
git add .
git commit -m "feat: Implement OAuth integration"
git push origin feature/new-auth

# Create PR from submodule branch
gh pr create --title "Add OAuth" --base main
```

## Smart Commit Integration

The `smart-commit` skill automatically handles both repos:

```
"smart commit"
```

This will:
1. Detect changes in submodule
2. Commit to submodule first
3. Update parent submodule reference
4. Commit to parent
5. Push both in correct order

## Conversion from Single Repo

**If you have existing code:**

```bash
# 1. Create new parent repo
mkdir my-project-mgmt
cd my-project-mgmt
git init

# 2. Initialize MindContext
"initialize MindContext"

# 3. Clone your existing project as submodule
git submodule add https://github.com/user/my-project.git my-project

# 4. Migrate AI context to parent
# Move .claude/, CLAUDE.md to parent
mv my-project/.claude ./
mv my-project/CLAUDE.md ./

# 5. Clean up submodule
cd my-project
git rm .claude/ CLAUDE.md
git commit -m "Remove AI context (moved to parent)"
git push

# 6. Update parent
cd ..
git add .
git commit -m "Initialize shadow engineering structure"
git push
```

## Benefits in Practice

### For Open Source Contributors

**Before (Normal Repo):**
```
git log:
feat: Add user profile
WIP trying to fix bug
fix typo
another attempt
ask claude about this
finally works!
cleanup
```

**After (Shadow Engineering):**
```
Submodule git log:
feat: Add user profile component
feat: Implement user data fetching
test: Add profile component tests
```

Clean, professional commits. AI orchestration hidden in parent.

### For Team Projects

**Shadow (Private - You):**
- All AI prompts
- Messy iterations
- Experimental code
- Context documents

**Light (Shared - Team):**
- Clean feature branches
- Professional commits
- Working code only
- Standard PR workflow

### For Client Work

**Your Workspace (Shadow):**
- MindContext project management
- AI experimentation
- Architecture notes
- Multiple approaches tried

**Delivered Product (Light):**
- Production-ready code
- Clean git history
- Professional documentation
- Client owns submodule repo

## Advanced: Worktrees for Multi-Branch Development

When you need to work on multiple submodule branches simultaneously (develop, main, legacy):

```
my-project-mgmt/                   # Parent (main only)
├── .project/
├── my-project/                    # Submodule (main branch)
└── worktrees/
    ├── my-project-develop/        # develop branch worktree
    └── my-project-legacy/         # legacy branch worktree
```

**Setup Worktrees:**

```bash
# From submodule directory
cd my-project

# Create branches
git branch develop
git branch legacy/v1
git push -u origin develop legacy/v1

# Create worktrees in parent
mkdir -p ../worktrees
git worktree add ../worktrees/my-project-develop develop
git worktree add ../worktrees/my-project-legacy legacy/v1
```

**IMPORTANT: Add to `.git/info/exclude` (NOT `.gitignore`)**

Worktrees and other parent-specific paths should go in `.git/info/exclude`:

```bash
# Edit parent's .git/info/exclude
cat >> .git/info/exclude << 'EOF'

# Shadow Engineering excludes (local only, not committed)
# Submodule worktrees
worktrees/

# Archives and reference repos
.archive/
ref/
EOF
```

**Why `.git/info/exclude` instead of `.gitignore`?**
- `.gitignore` is committed → shared with team
- `.git/info/exclude` is local → specific to this clone
- Shadow Engineering parent is YOUR workspace, these paths are local-only

**Update CLAUDE.md to document this:**

Add to the generated CLAUDE.md:
```markdown
## Git Exclude (Local)

These paths are in `.git/info/exclude` (not `.gitignore`):
- `worktrees/` - Submodule branch checkouts
- `.archive/` - Archived experiments
- `ref/` - Reference repositories
```

## Advanced: Multiple Submodules

For complex projects:

```
my-project-mgmt/
├── .project/
├── frontend/          # Submodule 1
├── backend/           # Submodule 2
├── shared/            # Submodule 3
└── infrastructure/    # Submodule 4
```

Each submodule has clean history. Parent orchestrates all.

## Automation Scripts

**Create script:** `scripts/commit-clean.sh`

```bash
#!/bin/bash
# Commit to submodule with clean message

cd my-project

# Stage changes
git add .

# Get commit message (no AI attribution)
read -p "Commit message: " MESSAGE

# Commit
git commit -m "$MESSAGE"

# Push
git push

# Update parent
cd ..
git add my-project
git commit -m "chore: Update my-project submodule"
git push

echo "✅ Clean commit pushed to submodule"
```

## Best Practices

### DO:
✅ Keep AI context in parent only
✅ Write clean commit messages in submodule
✅ Push submodule independently
✅ Document the pattern in parent README
✅ Use `smart-commit` for convenience

### DON'T:
❌ Copy .claude/ into submodule
❌ Reference AI in submodule commits
❌ Mix AI artifacts with production code
❌ Forget to push submodule before parent

## Troubleshooting

### Submodule Out of Sync

```bash
# In parent
git submodule update --init --recursive
```

### Submodule Detached HEAD

```bash
cd my-project
git checkout main
git pull
cd ..
```

### Forgot to Push Submodule

```bash
cd my-project
git push
cd ..
git push
```

## FAQ

**Q: Is this hiding AI usage?**
A: No. It's organizing your workspace. The AI context is for *your* benefit during development. The production code is the deliverable.

**Q: Can others contribute to the submodule?**
A: Yes! The submodule is a normal repo. Contributors don't need to know about the parent.

**Q: What if I don't need the parent anymore?**
A: The submodule is independent. You can abandon the parent and work directly in the submodule.

**Q: Does this work with any framework?**
A: Yes. The pattern is framework-agnostic.

**Q: Can I make the parent public?**
A: You can, but most people keep parent private (AI orchestration) and submodule public (production code).

## Integration with MindContext

Shadow Engineering + MindContext = Powerful combination:

```
.project/prds/user-auth.md       → Planning
.project/epics/user-auth/epic.md → Architecture
.project/epics/user-auth/001.md  → Task details
                                    ↓
AI generates code                   ↓
                                    ↓
my-project/src/auth/               → Clean implementation
```

All planning stays in parent. Clean code goes to submodule.

## Summary

**Shadow Engineering separates concerns:**

| Shadow (Parent) | Light (Submodule) |
|----------------|-------------------|
| AI orchestration | Clean code |
| Messy iteration | Professional commits |
| Planning docs | Production ready |
| Private workspace | Public/team repo |
| MindContext structure | Standard project |

**Result:** Professional output from AI-assisted development.

## Next Steps

1. **Initialize:** Run this skill to set up structure
2. **Migrate:** Move existing AI context to parent
3. **Develop:** Work in parent, commit clean to submodule
4. **Ship:** Push submodule with confidence

**Command to start:**
```
"setup shadow engineering for my-project"
```
