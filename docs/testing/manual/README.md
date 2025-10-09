# TopSmile Manual Testing Guide

## Overview

This directory contains comprehensive manual testing documentation for the TopSmile dental clinic management system. These guides enable testers to verify functionality directly through a web browser without relying on automated tests.

## Quick Start

1. **Read**: [00-Manual-Testing-Overview.md](./00-Manual-Testing-Overview.md)
2. **Setup**: [01-Environment-Setup.md](./01-Environment-Setup.md)
3. **Test**: Follow documents 02-11 sequentially
4. **Report**: Use [12-Issue-Reporting-Template.md](./12-Issue-Reporting-Template.md)

## Document Index

### Getting Started
| Document | Description | Status |
|----------|-------------|--------|
| [00-Manual-Testing-Overview.md](./00-Manual-Testing-Overview.md) | Introduction, structure, and testing principles | ✅ Complete |
| [01-Environment-Setup.md](./01-Environment-Setup.md) | Browser setup, test accounts, environment preparation | ✅ Complete |

### Core Functionality Tests
| Document | Description | Test Count | Status |
|----------|-------------|------------|--------|
| [02-Authentication-Tests.md](./02-Authentication-Tests.md) | Login, logout, password recovery, security | 18 tests | ✅ Complete |
| [03-Staff-Dashboard-Tests.md](./03-Staff-Dashboard-Tests.md) | Dashboard, navigation, role-specific views | 20 tests | ✅ Complete |
| [04-Patient-Portal-Tests.md](./04-Patient-Portal-Tests.md) | Patient self-service portal features | 📝 Planned |
| [05-Appointment-Management-Tests.md](./05-Appointment-Management-Tests.md) | Scheduling, booking, calendar functionality | 23 tests | ✅ Complete |
| [06-Patient-Management-Tests.md](./06-Patient-Management-Tests.md) | Patient records, registration, medical history | 📝 Planned |
| [07-Provider-Management-Tests.md](./07-Provider-Management-Tests.md) | Provider profiles, availability, specialties | 📝 Planned |

### Cross-Cutting Concerns
| Document | Description | Test Count | Status |
|----------|-------------|------------|--------|
| [08-Role-Based-Access-Tests.md](./08-Role-Based-Access-Tests.md) | Permission verification for all roles | 📝 Planned |
| [09-Payment-Processing-Tests.md](./09-Payment-Processing-Tests.md) | Stripe integration and payment workflows | 📝 Planned |
| [10-Error-Handling-Tests.md](./10-Error-Handling-Tests.md) | Error scenarios and user feedback | 📝 Planned |
| [11-Performance-Responsiveness-Tests.md](./11-Performance-Responsiveness-Tests.md) | Load times, responsiveness, mobile testing | 📝 Planned |

### Reporting
| Document | Description | Status |
|----------|-------------|--------|
| [12-Issue-Reporting-Template.md](./12-Issue-Reporting-Template.md) | How to document and report findings | ✅ Complete |

## Test Execution Status

### Current Progress
- ✅ **Completed**: 5 documents (Overview, Setup, Auth, Dashboard, Appointments, Reporting)
- 📝 **Planned**: 6 documents (Patient Portal, Patient Mgmt, Provider Mgmt, RBAC, Payment, Error Handling, Performance)
- **Total Test Cases Documented**: 61+
- **Estimated Total**: 150+ test cases when complete

### Test Coverage by Feature
| Feature Area | Test Cases | Status |
|--------------|------------|--------|
| Authentication | 18 | ✅ Documented |
| Staff Dashboard | 20 | ✅ Documented |
| Appointments | 23 | ✅ Documented |
| Patient Portal | TBD | 📝 Planned |
| Patient Management | TBD | 📝 Planned |
| Provider Management | TBD | 📝 Planned |
| Role-Based Access | TBD | 📝 Planned |
| Payment Processing | TBD | 📝 Planned |
| Error Handling | TBD | 📝 Planned |
| Performance | TBD | 📝 Planned |

## Testing Workflow

### 1. Preparation Phase
```
┌─────────────────────────────────────┐
│ Read Overview & Setup Documents     │
│ Configure Browser & Environment     │
│ Obtain Test Accounts                │
│ Verify Environment Running          │
└─────────────────────────────────────┘
```

### 2. Execution Phase
```
┌─────────────────────────────────────┐
│ Follow Test Documents Sequentially  │
│ Execute Each Test Case              │
│ Record Results in Tables            │
│ Take Screenshots of Issues          │
│ Copy Console/Network Errors         │
└─────────────────────────────────────┘
```

### 3. Reporting Phase
```
┌─────────────────────────────────────┐
│ Document All Findings               │
│ Create GitHub Issues for Failures   │
│ Update Test Result Tables           │
│ Calculate Pass Rates                │
│ Share Results with Team             │
└─────────────────────────────────────┘
```

## Test Result Format

Each test case uses this standardized format:

```markdown
| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-XXX-001 | ✅ Pass | Works as expected | - |
| TC-XXX-002 | ❌ Fail | Error on submit | See issue #123 |
| TC-XXX-003 | ⚠️ Partial | Minor UI issue | Low priority |
| TC-XXX-004 | 🔄 Blocked | Depends on TC-002 | - |
| TC-XXX-005 | ⏭️ Skipped | Not applicable | - |
```

## Test Environments

### Development (Primary)
```
Frontend: http://localhost:3000
Backend: http://localhost:5000
Database: MongoDB (local)
Redis: localhost:6379
```

### Staging (Optional)
```
Frontend: https://staging.topsmile.com
Backend: https://api-staging.topsmile.com
Database: MongoDB (staging)
Redis: Redis (staging)
```

### Production (View Only)
```
⚠️ WARNING: Never perform testing in production
Use only for reference or critical bug verification
```

## Test Accounts

### Staff Accounts
- **Super Admin**: superadmin@test.topsmile.com
- **Admin**: admin@test.topsmile.com
- **Provider**: dentist@test.topsmile.com
- **Staff**: staff@test.topsmile.com

### Patient Accounts
- **Patient 1**: patient1@test.topsmile.com
- **Patient 2**: patient2@test.topsmile.com

**Note**: See [01-Environment-Setup.md](./01-Environment-Setup.md) for passwords and details.

## Browser Support

### Primary Test Browsers
- ✅ **Brave** (latest) - Primary test browser
- ✅ **Chrome** (latest) - Primary test browser
- ✅ **Firefox** (latest) - Secondary test browser

### Additional Browsers
- ⚠️ **Safari** (latest, macOS only) - Cross-browser testing
- ✅ **Edge** (latest) - Cross-browser testing

## Test Data Requirements

### Minimum Test Data
- 2+ clinics
- 3+ providers per clinic
- 10+ patients per clinic
- 20+ appointments (past and future)
- Various appointment types
- Sample treatment plans
- Sample clinical notes

### Data Reset
If test data becomes corrupted:
```bash
npm run db:reset:test
npm run db:seed:test
```

## Issue Reporting

### Severity Levels
- 🔴 **Critical** - System unusable, data loss, security issue
- 🟠 **High** - Major feature broken, significant impact
- 🟡 **Medium** - Feature partially broken, workaround exists
- 🟢 **Low** - Minor issue, cosmetic problem

### Where to Report
1. **GitHub Issues**: Primary bug tracking
2. **Test Results**: Update test case tables
3. **Team Communication**: Notify team of critical issues

### Issue Template
See [12-Issue-Reporting-Template.md](./12-Issue-Reporting-Template.md) for complete templates and examples.

## Testing Best Practices

### Before Testing
- ✅ Clear browser cache and cookies
- ✅ Open browser developer console (F12)
- ✅ Note browser version and OS
- ✅ Verify environment is running
- ✅ Log in with appropriate test account

### During Testing
- ✅ Follow test steps exactly
- ✅ Record actual results
- ✅ Take screenshots of issues
- ✅ Copy console errors
- ✅ Note unexpected behavior

### After Testing
- ✅ Log out properly
- ✅ Document all findings
- ✅ Create GitHub issues
- ✅ Update test results
- ✅ Clear test data if needed

## Test Metrics

### Key Metrics to Track
| Metric | Description |
|--------|-------------|
| **Test Cases Executed** | Total number of test cases run |
| **Pass Rate** | Percentage of tests passed |
| **Defects Found** | Total bugs discovered |
| **Critical Defects** | High-priority bugs |
| **Test Coverage** | Features tested vs. total features |
| **Execution Time** | Time spent testing |

### Sample Metrics Report
```
Test Execution Summary - 2024-01-15

Total Test Cases: 61
Executed: 61
Passed: 54 (88.5%)
Failed: 5 (8.2%)
Blocked: 2 (3.3%)

Defects by Severity:
- Critical: 1
- High: 2
- Medium: 2
- Low: 0

Test Coverage: 45% (5 of 11 feature areas)
```

## Maintenance

### Updating Test Documents
- Update when features change
- Add new test cases for new features
- Archive obsolete test cases
- Keep test credentials current
- Review quarterly

### Alignment with Automated Tests
- Manual tests complement automated tests
- Focus manual testing on UX and visual aspects
- Use manual tests for exploratory testing
- Automate repetitive manual test cases

## Contributing

### Adding New Test Documents
1. Follow existing document structure
2. Use consistent test case format
3. Include test ID, steps, expected results
4. Provide result tracking tables
5. Update this README with new document

### Test Case Naming Convention
```
TC-[AREA]-[NUMBER]

Examples:
TC-AUTH-001  (Authentication test #1)
TC-DASH-101  (Dashboard test #101)
TC-APPT-201  (Appointment test #201)
```

### Document Naming Convention
```
[NN]-[Feature-Name]-Tests.md

Examples:
02-Authentication-Tests.md
05-Appointment-Management-Tests.md
```

## Resources

### Internal Documentation
- [Project README](../../../README.md)
- [Architecture Documentation](../../architecture/)
- [API Documentation](http://localhost:5000/api-docs)
- [Development Guidelines](../../../.amazonq/rules/memory-bank/guidelines.md)

### External Resources
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [Web Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [Browser Compatibility Testing](https://caniuse.com/)

## Support

### Getting Help
- **Environment Issues**: Contact DevOps team
- **Test Account Issues**: Contact development team
- **Database Issues**: Contact backend team
- **Browser Issues**: Try different browser or update

### Contact Information
- **QA Team**: qa@topsmile.com
- **Development Team**: dev@topsmile.com
- **Project Manager**: pm@topsmile.com

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2024-01-15 | Initial manual testing guide created | QA Team |
| | | - Overview and setup documents | |
| | | - Authentication tests (18 cases) | |
| | | - Dashboard tests (20 cases) | |
| | | - Appointment tests (23 cases) | |
| | | - Issue reporting template | |

## Next Steps

### Immediate (Week 1)
- [ ] Complete remaining test documents (04-11)
- [ ] Execute all test cases in development environment
- [ ] Document initial test results
- [ ] Create GitHub issues for discovered bugs

### Short-term (Month 1)
- [ ] Execute tests in staging environment
- [ ] Perform cross-browser testing
- [ ] Complete mobile/responsive testing
- [ ] Generate test metrics report

### Long-term (Quarter 1)
- [ ] Establish regular testing cadence
- [ ] Integrate with CI/CD pipeline
- [ ] Automate repetitive test cases
- [ ] Train team members on manual testing

## License

This testing documentation is part of the TopSmile project and follows the same license as the main project.

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-15  
**Maintained By**: QA Team  
**Next Review**: 2024-04-15
