# SecPlus Study App - Automation Scripts

Automated scripts for nightly review and sync to GitHub.

## 📂 Scripts

### review-and-push.sh
**Nightly automated review and sync script** - Runs at 10:10 PM daily

**Features:**
- ✅ Checks for uncommitted changes
- 🔒 **Security Reviews:**
  - Next.js config security (headers, dev origins, optimization)
  - Dockerfile best practices (versions, alpine base, non-root)
  - Docker Compose hardening (read-only, no-new-privileges, health checks)
  - Code security (console.logs, hardcoded secrets)
  - TypeScript configuration (strict mode, type safety)
- 🔍 **Quality Checks:**
  - Dependency updates (npm outdated suggestions)
  - .gitignore coverage
  - Content statistics (flashcards, questions count)
- 🚀 **Auto-fix:**
  - Adds missing security settings
  - Updates .gitignore entries
  - Removes obsolete Docker Compose version attributes
- 📦 **Auto-commit & push:**
  - Commits all changes with detailed message
  - Pushes to GitHub automatically

**Schedule:** Daily at 10:10 PM EST (via system crontab)

**Logs:** `.scripts/review.log`

## 🔧 Management

### Run manually
```bash
cd /home/claw/.openclaw/workspace/secplus-study
./.scripts/review-and-push.sh
```

### View logs
```bash
tail -f .scripts/review.log
```

### Check cron status
```bash
crontab -l
```

### Edit cron schedule
```bash
crontab -e
```

### Remove cron job
```bash
crontab -e
# Delete line with secplus-study script
```

## ⚙️ Installation

Run setup script:
```bash
chmod +x .scripts/setup-cron.sh
./.scripts/setup-cron.sh
```

## 📋 Security Checks Performed

### Next.js Configuration
- ✅ `poweredByHeader: false` enabled
- ⚠️  Dev origins removed for production
- ℹ️  Standalone output recommended (Docker optimization)
- ℹ️  Image optimization settings reviewed

### Dockerfile
- ⚠️  Specific version tags instead of `latest`
- ℹ️  Alpine base recommended
- ⚠️  Non-root user configured
- ℹ️  Multi-stage build recommended

### Docker Compose
- ✅ `read_only: true` enabled
- ✅ `no-new-privileges:true` enabled
- ✅ Health checks present
- ✅ Resource limits configured
- ⚠️  Preference for `env_file` over inline env vars
- ⚠️  Obsolete version attribute removed

### Code Security
- ⚠️  Console.log statements flagged
- 🚨 Hardcoded secrets detection
- ⚠️  TypeScript strict mode verification

### Dependencies & Configuration
- ℹ️  Outdated package suggestions
- ⚠️  TypeScript strict mode check
- ✅ .gitignore coverage

### Content Review
- ℹ️  Flashcard count tracking
- ℹ️  Practice question count tracking
- ℹ️  Content expansion suggestions

## 🎯 Customization

To modify schedule, edit crontab:
```bash
crontab -e
```

Examples:
- 10:10pm daily: `10 22 * * *`
- 10:10pm weekdays: `10 22 * * 1-5`
- Every 6 hours: `0 */6 * * *`

## 📊 Differences from Homelab Script

This script is tailored for Next.js applications:

- **Next.js specific checks** (config, headers, image optimization)
- **TypeScript security** (strict mode, type safety)
- **Content tracking** (flashcard/question counts)
- **Code scanning** (console.log, hardcoded secrets)
- **Dependency monitoring** (npm outdated suggestions)

Compared to the homelab script which focuses on:
- Docker infrastructure
- Multiple service management
- Git security (preventing .env commits)
- Docker Compose best practices

## 🔐 Secret Management

GitHub token stored in `.scripts/.config` (not committed to git):
```
GITHUB_TOKEN="ghp_..."
```

This file is added to `.gitignore` to prevent accidental commits.
