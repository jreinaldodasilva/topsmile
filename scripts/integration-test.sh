#!/bin/bash

echo "=== TopSmile Integration Test Suite ==="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test 1: Check all clinical components exist
echo "Test 1: Checking clinical components..."
COMPONENTS=(
  "src/components/Clinical/DentalChart/index.tsx"
  "src/components/Clinical/TreatmentPlan/index.tsx"
  "src/components/Clinical/ClinicalNotes/index.tsx"
)

MISSING=0
for comp in "${COMPONENTS[@]}"; do
  if [ ! -f "$comp" ]; then
    echo -e "${RED}MISSING: $comp${NC}"
    MISSING=$((MISSING + 1))
  fi
done

if [ $MISSING -eq 0 ]; then
  echo -e "${GREEN}PASS: All clinical components exist${NC}"
else
  echo -e "${RED}FAIL: $MISSING components missing${NC}"
  exit 1
fi

# Test 2: Check PatientDetail page exists
echo ""
echo "Test 2: Checking PatientDetail page..."
if [ -f "src/pages/Admin/PatientDetail.tsx" ]; then
  echo -e "${GREEN}PASS: PatientDetail page exists${NC}"
else
  echo -e "${RED}FAIL: PatientDetail page missing${NC}"
  exit 1
fi

# Test 3: Check route is registered
echo ""
echo "Test 3: Checking route registration..."
if grep -q "PatientDetail" src/routes/index.tsx && grep -q "/admin/patients/:id" src/App.tsx; then
  echo -e "${GREEN}PASS: Route registered${NC}"
else
  echo -e "${RED}FAIL: Route not properly registered${NC}"
  exit 1
fi

# Test 4: Check apiService has clinical methods
echo ""
echo "Test 4: Checking apiService methods..."
METHODS=("dentalCharts" "treatmentPlans" "clinicalNotes" "prescriptions")
MISSING_METHODS=0

for method in "${METHODS[@]}"; do
  if ! grep -q "$method:" src/services/apiService.ts; then
    echo -e "${RED}MISSING: $method method${NC}"
    MISSING_METHODS=$((MISSING_METHODS + 1))
  fi
done

if [ $MISSING_METHODS -eq 0 ]; then
  echo -e "${GREEN}PASS: All apiService methods exist${NC}"
else
  echo -e "${RED}FAIL: $MISSING_METHODS methods missing${NC}"
  exit 1
fi

# Test 5: Check session timeout hook
echo ""
echo "Test 5: Checking session timeout..."
if [ -f "src/hooks/useSessionTimeout.ts" ] && grep -q "useSessionTimeout" src/contexts/AuthContext.tsx; then
  echo -e "${GREEN}PASS: Session timeout implemented${NC}"
else
  echo -e "${RED}FAIL: Session timeout not properly implemented${NC}"
  exit 1
fi

# Test 6: Check documentation exists
echo ""
echo "Test 6: Checking documentation..."
DOCS=(
  "docs/SECURITY_AUDIT.md"
  "docs/SECURITY_IMPROVEMENTS.md"
  "docs/SECURITY_TESTING_GUIDE.md"
  "docs/DEPLOYMENT_CHECKLIST_SECURITY.md"
  "docs/architecture/c4-level1-context.md"
  "docs/api/authentication.md"
)

MISSING_DOCS=0
for doc in "${DOCS[@]}"; do
  if [ ! -f "$doc" ]; then
    echo -e "${YELLOW}MISSING: $doc${NC}"
    MISSING_DOCS=$((MISSING_DOCS + 1))
  fi
done

if [ $MISSING_DOCS -eq 0 ]; then
  echo -e "${GREEN}PASS: All documentation exists${NC}"
else
  echo -e "${YELLOW}WARN: $MISSING_DOCS docs missing${NC}"
fi

echo ""
echo -e "${GREEN}=== All Integration Tests Passed ===${NC}"
