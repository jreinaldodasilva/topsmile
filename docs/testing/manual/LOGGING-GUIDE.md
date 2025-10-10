# Manual Testing - Logging Guide

## Overview

This guide explains how to capture and review logs during manual testing so Amazon Q can analyze them without requiring copy/paste.

---

## Setup (One-Time)

### 1. Stop Current Servers

Press `Ctrl+C` in both terminal windows to stop the current servers.

### 2. Start Backend with Logging

**Terminal 1:**
```bash
cd /home/rebelde/Development/topsmile/backend
./start-with-logging.sh
```

### 3. Start Frontend with Logging

**Terminal 2:**
```bash
cd /home/rebelde/Development/topsmile
./start-frontend-with-logging.sh
```

---

## Log File Locations

**Backend logs:**
```
/home/rebelde/Development/topsmile/backend/logs/manual-test-YYYYMMDD_HHMMSS.log
```

**Frontend logs:**
```
/home/rebelde/Development/topsmile/logs/frontend-test-YYYYMMDD_HHMMSS.log
```

---

## During Testing

### What Gets Logged Automatically

**Backend:**
- ✅ HTTP requests (GET, POST, PUT, DELETE)
- ✅ Request IDs (X-Request-ID header)
- ✅ Response status codes (200, 401, 500, etc.)
- ✅ Authentication attempts
- ✅ Database operations
- ✅ Errors and stack traces
- ✅ Rate limiting events
- ✅ CSRF protection events

**Frontend:**
- ✅ Compilation warnings/errors
- ✅ Build status
- ✅ Hot reload events
- ✅ Module errors

**Browser Console (manual capture):**
- ❌ Not automatically logged (use F12 to view)
- Copy important errors/warnings manually

---

## After Testing Session

### Request Log Review

Simply tell Amazon Q:
> "Review the latest backend logs"

Amazon Q will run:
```bash
cat /home/rebelde/Development/topsmile/backend/logs/manual-test-*.log
```

### Specific Searches

**Find all errors:**
```bash
grep -i "error" backend/logs/manual-test-*.log
```

**Find authentication attempts:**
```bash
grep "POST /api/auth/login" backend/logs/manual-test-*.log
```

**Find 401 errors:**
```bash
grep "401" backend/logs/manual-test-*.log
```

**Find specific request by ID:**
```bash
grep "1760096166184-fv6k8cw6u" backend/logs/manual-test-*.log
```

---

## Log Analysis Workflow

### 1. Perform Test Action
- Login, create appointment, etc.
- Note what you did and when

### 2. Request Log Review
Tell Amazon Q:
> "Review backend logs for the last 5 minutes"
> 
> or
> 
> "Check logs for login attempts"

### 3. Amazon Q Analyzes
- Reads log file
- Identifies issues
- Checks for:
  - ✅ Proper status codes
  - ✅ Portuguese error messages
  - ✅ Request ID tracking
  - ✅ Error handling
  - ✅ Security events

### 4. Document Findings
Amazon Q will:
- Identify issues
- Suggest fixes
- Create GitHub issues if needed
- Update test status

---

## Common Log Patterns

### Successful Login
```
POST /api/auth/login 200 OK
X-Request-ID: 1760096166184-fv6k8cw6u
```

### Failed Login (Wrong Password)
```
POST /api/auth/login 401 Unauthorized
Error: Invalid credentials
```

### Rate Limiting
```
POST /api/auth/login 429 Too Many Requests
Auth rate limit exceeded for user@example.com
```

### CSRF Protection
```
POST /api/appointments 403 Forbidden
CSRF token validation failed
```

### Database Error
```
GET /api/patients 500 Internal Server Error
Error: Database connection failed
```

---

## Tips for Effective Logging

### 1. Clear Test Sessions
Start fresh logs for each major test session:
```bash
# Stop servers (Ctrl+C)
# Restart with logging scripts
```

### 2. Note Timestamps
When you encounter an issue, note the time:
> "At 14:30, login failed with error message"

### 3. Test One Feature at a Time
- Login → Review logs
- Appointments → Review logs
- Easier to identify issues

### 4. Keep Browser Console Open
Press F12 and monitor Console tab for frontend errors

---

## Viewing Logs in Real-Time

### Option 1: Follow Backend Logs (New Terminal)
```bash
tail -f /home/rebelde/Development/topsmile/backend/logs/manual-test-*.log
```

### Option 2: Follow Frontend Logs (New Terminal)
```bash
tail -f /home/rebelde/Development/topsmile/logs/frontend-test-*.log
```

### Option 3: Follow Both (Split Terminal)
```bash
# Terminal 3
tail -f backend/logs/manual-test-*.log

# Terminal 4
tail -f logs/frontend-test-*.log
```

---

## Log Cleanup

### View All Logs
```bash
ls -lh backend/logs/
ls -lh logs/
```

### Remove Old Logs (7+ days)
```bash
find backend/logs/ -name "*.log" -mtime +7 -delete
find logs/ -name "*.log" -mtime +7 -delete
```

### Remove All Logs
```bash
rm backend/logs/*.log
rm logs/*.log
```

---

## Troubleshooting

### Script Not Found
```bash
# Make scripts executable
chmod +x backend/start-with-logging.sh
chmod +x start-frontend-with-logging.sh
```

### Logs Directory Not Created
```bash
# Create manually
mkdir -p backend/logs
mkdir -p logs
```

### Permission Denied
```bash
# Fix permissions
chmod 755 backend/logs
chmod 755 logs
```

---

## Integration with Manual Testing

### Before Each Test Document
1. Start servers with logging
2. Note log file names
3. Perform tests
4. Request log review
5. Document findings

### Test Result Format
```markdown
## Test: Staff Login (TC-AUTH-001)

**Time**: 14:30:25
**Log File**: manual-test-20250110_143022.log
**Result**: ❌ Fail

**Issue**: Login returns 500 error
**Request ID**: 1760096166184-fv6k8cw6u

**Amazon Q Analysis**: [Link to analysis]
```

---

## Quick Reference

**Start backend with logging:**
```bash
cd backend && ./start-with-logging.sh
```

**Start frontend with logging:**
```bash
./start-frontend-with-logging.sh
```

**Review latest backend logs:**
```bash
cat backend/logs/manual-test-*.log | tail -100
```

**Search for errors:**
```bash
grep -i error backend/logs/manual-test-*.log
```

**Request Amazon Q review:**
> "Review the latest backend logs"

---

**Created**: 2025-01-10  
**Version**: 1.0  
**Status**: ✅ Ready to Use
