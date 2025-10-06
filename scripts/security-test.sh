#!/bin/bash

echo "=== TopSmile Security Test Suite ==="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Test 1: Check for localStorage token usage
echo "Test 1: Checking for localStorage token usage..."
if grep -r "localStorage.*token" src/ --include="*.ts" --include="*.tsx" | grep -v "test" | grep -v "node_modules"; then
  echo -e "${RED}FAIL: Found localStorage token usage${NC}"
  exit 1
else
  echo -e "${GREEN}PASS: No localStorage token usage found${NC}"
fi

# Test 2: Check for hardcoded secrets (API keys, tokens)
echo ""
echo "Test 2: Checking for hardcoded secrets..."
if grep -rE "(API_KEY|SECRET_KEY|ACCESS_TOKEN|PRIVATE_KEY)\s*=\s*['\"][^'\"]{10,}['\"]" src/ backend/src/ --include="*.ts" --include="*.tsx" | grep -v "test" | grep -v "mock" | grep -v "env"; then
  echo -e "${RED}FAIL: Found hardcoded API keys or secrets${NC}"
  exit 1
else
  echo -e "${GREEN}PASS: No hardcoded secrets found${NC}"
fi

# Test 3: Check for console.log in production code
echo ""
echo "Test 3: Checking for console.log statements..."
COUNT=$(grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" | grep -v "test" | grep -v "node_modules" | wc -l)
if [ $COUNT -gt 10 ]; then
  echo -e "${RED}WARN: Found $COUNT console.log statements${NC}"
else
  echo -e "${GREEN}PASS: Minimal console.log usage ($COUNT)${NC}"
fi

# Test 4: Check dependencies for vulnerabilities
echo ""
echo "Test 4: Checking dependencies for vulnerabilities..."
if [ -f "package-lock.json" ]; then
  npm audit --audit-level=high
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}PASS: No high/critical vulnerabilities${NC}"
  else
    echo -e "${RED}FAIL: Vulnerabilities found${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}SKIP: No package-lock.json found${NC}"
fi

echo ""
echo -e "${GREEN}=== All Security Tests Passed ===${NC}"
