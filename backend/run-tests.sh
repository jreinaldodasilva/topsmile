#!/bin/bash

# TopSmile Backend Test Runner
# This script runs all backend tests with proper setup and cleanup

set -e

echo "🧪 Starting TopSmile Backend Test Suite"
echo "========================================"

# Load test environment variables
if [ -f ".env.test" ]; then
    export $(cat .env.test | grep -v '^#' | xargs)
    echo "✅ Loaded test environment variables"
else
    echo "⚠️  .env.test not found, using defaults"
fi

# Set test environment
export NODE_ENV=test

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if MongoDB is running (for local development)
check_mongodb() {
    if command -v mongod &> /dev/null; then
        if pgrep mongod > /dev/null; then
            print_status "MongoDB is running"
        else
            print_warning "MongoDB not running - using MongoDB Memory Server"
        fi
    else
        print_warning "MongoDB not installed - using MongoDB Memory Server"
    fi
}

# Check if Redis is running (optional for tests)
check_redis() {
    if command -v redis-server &> /dev/null; then
        if pgrep redis-server > /dev/null; then
            print_status "Redis is running"
        else
            print_warning "Redis not running - some features may be limited"
        fi
    else
        print_warning "Redis not installed - some features may be limited"
    fi
}

# Run specific test suites
run_unit_tests() {
    echo ""
    echo "🔬 Running Unit Tests"
    echo "--------------------"
    npm test -- --testPathPattern="tests/unit" --verbose
}

run_integration_tests() {
    echo ""
    echo "🔗 Running Integration Tests"
    echo "---------------------------"
    npm test -- --testPathPattern="tests/integration" --verbose
}

run_all_tests() {
    echo ""
    echo "🚀 Running All Tests"
    echo "-------------------"
    npm test -- --verbose
}

run_coverage() {
    echo ""
    echo "📊 Running Tests with Coverage"
    echo "-----------------------------"
    npm run test:coverage
}

# Main execution
main() {
    # Check dependencies
    check_mongodb
    check_redis
    
    # Parse command line arguments
    case "${1:-all}" in
        "unit")
            run_unit_tests
            ;;
        "integration")
            run_integration_tests
            ;;
        "coverage")
            run_coverage
            ;;
        "all"|"")
            run_all_tests
            ;;
        *)
            echo "Usage: $0 [unit|integration|coverage|all]"
            echo ""
            echo "Options:"
            echo "  unit        - Run only unit tests"
            echo "  integration - Run only integration tests"
            echo "  coverage    - Run all tests with coverage report"
            echo "  all         - Run all tests (default)"
            exit 1
            ;;
    esac
    
    if [ $? -eq 0 ]; then
        print_status "All tests completed successfully!"
        echo ""
        echo "📋 Test Reports:"
        echo "  - JUnit XML: reports/junit-backend.xml"
        echo "  - Coverage: coverage/backend/"
    else
        print_error "Some tests failed!"
        exit 1
    fi
}

# Run main function with all arguments
main "$@"