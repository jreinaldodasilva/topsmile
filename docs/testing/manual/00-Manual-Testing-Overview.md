# TopSmile - Manual Testing Guide Overview

## Purpose

This manual testing guide enables testers and developers to verify TopSmile functionality directly through a web browser without relying on automated tests. The guide provides step-by-step procedures to:

- Validate major application features from the user's perspective
- Identify and record UI or functional issues
- Verify integration between frontend and backend components
- Confirm role-based behavior and permissions
- Ensure consistent user experience across different scenarios

## Document Structure

The manual testing guide is organized into the following documents:

1. **00-Manual-Testing-Overview.md** (this document) - Introduction and guide structure
2. **01-Environment-Setup.md** - Browser setup, test accounts, and environment preparation
3. **02-Authentication-Tests.md** - Login, logout, password recovery, and session management
4. **03-Staff-Dashboard-Tests.md** - Staff dashboard functionality and navigation
5. **04-Patient-Portal-Tests.md** - Patient self-service portal features
6. **05-Appointment-Management-Tests.md** - Scheduling, booking, and appointment workflows
7. **06-Patient-Management-Tests.md** - Patient records, registration, and medical history
8. **07-Provider-Management-Tests.md** - Provider profiles, availability, and specialties
9. **08-Role-Based-Access-Tests.md** - Permission verification for all user roles
10. **09-Payment-Processing-Tests.md** - Stripe integration and payment workflows
11. **10-Error-Handling-Tests.md** - Error scenarios and user feedback
12. **11-Performance-Responsiveness-Tests.md** - Load times, responsiveness, and mobile testing
13. **12-Issue-Reporting-Template.md** - How to document and report findings

## Testing Approach

### Test Execution Flow

1. **Setup** - Prepare browser and test environment (Document 01)
2. **Authentication** - Verify login/logout for all user types (Document 02)
3. **Role-Specific Testing** - Test features for each user role (Documents 03-07)
4. **Cross-Cutting Concerns** - Test permissions, errors, performance (Documents 08-11)
5. **Report Findings** - Document issues using standard template (Document 12)

### Test Result Format

Each test case uses this format:

| Test ID | Test Case | Expected Result | Actual Result | Status | Notes |
|---------|-----------|-----------------|---------------|--------|-------|
| TC-XXX-001 | Description | What should happen | What happened | Pass/Fail | Screenshots, logs |

**Status Values:**
- ✅ **Pass** - Feature works as expected
- ❌ **Fail** - Feature does not work correctly
- ⚠️ **Partial** - Feature works but has minor issues
- 🔄 **Blocked** - Cannot test due to dependency
- ⏭️ **Skipped** - Intentionally not tested

## Testing Principles

### Comprehensive Coverage
- Test happy paths (expected user behavior)
- Test edge cases (boundary conditions, unusual inputs)
- Test error scenarios (invalid data, network issues)
- Test cross-browser compatibility (Chrome, Firefox, Safari, Brave)

### User-Centric Approach
- Follow realistic user journeys
- Verify user-facing messages are in Portuguese
- Confirm error messages are clear and actionable
- Validate accessibility features

### Data Integrity
- Verify data persists correctly
- Confirm updates reflect in real-time
- Check data consistency across different views
- Validate multi-tenant data isolation (clinic scoping)

### Security Validation
- Confirm unauthorized access is blocked
- Verify role-based permissions
- Test session timeout behavior
- Validate CSRF protection

## Prerequisites

Before starting manual testing:

- [ ] Read Document 01 (Environment Setup)
- [ ] Install supported browser (Brave, Chrome, Firefox)
- [ ] Obtain test account credentials for all roles
- [ ] Verify backend and frontend servers are running
- [ ] Confirm database has test data loaded
- [ ] Enable browser developer tools

## Test Execution Guidelines

### Before Each Test Session
1. Clear browser cache and cookies
2. Open browser developer console (F12)
3. Note browser version and operating system
4. Verify test environment is accessible
5. Log in with appropriate test account

### During Testing
1. Follow test steps exactly as documented
2. Record actual results for each test case
3. Take screenshots of any issues
4. Copy console errors or network failures
5. Note any unexpected behavior

### After Each Test Session
1. Log out properly
2. Document all findings
3. Create GitHub issues for failures
4. Update test results in tracking sheet
5. Clear test data if necessary

## Test Data Management

### Test Accounts

Test accounts are provided for each role:
- Super Admin
- Clinic Admin
- Provider (Dentist)
- Staff (Receptionist)
- Patient

See Document 01 for specific credentials.

### Test Data Reset

If test data becomes corrupted:
1. Contact development team for database reset
2. Or use provided reset scripts (if available)
3. Verify test accounts still work after reset

## Browser Requirements

### Supported Browsers
- **Brave** (latest version) - Primary test browser
- **Chrome** (latest version)
- **Firefox** (latest version)
- **Safari** (latest version, macOS only)

### Browser Extensions
- React Developer Tools (optional, for debugging)
- Redux DevTools (optional, for state inspection)

### Developer Tools
- Console tab - Monitor JavaScript errors
- Network tab - Inspect API requests/responses
- Application tab - Check cookies, localStorage, sessionStorage
- Elements tab - Inspect DOM and CSS

## Success Criteria

Manual testing is successful when:
- All critical user journeys complete without errors
- Role-based permissions function correctly
- Data persists and displays accurately
- Error messages are clear and in Portuguese
- Performance meets acceptable standards
- No security vulnerabilities discovered
- All findings are properly documented

## Next Steps

1. Proceed to **Document 01 - Environment Setup**
2. Configure your testing environment
3. Begin with **Document 02 - Authentication Tests**
4. Follow documents sequentially for comprehensive coverage

## Maintenance

### Updating This Guide
- Update test cases when features change
- Add new test documents for new features
- Archive obsolete test cases
- Keep test credentials current
- Review and update quarterly

### Alignment with Automated Tests
- Manual tests complement automated tests
- Focus manual testing on UX and visual aspects
- Use manual tests for exploratory testing
- Automate repetitive manual test cases

## Contact

For questions about manual testing:
- Review test documentation in `/docs/testing/manual/`
- Check automated test examples in `/src/tests/` and `/backend/tests/`
- Consult development team for environment issues

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-15  
**Next Review**: 2024-04-15
