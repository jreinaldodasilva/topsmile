#!/bin/bash

# Backend Route Refactoring Script - Phase 2
# Consolidates standalone routes into feature directories

set -e

echo "🔄 Starting Backend Route Refactoring (Phase 2)..."
echo ""

BASE_DIR="/home/rebelde/Development/topsmile/backend/src/routes"

# Move analytics to admin
echo "📊 Moving analytics to admin..."
[ -f "$BASE_DIR/analytics.ts" ] && mv "$BASE_DIR/analytics.ts" "$BASE_DIR/admin/"

# Move roleManagement to admin
echo "👥 Moving roleManagement to admin..."
[ -f "$BASE_DIR/roleManagement.ts" ] && mv "$BASE_DIR/roleManagement.ts" "$BASE_DIR/admin/"

# Move appointmentTypes to scheduling
echo "📅 Moving appointmentTypes to scheduling..."
[ -f "$BASE_DIR/appointmentTypes.ts" ] && mv "$BASE_DIR/appointmentTypes.ts" "$BASE_DIR/scheduling/"

# Move permissions to security
echo "🔐 Moving permissions to security..."
[ -f "$BASE_DIR/permissions.ts" ] && mv "$BASE_DIR/permissions.ts" "$BASE_DIR/security/"

# Move providers to new provider directory
echo "👨⚕️ Moving providers to provider directory..."
mkdir -p "$BASE_DIR/provider"
[ -f "$BASE_DIR/providers.ts" ] && mv "$BASE_DIR/providers.ts" "$BASE_DIR/provider/"

# Create public directory for unauthenticated routes
echo "🌐 Creating public directory..."
mkdir -p "$BASE_DIR/public"

# Move public routes
echo "📝 Moving public routes..."
[ -f "$BASE_DIR/contact.ts" ] && mv "$BASE_DIR/contact.ts" "$BASE_DIR/public/"
[ -f "$BASE_DIR/consentForms.ts" ] && mv "$BASE_DIR/consentForms.ts" "$BASE_DIR/public/"
[ -f "$BASE_DIR/forms.ts" ] && mv "$BASE_DIR/forms.ts" "$BASE_DIR/public/"
[ -f "$BASE_DIR/docs.ts" ] && mv "$BASE_DIR/docs.ts" "$BASE_DIR/public/"

echo ""
echo "✅ Route files moved successfully!"
echo ""
echo "📝 Next: Update route index files and app.ts"
