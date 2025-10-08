#!/bin/bash

# Backend Utility Refactoring Script - Phase 4
# Consolidates utilities into feature directories

set -e

echo "🔄 Starting Backend Utility Refactoring (Phase 4)..."
echo ""

BASE_DIR="/home/rebelde/Development/topsmile/backend/src/utils"

# Create feature directories
echo "📁 Creating utility subdirectories..."
mkdir -p "$BASE_DIR/errors"
mkdir -p "$BASE_DIR/cache"
mkdir -p "$BASE_DIR/validation"

# Move error utilities
echo "❌ Consolidating error utilities..."
[ -f "$BASE_DIR/errors.ts" ] && mv "$BASE_DIR/errors.ts" "$BASE_DIR/errors/"
[ -f "$BASE_DIR/errorLogger.ts" ] && mv "$BASE_DIR/errorLogger.ts" "$BASE_DIR/errors/"

# Move cache utilities
echo "💾 Consolidating cache utilities..."
[ -f "$BASE_DIR/cache.ts" ] && mv "$BASE_DIR/cache.ts" "$BASE_DIR/cache/"
[ -f "$BASE_DIR/cacheInvalidation.ts" ] && mv "$BASE_DIR/cacheInvalidation.ts" "$BASE_DIR/cache/"

# Move validation utilities
echo "✅ Consolidating validation utilities..."
[ -f "$BASE_DIR/validation.ts" ] && mv "$BASE_DIR/validation.ts" "$BASE_DIR/validation/"
[ -f "$BASE_DIR/validators.ts" ] && mv "$BASE_DIR/validators.ts" "$BASE_DIR/validation/"

echo ""
echo "✅ Utility files moved successfully!"
echo ""
echo "📝 Next: Create index files"
