#!/bin/bash

# Backend Service Refactoring Script
# This script reorganizes services into feature-based subdirectories

set -e

echo "🔄 Starting Backend Service Refactoring..."
echo ""

# Base directory
BASE_DIR="/home/rebelde/Development/topsmile/backend/src/services"

# Create subdirectories if they don't exist
echo "📁 Creating subdirectory structure..."
mkdir -p "$BASE_DIR/auth"
mkdir -p "$BASE_DIR/clinical"
mkdir -p "$BASE_DIR/external"
mkdir -p "$BASE_DIR/patient"
mkdir -p "$BASE_DIR/scheduling"
mkdir -p "$BASE_DIR/admin"
mkdir -p "$BASE_DIR/provider"

# Move auth-related services
echo "🔐 Moving auth services..."
[ -f "$BASE_DIR/authService.ts" ] && mv "$BASE_DIR/authService.ts" "$BASE_DIR/auth/"
[ -f "$BASE_DIR/patientAuthService.ts" ] && mv "$BASE_DIR/patientAuthService.ts" "$BASE_DIR/auth/"
[ -f "$BASE_DIR/mfaService.ts" ] && mv "$BASE_DIR/mfaService.ts" "$BASE_DIR/auth/"
[ -f "$BASE_DIR/sessionService.ts" ] && mv "$BASE_DIR/sessionService.ts" "$BASE_DIR/auth/"
[ -f "$BASE_DIR/tokenBlacklistService.ts" ] && mv "$BASE_DIR/tokenBlacklistService.ts" "$BASE_DIR/auth/"

# Move clinical services
echo "🏥 Moving clinical services..."
[ -f "$BASE_DIR/treatmentPlanService.ts" ] && mv "$BASE_DIR/treatmentPlanService.ts" "$BASE_DIR/clinical/"

# Move external services
echo "📧 Moving external services..."
[ -f "$BASE_DIR/emailService.ts" ] && mv "$BASE_DIR/emailService.ts" "$BASE_DIR/external/"
[ -f "$BASE_DIR/smsService.ts" ] && mv "$BASE_DIR/smsService.ts" "$BASE_DIR/external/"

# Move patient services
echo "👤 Moving patient services..."
[ -f "$BASE_DIR/patientService.ts" ] && mv "$BASE_DIR/patientService.ts" "$BASE_DIR/patient/"
[ -f "$BASE_DIR/familyService.ts" ] && mv "$BASE_DIR/familyService.ts" "$BASE_DIR/patient/"

# Move scheduling services
echo "📅 Moving scheduling services..."
[ -f "$BASE_DIR/appointmentService.ts" ] && mv "$BASE_DIR/appointmentService.ts" "$BASE_DIR/scheduling/"
[ -f "$BASE_DIR/appointmentTypeService.ts" ] && mv "$BASE_DIR/appointmentTypeService.ts" "$BASE_DIR/scheduling/"
[ -f "$BASE_DIR/availabilityService.ts" ] && mv "$BASE_DIR/availabilityService.ts" "$BASE_DIR/scheduling/"
[ -f "$BASE_DIR/bookingService.ts" ] && mv "$BASE_DIR/bookingService.ts" "$BASE_DIR/scheduling/"
[ -f "$BASE_DIR/schedulingService.ts" ] && mv "$BASE_DIR/schedulingService.ts" "$BASE_DIR/scheduling/"

# Move admin services
echo "⚙️  Moving admin services..."
[ -f "$BASE_DIR/contactService.ts" ] && mv "$BASE_DIR/contactService.ts" "$BASE_DIR/admin/"
[ -f "$BASE_DIR/auditService.ts" ] && mv "$BASE_DIR/auditService.ts" "$BASE_DIR/admin/"

# Move provider services
echo "👨‍⚕️ Moving provider services..."
[ -f "$BASE_DIR/providerService.ts" ] && mv "$BASE_DIR/providerService.ts" "$BASE_DIR/provider/"

echo ""
echo "✅ Service files moved successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Create index.ts files for each subdirectory"
echo "2. Update imports across the codebase"
echo "3. Run tests to verify everything works"
echo ""
echo "Run: npm test"
