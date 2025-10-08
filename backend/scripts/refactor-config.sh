#!/bin/bash

# Backend Config Refactoring Script - Phase 5
# Consolidates config files into feature directories

set -e

echo "🔄 Starting Backend Config Refactoring (Phase 5)..."
echo ""

BASE_DIR="/home/rebelde/Development/topsmile/backend/src/config"

# Create feature directories
echo "📁 Creating config subdirectories..."
mkdir -p "$BASE_DIR/database"
mkdir -p "$BASE_DIR/security"
mkdir -p "$BASE_DIR/clinical"

# Move database configs
echo "🗄️  Moving database configs..."
[ -f "$BASE_DIR/database.ts" ] && mv "$BASE_DIR/database.ts" "$BASE_DIR/database/"
[ -f "$BASE_DIR/redis.ts" ] && mv "$BASE_DIR/redis.ts" "$BASE_DIR/database/"

# Move security configs
echo "🔐 Moving security configs..."
[ -f "$BASE_DIR/security.ts" ] && mv "$BASE_DIR/security.ts" "$BASE_DIR/security/"
[ -f "$BASE_DIR/permissions.ts" ] && mv "$BASE_DIR/permissions.ts" "$BASE_DIR/security/"

# Move clinical configs
echo "🏥 Moving clinical configs..."
[ -f "$BASE_DIR/cdtCodes.ts" ] && mv "$BASE_DIR/cdtCodes.ts" "$BASE_DIR/clinical/"
[ -f "$BASE_DIR/medicalConditions.ts" ] && mv "$BASE_DIR/medicalConditions.ts" "$BASE_DIR/clinical/"
[ -f "$BASE_DIR/noteTemplates.ts" ] && mv "$BASE_DIR/noteTemplates.ts" "$BASE_DIR/clinical/"

echo ""
echo "✅ Config files moved successfully!"
echo ""
echo "📝 Next: Create index files"
