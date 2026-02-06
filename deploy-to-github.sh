#!/bin/bash

# Deploy from local to GitHub: stage, commit, and push
# Usage: ./deploy-to-github.sh [commit message]
#   If no message is given, uses: "Deploy: update from local"

set -e

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

COMMIT_MSG="${*:-Deploy: update from local}"
BRANCH="$(git branch --show-current)"

echo "📁 Repository: $REPO_ROOT"
echo "🌿 Branch: $BRANCH"
echo ""

# Stage all changes
echo "📦 Staging changes..."
git add -A

# Check if there's anything to commit
if git diff --staged --quiet 2>/dev/null; then
    echo "✅ Nothing to commit — working tree clean."
    exit 0
fi

echo "📝 Committing: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

echo "🚀 Pushing to origin/$BRANCH..."
git push origin "$BRANCH"

echo ""
echo "✅ Deployed to GitHub."
