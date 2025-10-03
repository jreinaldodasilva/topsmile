#!/bin/bash

# K6 Performance Test Runner for TopSmile Backend

set -e

echo "🚀 Starting K6 Performance Tests"
echo "================================="

# Check if k6 is installed
if ! command -v k6 &> /dev/null; then
    echo "❌ k6 is not installed. Please install k6 first:"
    echo "   https://k6.io/docs/getting-started/installation/"
    exit 1
fi

# Set default API URL
API_URL=${API_URL:-"http://localhost:5000"}
echo "🎯 Testing API at: $API_URL"

# Function to run k6 test
run_k6_test() {
    local test_file=$1
    local test_name=$2
    
    echo ""
    echo "📊 Running $test_name..."
    echo "------------------------"
    
    k6 run --env API_URL="$API_URL" "tests/k6/$test_file"
    
    if [ $? -eq 0 ]; then
        echo "✅ $test_name completed successfully"
    else
        echo "❌ $test_name failed"
        return 1
    fi
}

# Parse command line arguments
case "${1:-all}" in
    "auth")
        run_k6_test "auth-load.js" "Authentication Load Test"
        ;;
    "appointments")
        run_k6_test "appointments-load.js" "Appointments Load Test"
        ;;
    "stress")
        run_k6_test "stress-test.js" "Stress Test"
        ;;
    "all")
        run_k6_test "auth-load.js" "Authentication Load Test"
        run_k6_test "appointments-load.js" "Appointments Load Test"
        ;;
    *)
        echo "Usage: $0 [auth|appointments|stress|all]"
        echo ""
        echo "Options:"
        echo "  auth         - Run authentication load tests"
        echo "  appointments - Run appointments load tests"
        echo "  stress       - Run stress tests"
        echo "  all          - Run all load tests (default)"
        exit 1
        ;;
esac

echo ""
echo "🎉 K6 Performance Tests Completed!"