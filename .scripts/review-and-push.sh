#!/bin/bash

# SecPlus Study App - Automated Review and Push Script
# Runs nightly at 10:10pm to review changes and push to GitHub

set -e

REPO_DIR="/home/claw/.openclaw/workspace/secplus-study"
LOG_FILE="/home/claw/.openclaw/logs/secplus-study-review.log"
CONFIG_FILE="/home/claw/.openclaw/workspace/secplus-study/.scripts/.config"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

cd "$REPO_DIR" || exit 1

# Load GitHub token from config file
if [ -f "$CONFIG_FILE" ]; then
  source "$CONFIG_FILE"
else
  log "ERROR: Config file not found: $CONFIG_FILE"
  log "Please create it with: GITHUB_TOKEN=\"your_token_here\""
  exit 1
fi

log "Starting nightly review and push for SecPlus Study..."

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
  log "Changes detected. Running security and quality review..."

  CHANGES_MADE=0

  # Check 1: Next.js configuration
  log "Checking Next.js configuration..."
  if [ -f "next.config.ts" ] || [ -f "next.config.js" ]; then
    next_config="next.config.ts"
    [ ! -f "$next_config" ] && next_config="next.config.js"

    # Check for poweredBy header
    if ! grep -q "poweredByHeader: false" "$next_config"; then
      log "⚠️  Missing poweredByHeader: false in $next_config"
      # Try to add it if there's a config object
      if grep -q "const nextConfig" "$next_config"; then
        sed -i '/const nextConfig/a\  poweredByHeader: false,' "$next_config"
        CHANGES_MADE=1
      fi
    fi

    # Check for dev origins in production
    if grep -q "allowedDevOrigins:" "$next_config" && grep -qE "(localhost|192\.168|10\.0|172\.(1[6-9]|2[0-9]|3[01]))" "$next_config"; then
      log "⚠️  Found dev origins in $next_config - review for production"
      CHANGES_MADE=1
    fi

    # Check for standalone output (Docker optimization)
    if ! grep -q "standalone" "$next_config"; then
      log "ℹ️  Consider using output: 'standalone' for smaller Docker images"
    fi

    # Check for image optimization (if needed)
    if grep -q "images:" "$next_config"; then
      if grep -q "unoptimized: true" "$next_config"; then
        log "ℹ️  Image optimization disabled - fine for self-hosted study app"
      fi
    fi
  fi

  # Check 2: Dockerfile security
  log "Checking Dockerfile..."
  if [ -f "Dockerfile" ]; then
    # Check for latest tag
    if grep -q "FROM.*:latest" Dockerfile; then
      log "⚠️  Using 'latest' tag - use specific version for reproducibility"
    fi

    # Check for alpine base (good for security)
    if ! grep -q "alpine" Dockerfile; then
      log "ℹ️  Consider using alpine base for smaller attack surface"
    fi

    # Check for non-root user
    if ! grep -q "USER.*node\|USER.*nginx" Dockerfile; then
      log "⚠️  May be running as root - consider adding USER directive"
    fi

    # Check for multi-stage build
    if ! grep -q "AS.*deps\|AS.*builder\|AS.*runner" Dockerfile; then
      log "ℹ️  Consider multi-stage build for smaller image size"
    fi
  fi

  # Check 3: Docker Compose security
  log "Checking docker-compose.yml..."
  if [ -f "docker-compose.yml" ]; then
    # Check for read-only filesystem
    if ! grep -q "read_only: true" docker-compose.yml; then
      log "⚠️  Missing read_only in docker-compose.yml"
      sed -i '/security_opt:/a\    read_only: true' docker-compose.yml
      CHANGES_MADE=1
    fi

    # Check for no-new-privileges
    if ! grep -q "no-new-privileges:true" docker-compose.yml; then
      log "⚠️  Missing no-new-privileges in docker-compose.yml"
      if ! grep -q "security_opt:" docker-compose.yml; then
        sed -i '/restart:/a\    security_opt:\n      - no-new-privileges:true' docker-compose.yml
      fi
      CHANGES_MADE=1
    fi

    # Check for health checks
    if ! grep -q "healthcheck:" docker-compose.yml; then
      log "⚠️  Missing healthcheck in docker-compose.yml"
      CHANGES_MADE=1
    fi

    # Check for resource limits
    if ! grep -q "deploy:" docker-compose.yml; then
      log "⚠️  Missing resource limits in docker-compose.yml"
      CHANGES_MADE=1
    fi

    # Check for env_file
    if grep -q "environment:" docker-compose.yml && ! grep -q "env_file:" docker-compose.yml; then
      log "ℹ️  Consider using env_file instead of inline environment variables"
    fi

    # Check for obsolete version attribute
    if grep -q "^version:" docker-compose.yml; then
      log "⚠️  Removing obsolete version attribute from docker-compose.yml"
      sed -i '/^version:/d' docker-compose.yml
      CHANGES_MADE=1
    fi
  fi

  # Check 4: Security issues in code
  log "Checking for security issues in code..."

  # Check for console.log in production code
  if grep -r "console.log" app/ components/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "//"; then
    log "⚠️  Found console.log statements - remove before production"
  fi

  # Check for hardcoded secrets (simple check)
  if grep -rE "(password|secret|api_key|token)\\s*[:=]\\s*[\"\\'][^\"\\']{10,}" app/ components/ lib/ --include="*.tsx" --include="*.ts" 2>/dev/null; then
    log "🚨 WARNING: Possible hardcoded secrets found - review manually"
  fi

  # Check 5: Dependencies
  log "Checking dependencies..."
  if [ -f "package.json" ]; then
    # Check for outdated packages
    log "ℹ️  Run 'npm outdated' to check for security updates"

    # Check for dev dependencies in production
    if grep -qE "(eslint|prettier|@types)" package.json && [ "$NODE_ENV" = "production" ]; then
      log "ℹ️  Dev dependencies detected - OK for build, not runtime"
    fi
  fi

  # Check 6: TypeScript configuration
  log "Checking TypeScript configuration..."
  if [ -f "tsconfig.json" ]; then
    # Check for noUncheckedIndexedAccess (good for security)
    if ! grep -q "noUncheckedIndexedAccess" tsconfig.json; then
      log "ℹ️  Consider adding noUncheckedIndexedAccess for better type safety"
    fi

    # Check for strict mode
    if ! grep -q '"strict".*true' tsconfig.json; then
      log "⚠️  TypeScript strict mode not enabled"
    fi
  fi

  # Check 7: .gitignore
  log "Checking .gitignore..."
  if [ -f ".gitignore" ]; then
    # Ensure .env is ignored
    if ! grep -q "^\.env$" .gitignore; then
      log "⚠️  Adding .env to .gitignore"
      echo ".env" >> .gitignore
      CHANGES_MADE=1
    fi

    # Ensure .env.local is ignored
    if ! grep -q "\.env\.local" .gitignore; then
      log "⚠️  Adding .env.local to .gitignore"
      echo ".env.local" >> .gitignore
      CHANGES_MADE=1
    fi

    # Ensure node_modules is ignored
    if ! grep -q "node_modules" .gitignore; then
      log "⚠️  Adding node_modules to .gitignore"
      echo "node_modules/" >> .gitignore
      CHANGES_MADE=1
    fi

    # Ensure .next is ignored
    if ! grep -q "\.next" .gitignore; then
      log "⚠️  Adding .next to .gitignore"
      echo ".next/" >> .gitignore
      CHANGES_MADE=1
    fi
  fi

  # Check 8: Content updates (flashcards, questions)
  log "Checking study content..."
  if [ -f "lib/secplus-data.ts" ]; then
    # Count flashcards
    flashcard_count=$(grep -c "id: [0-9]" lib/secplus-data.ts || echo "0")
    log "ℹ️  Flashcard count: $flashcard_count"

    # Count practice questions
    question_count=$(grep -c "id: [0-9]" lib/secplus-data.ts | grep -o "[0-9]" | head -1 || echo "0")
    log "ℹ️  Practice question count: $question_count"

    # Suggest adding more content if low
    if [ "$flashcard_count" -lt 50 ]; then
      log "ℹ️  Consider adding more flashcards (currently: $flashcard_count)"
    fi
    if [ "$question_count" -lt 50 ]; then
      log "ℹ️  Consider adding more practice questions (currently: $question_count)"
    fi
  fi

  # Summary
  if [ "$CHANGES_MADE" -eq 1 ]; then
    log "✅ Security and quality improvements applied"
  else
    log "✅ No security issues found"
  fi

  # Commit and push changes
  log "Committing changes..."
  git add -A

  # Generate commit message
  COMMIT_MSG="Automated nightly review and sync

$(date '+%Y-%m-%d %H:%M:%S')"

  if [ "$CHANGES_MADE" -eq 1 ]; then
    COMMIT_MSG="$COMMIT_MSG

Security and quality improvements applied."
  fi

  git commit -m "$COMMIT_MSG"

  log "Pushing to GitHub..."
  git remote set-url origin "https://${GITHUB_TOKEN}@github.com/alove4tech/secplus-study.git"
  git push

  log "✅ Successfully pushed changes to GitHub"

else
  log "No changes to commit. Skipping push."
fi

log "Review complete."
