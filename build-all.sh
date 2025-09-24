#!/bin/bash

set -e

echo "Building TopSmile project..."

# Packages/types
echo "Installing types package dependencies..."
cd packages/types
npm install
echo "Building types package..."
npm run build
cd ../..

# Frontend (root directory)
echo "Installing frontend dependencies..."
npm install
echo "Building frontend..."
npm run build

# Backend
echo "Installing backend dependencies..."
cd backend
npm install
echo "Building backend..."
npm run build
cd ..

echo "All builds completed successfully!"