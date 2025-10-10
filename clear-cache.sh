#!/bin/bash

echo "Clearing all caches..."

# Clear webpack cache
rm -rf node_modules/.cache
echo "✓ Cleared webpack cache"

# Clear build
rm -rf build
echo "✓ Cleared build directory"

# Note about service worker
echo ""
echo "⚠️  Service Worker detected!"
echo "In your browser:"
echo "1. Open DevTools (F12)"
echo "2. Go to Application tab"
echo "3. Click 'Service Workers'"
echo "4. Click 'Unregister' for localhost:3000"
echo "5. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)"
echo ""
echo "Or simply open in Incognito/Private mode"
echo ""

echo "Now restart frontend: ./start-frontend-with-logging.sh"
