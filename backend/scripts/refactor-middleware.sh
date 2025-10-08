#!/bin/bash

# Backend Middleware Refactoring Script - Phase 3
# Consolidates middleware into feature directories

set -e

echo "🔄 Starting Backend Middleware Refactoring (Phase 3)..."
echo ""

BASE_DIR="/home/rebelde/Development/topsmile/backend/src/middleware"

# Create feature directories
echo "📁 Creating middleware subdirectories..."
mkdir -p "$BASE_DIR/auth"
mkdir -p "$BASE_DIR/security"
mkdir -p "$BASE_DIR/validation"

# Move auth-related middleware
echo "🔐 Moving auth middleware..."
[ -f "$BASE_DIR/auth.ts" ] && mv "$BASE_DIR/auth.ts" "$BASE_DIR/auth/"
[ -f "$BASE_DIR/patientAuth.ts" ] && mv "$BASE_DIR/patientAuth.ts" "$BASE_DIR/auth/"
[ -f "$BASE_DIR/mfaVerification.ts" ] && mv "$BASE_DIR/mfaVerification.ts" "$BASE_DIR/auth/"
[ -f "$BASE_DIR/permissions.ts" ] && mv "$BASE_DIR/permissions.ts" "$BASE_DIR/auth/"
[ -f "$BASE_DIR/roleBasedAccess.ts" ] && mv "$BASE_DIR/roleBasedAccess.ts" "$BASE_DIR/auth/"

# Move security middleware
echo "🛡️  Moving security middleware..."
[ -f "$BASE_DIR/security.ts" ] && mv "$BASE_DIR/security.ts" "$BASE_DIR/security/"
[ -f "$BASE_DIR/rateLimiter.ts" ] && mv "$BASE_DIR/rateLimiter.ts" "$BASE_DIR/security/"
[ -f "$BASE_DIR/passwordPolicy.ts" ] && mv "$BASE_DIR/passwordPolicy.ts" "$BASE_DIR/security/"

# Move validation middleware
echo "✅ Moving validation middleware..."
[ -f "$BASE_DIR/validation.ts" ] && mv "$BASE_DIR/validation.ts" "$BASE_DIR/validation/"

echo ""
echo "✅ Middleware files moved successfully!"
echo ""
echo "📝 Next: Create index files and update imports"
