# Manual Testing - Issue Reporting Template

## Purpose

This document provides guidelines and templates for reporting issues discovered during manual testing.

## Where to Report Issues

### GitHub Issues
Primary location for bug reports:
```
Repository: topsmile
URL: https://github.com/[organization]/topsmile/issues
```

### Issue Tracking Sheet
For test execution tracking:
```
Location: [Link to shared spreadsheet or project management tool]
```

## Issue Severity Levels

| Severity | Description | Examples | Response Time |
|----------|-------------|----------|---------------|
| 🔴 **Critical** | System unusable, data loss, security vulnerability | Cannot login, data corruption, exposed credentials | Immediate |
| 🟠 **High** | Major feature broken, significant impact | Appointments not saving, payment processing fails | 24 hours |
| 🟡 **Medium** | Feature partially broken, workaround exists | Filter not working, slow performance | 1 week |
| 🟢 **Low** | Minor issue, cosmetic problem | Typo, alignment issue, color inconsistency | 2 weeks |

## Issue Priority Levels

| Priority | Description | When to Use |
|----------|-------------|-------------|
| **P0** | Blocks release | Critical bugs, security issues |
| **P1** | Must fix before release | High severity bugs affecting core features |
| **P2** | Should fix before release | Medium severity bugs, important improvements |
| **P3** | Nice to have | Low severity bugs, minor enhancements |

## Issue Report Template

### GitHub Issue Template

```markdown
## Issue Summary
[Brief one-line description of the issue]

## Severity
[Critical / High / Medium / Low]

## Priority
[P0 / P1 / P2 / P3]

## Test Case Reference
Test ID: TC-XXX-XXX
Document: [Document name]

## Environment
- **Browser**: Brave 1.x.x / Chrome 120.x / Firefox 121.x
- **OS**: Windows 11 / macOS 14 / Linux Ubuntu 22.04
- **Environment**: Development / Staging / Production
- **URL**: http://localhost:3000/[page]
- **Date/Time**: 2024-01-15 14:30 BRT

## User Role
- **Logged in as**: admin@test.topsmile.com (Admin role)
- **Clinic**: Test Clinic 1

## Steps to Reproduce
1. Navigate to [URL or page]
2. Click [button/link]
3. Enter [data] in [field]
4. Click [submit button]
5. Observe [issue]

## Expected Behavior
[What should happen according to requirements or normal functionality]

## Actual Behavior
[What actually happened]

## Screenshots
[Attach screenshots showing the issue]
- Screenshot 1: [Description]
- Screenshot 2: [Description]

## Console Errors
```
[Paste any JavaScript errors from browser console]
```

## Network Errors
```
Request: POST /api/appointments
Status: 500 Internal Server Error
Response: {"success": false, "message": "Erro ao criar agendamento"}
```

## Additional Context
- Issue occurs consistently: Yes / No / Sometimes
- Issue occurs in other browsers: Yes / No / Not tested
- Issue occurs for other users: Yes / No / Not tested
- Related issues: #123, #456

## Possible Cause
[Optional: Your hypothesis about what might be causing the issue]

## Suggested Fix
[Optional: Your suggestion for how to fix the issue]

## Impact
[Describe the impact on users and business]
- Affects: All users / Admin only / Specific feature
- Workaround available: Yes / No
- Data loss risk: Yes / No

## Labels
[Manual Test] [Bug] [Frontend/Backend] [Component Name]
```

## Example Issue Reports

### Example 1: Critical Bug

```markdown
## Issue Summary
Cannot create appointments - 500 error on save

## Severity
Critical

## Priority
P0

## Test Case Reference
Test ID: TC-APPT-001
Document: 05-Appointment-Management-Tests.md

## Environment
- **Browser**: Brave 1.62.153
- **OS**: macOS 14.2
- **Environment**: Development
- **URL**: http://localhost:3000/appointments/new
- **Date/Time**: 2024-01-15 14:30 BRT

## User Role
- **Logged in as**: admin@test.topsmile.com (Admin role)
- **Clinic**: Test Clinic 1

## Steps to Reproduce
1. Navigate to Agendamentos
2. Click "Novo Agendamento"
3. Select patient: João Silva
4. Select provider: Dr. Maria Santos
5. Select date: 2025-10-10
6. Select time: 10:00 AM
7. Click "Agendar"
8. Observe error

## Expected Behavior
- Appointment should be created successfully
- Success message: "Agendamento criado com sucesso"
- Redirect to appointments list
- New appointment visible

## Actual Behavior
- Error message: "Erro ao criar agendamento"
- No redirect occurs
- Appointment not created
- 500 error in Network tab

## Screenshots
![Error Message](screenshots/appt-error-message.png)
![Network Error](screenshots/appt-network-error.png)

## Console Errors
```
Error: Request failed with status code 500
    at createError (createError.js:16)
    at settle (settle.js:17)
```

## Network Errors
```
Request: POST /api/appointments
Status: 500 Internal Server Error
Response: {
  "success": false,
  "message": "Erro ao criar agendamento",
  "error": "Cannot read property 'clinicId' of undefined"
}
```

## Additional Context
- Issue occurs consistently: Yes
- Issue occurs in other browsers: Not tested
- Issue occurs for other users: Yes (tested with staff account)
- Started occurring after recent backend changes

## Possible Cause
Backend not receiving clinicId from authenticated user context

## Suggested Fix
Check authentication middleware and ensure clinicId is properly attached to request

## Impact
- Affects: All users trying to create appointments
- Workaround available: No
- Data loss risk: No (appointments not being created)
- **BLOCKS CORE FUNCTIONALITY**

## Labels
[Manual Test] [Bug] [Backend] [Appointments] [Critical]
```

### Example 2: Medium Severity UI Issue

```markdown
## Issue Summary
Date filter not clearing properly on appointments page

## Severity
Medium

## Priority
P2

## Test Case Reference
Test ID: TC-APPT-102
Document: 05-Appointment-Management-Tests.md

## Environment
- **Browser**: Chrome 120.0.6099.129
- **OS**: Windows 11
- **Environment**: Development
- **URL**: http://localhost:3000/appointments
- **Date/Time**: 2024-01-15 15:45 BRT

## User Role
- **Logged in as**: staff@test.topsmile.com (Staff role)
- **Clinic**: Test Clinic 1

## Steps to Reproduce
1. Navigate to Agendamentos page
2. Select date filter: "Esta Semana"
3. Observe filtered results (works correctly)
4. Click "Limpar Filtros" button
5. Observe that date filter dropdown still shows "Esta Semana"
6. Results do show all appointments (filter is cleared)

## Expected Behavior
- Date filter dropdown should reset to "Todos" or default option
- Visual state should match actual filter state

## Actual Behavior
- Results correctly show all appointments
- But dropdown still displays "Esta Semana"
- Confusing for users

## Screenshots
![Filter State](screenshots/filter-not-cleared.png)

## Console Errors
None

## Network Errors
None

## Additional Context
- Issue occurs consistently: Yes
- Issue occurs in other browsers: Yes (tested in Firefox)
- Workaround available: Yes (manually select "Todos" from dropdown)

## Possible Cause
Clear filter function not resetting dropdown state

## Suggested Fix
Update clearFilters() function to reset dropdown value to default

## Impact
- Affects: All users using date filters
- Workaround available: Yes
- Data loss risk: No
- Minor UX issue, not blocking

## Labels
[Manual Test] [Bug] [Frontend] [Appointments] [UI]
```

### Example 3: Low Severity Cosmetic Issue

```markdown
## Issue Summary
Button text alignment off on mobile view

## Severity
Low

## Priority
P3

## Test Case Reference
Test ID: TC-DASH-401
Document: 03-Staff-Dashboard-Tests.md

## Environment
- **Browser**: Chrome DevTools (iPhone 12 Pro emulation)
- **OS**: macOS 14.2
- **Environment**: Development
- **URL**: http://localhost:3000/dashboard
- **Date/Time**: 2024-01-15 16:00 BRT

## User Role
- **Logged in as**: admin@test.topsmile.com (Admin role)

## Steps to Reproduce
1. Open DevTools (F12)
2. Enable device toolbar (Ctrl+Shift+M)
3. Select iPhone 12 Pro (375px width)
4. Navigate to dashboard
5. Observe "Novo Agendamento" button
6. Notice text slightly off-center

## Expected Behavior
Button text should be perfectly centered

## Actual Behavior
Text appears 2-3px off-center to the left

## Screenshots
![Button Alignment](screenshots/button-alignment-mobile.png)

## Console Errors
None

## Additional Context
- Issue occurs consistently: Yes
- Only on mobile view (< 768px)
- Desktop view is fine

## Possible Cause
Padding or icon spacing issue in mobile CSS

## Impact
- Affects: Mobile users only
- Workaround available: N/A (cosmetic only)
- Data loss risk: No
- Very minor visual issue

## Labels
[Manual Test] [Bug] [Frontend] [UI] [Mobile] [Low Priority]
```

## Issue Naming Conventions

### Format
```
[Component] Brief description of issue
```

### Examples
- `[Auth] Login fails with valid credentials`
- `[Appointments] Cannot reschedule past appointments`
- `[Dashboard] Statistics not updating in real-time`
- `[Patient Portal] Booking form validation not working`
- `[Calendar] Week view not displaying correctly`

## Issue Labels

### Category Labels
- `[Manual Test]` - Issue found during manual testing
- `[Automated Test]` - Issue found by automated tests
- `[Bug]` - Defect in existing functionality
- `[Enhancement]` - Improvement or new feature request
- `[Documentation]` - Documentation issue

### Component Labels
- `[Frontend]` - React/UI issue
- `[Backend]` - Express/API issue
- `[Database]` - MongoDB/data issue
- `[Auth]` - Authentication/authorization
- `[Appointments]` - Appointment management
- `[Patients]` - Patient management
- `[Providers]` - Provider management
- `[Calendar]` - Calendar functionality
- `[Payment]` - Payment processing

### Platform Labels
- `[Desktop]` - Desktop browser issue
- `[Mobile]` - Mobile browser issue
- `[Tablet]` - Tablet browser issue
- `[Cross-Browser]` - Issue in multiple browsers

### Status Labels
- `[Needs Triage]` - Needs review and prioritization
- `[Confirmed]` - Issue confirmed and accepted
- `[In Progress]` - Being worked on
- `[Blocked]` - Blocked by dependency
- `[Fixed]` - Fix implemented, needs verification
- `[Verified]` - Fix verified in testing
- `[Closed]` - Issue resolved

## Attaching Evidence

### Screenshots
1. Use browser screenshot tools or OS screenshot tools
2. Annotate screenshots to highlight issue
3. Name files descriptively: `appointment-save-error-2024-01-15.png`
4. Attach to GitHub issue or upload to shared drive

### Screen Recordings
For complex issues or workflows:
1. Record screen showing issue reproduction
2. Keep videos short (< 2 minutes)
3. Upload to YouTube (unlisted) or shared drive
4. Include link in issue report

### Console Logs
1. Open DevTools Console (F12)
2. Copy all errors (right-click > Save as...)
3. Paste into issue report in code block
4. Include timestamps if relevant

### Network Logs
1. Open DevTools Network tab
2. Filter by XHR/Fetch
3. Right-click failed request > Copy > Copy as cURL
4. Paste into issue report
5. Or export HAR file for complex issues

## Issue Verification

After developer fixes issue:

### Verification Checklist
- [ ] Pull latest code changes
- [ ] Clear browser cache
- [ ] Reproduce original steps
- [ ] Verify issue is fixed
- [ ] Test related functionality
- [ ] Test in multiple browsers (if applicable)
- [ ] Update issue with verification results

### Verification Comment Template
```markdown
## Verification Results

**Tested By**: [Your name]
**Date**: 2024-01-15
**Environment**: Development
**Browser**: Chrome 120.x

**Original Issue**: [Brief description]

**Verification Steps**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Result**: ✅ PASS / ❌ FAIL

**Notes**:
- Issue is resolved
- No regressions observed
- Tested in Chrome and Firefox

**Status**: Ready to close
```

## Communication Guidelines

### When Reporting Issues
- Be objective and factual
- Provide complete reproduction steps
- Include all relevant context
- Attach evidence (screenshots, logs)
- Suggest severity and priority
- Be respectful and professional

### When Discussing Issues
- Ask clarifying questions if needed
- Provide additional information promptly
- Update issue if you discover new information
- Notify team of blocking issues immediately

### Escalation
For critical issues:
1. Create GitHub issue immediately
2. Notify team lead via Slack/email
3. Include "CRITICAL" in message subject
4. Provide clear impact assessment

## Issue Tracking Metrics

Track these metrics for reporting:

| Metric | Description |
|--------|-------------|
| Total Issues Found | Count of all issues reported |
| Issues by Severity | Breakdown by Critical/High/Medium/Low |
| Issues by Component | Breakdown by Frontend/Backend/etc. |
| Open vs Closed | Current status of issues |
| Average Resolution Time | Time from report to fix |
| Reopen Rate | Issues that reoccurred after fix |

## Best Practices

### Do's ✅
- Report issues as soon as discovered
- Provide complete reproduction steps
- Include environment details
- Attach screenshots and logs
- Verify fixes thoroughly
- Update issues with new information

### Don'ts ❌
- Don't report duplicate issues (search first)
- Don't report multiple issues in one ticket
- Don't assume issue is obvious
- Don't skip reproduction steps
- Don't report without evidence
- Don't close issues without verification

## Templates for Common Scenarios

### Cannot Reproduce
```markdown
Attempted to reproduce this issue but was unable to.

**Environment**: Development, Chrome 120.x, macOS 14.2
**Steps Taken**: [List steps from original report]
**Result**: Issue did not occur

**Questions**:
- Does this still occur for you?
- Are there additional steps needed?
- Is this environment-specific?

**Status**: Needs more information
```

### Duplicate Issue
```markdown
This appears to be a duplicate of #[issue number].

**Related Issue**: #123
**Reason**: Same symptoms and root cause

**Recommendation**: Close this issue and track in #123

**Status**: Duplicate
```

### Works as Designed
```markdown
After investigation, this behavior is working as designed.

**Reason**: [Explanation of why this is expected behavior]
**Documentation**: [Link to requirements or design docs]

**Recommendation**: Close as "Works as Designed" or convert to enhancement request

**Status**: Not a bug
```

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-15  
**Maintained By**: QA Team
