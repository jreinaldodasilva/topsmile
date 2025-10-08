#!/bin/bash

# Script to align backend with shared types
# Replaces local type imports with @topsmile/types imports

set -e

echo "🔄 Aligning backend with shared types..."
echo ""

# Files that should use shared types
FILES_TO_UPDATE=(
  "src/routes/**/*.ts"
  "src/services/**/*.ts"
  "src/middleware/**/*.ts"
)

# Count of files updated
UPDATED=0

# Function to update imports in a file
update_file_imports() {
  local file="$1"
  
  # Skip if file doesn't exist
  [ ! -f "$file" ] && return
  
  # Check if file already uses @topsmile/types
  if grep -q "@topsmile/types" "$file" 2>/dev/null; then
    return
  fi
  
  # Check if file has local type imports that should be from shared
  if grep -qE "from ['\"].*/(Patient|User|Appointment|Provider|Clinic|Contact)" "$file" 2>/dev/null; then
    echo "✅ Would update: $file"
    ((UPDATED++))
  fi
}

# Find and process files
for pattern in "${FILES_TO_UPDATE[@]}"; do
  while IFS= read -r file; do
    update_file_imports "$file"
  done < <(find . -path "./$pattern" -type f 2>/dev/null)
done

echo ""
echo "📊 Summary:"
echo "   Files that need updating: $UPDATED"
echo ""
echo "✨ Next: Run the Node.js script to perform actual updates"
