# Backend Logging Setup for Manual Testing

## Quick Start

Instead of running `npm run dev` directly, use the logging script:

```bash
cd /home/rebelde/Development/topsmile/backend
./start-with-logging.sh
```

This will:
- ✅ Create a `logs/` directory
- ✅ Generate a timestamped log file (e.g., `logs/manual-test-20250110_143022.log`)
- ✅ Display output in terminal (as usual)
- ✅ Save all output to the log file

## Log File Location

All logs are saved in: `/home/rebelde/Development/topsmile/backend/logs/`

Format: `manual-test-YYYYMMDD_HHMMSS.log`

## Viewing Logs

**Latest log file:**
```bash
ls -lt logs/ | head -2
```

**Read log file:**
```bash
cat logs/manual-test-*.log
```

**Follow log in real-time (in another terminal):**
```bash
tail -f logs/manual-test-*.log
```

**Search for errors:**
```bash
grep -i error logs/manual-test-*.log
```

**Search for specific request:**
```bash
grep "POST /api/auth/login" logs/manual-test-*.log
```

## What Gets Logged

- ✅ Server startup messages
- ✅ All HTTP requests (method, URL, status code)
- ✅ Request IDs (X-Request-ID)
- ✅ Authentication attempts
- ✅ Database queries
- ✅ Errors and warnings
- ✅ Rate limiting events
- ✅ CORS issues

## For Amazon Q Review

After testing, I can read the log files directly:
```bash
cat /home/rebelde/Development/topsmile/backend/logs/manual-test-*.log
```

## Stopping the Server

Press `Ctrl+C` in the terminal running the script.

The log file will remain in the `logs/` directory for review.

## Cleanup Old Logs

```bash
# Remove logs older than 7 days
find logs/ -name "*.log" -mtime +7 -delete
```
