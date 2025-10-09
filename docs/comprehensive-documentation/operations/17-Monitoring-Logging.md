# TopSmile Monitoring & Logging

**Version:** 1.0.0 | **Date:** 2024-01-15 | **Status:** ✅ Complete

---

## Logging Architecture

### Log Levels
- **ERROR**: System errors requiring immediate attention
- **WARN**: Warning conditions
- **INFO**: Informational messages
- **DEBUG**: Debug-level messages (development only)

### Current Implementation (Pino)

```typescript
// config/logger.ts
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: { colorize: true }
  } : undefined
});

export default logger;
```

---

## Application Logging

### Structured Logging

```typescript
// Good - structured
logger.info({
  userId: req.user.id,
  action: 'appointment.created',
  appointmentId: appointment.id,
  duration: 30
}, 'Appointment created successfully');

// Bad - unstructured
console.log('User created appointment');
```

### Request Logging

```typescript
// middleware/requestLogger.ts
import pinoHttp from 'pino-http';

app.use(pinoHttp({
  logger,
  customSuccessMessage: (req, res) => `${req.method} ${req.url} completed`,
  customErrorMessage: (req, res, err) => `${req.method} ${req.url} failed`,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  }
}));
```

### Error Logging

```typescript
// Log errors with context
try {
  await appointmentService.create(data);
} catch (error) {
  logger.error({
    error: error.message,
    stack: error.stack,
    userId: req.user.id,
    data: sanitizeLog(data)
  }, 'Failed to create appointment');
  throw error;
}
```

---

## Performance Monitoring

### Response Time Tracking

```typescript
// middleware/performanceMonitoring.ts
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      correlationId: req.correlationId
    }, 'Request completed');
    
    if (duration > 1000) {
      logger.warn({ duration, path: req.path }, 'Slow request detected');
    }
  });
  
  next();
});
```

### Database Query Monitoring

```typescript
// Log slow queries
mongoose.set('debug', (collectionName, method, query, doc) => {
  logger.debug({
    collection: collectionName,
    method,
    query,
    doc
  }, 'MongoDB query');
});
```

---

## Health Monitoring

### Health Check Endpoints

```typescript
// GET /api/health
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:00:00Z",
  "uptime": "120 minutes",
  "database": "connected",
  "redis": "connected"
}

// GET /api/health/detailed
{
  "status": "healthy",
  "services": {
    "database": { "status": "up", "responseTime": "5ms" },
    "redis": { "status": "up", "responseTime": "2ms" },
    "stripe": { "status": "up", "responseTime": "150ms" },
    "sendgrid": { "status": "up", "responseTime": "100ms" }
  },
  "metrics": {
    "memory": { "used": "250MB", "total": "512MB" },
    "cpu": { "usage": "15%" }
  }
}
```

---

## Metrics Collection

### Application Metrics

```typescript
// Track key metrics
const metrics = {
  requests: {
    total: 0,
    success: 0,
    errors: 0
  },
  appointments: {
    created: 0,
    cancelled: 0
  },
  responseTime: {
    avg: 0,
    p95: 0,
    p99: 0
  }
};

// Update metrics
app.use((req, res, next) => {
  metrics.requests.total++;
  res.on('finish', () => {
    if (res.statusCode < 400) {
      metrics.requests.success++;
    } else {
      metrics.requests.errors++;
    }
  });
  next();
});

// Expose metrics endpoint
app.get('/api/metrics', authenticate, authorize('admin'), (req, res) => {
  res.json(metrics);
});
```

---

## Error Tracking

### Error Aggregation

```typescript
// Track error patterns
const errorTracker = {
  errors: new Map(),
  
  track(error: Error, context: any) {
    const key = `${error.name}:${error.message}`;
    const existing = this.errors.get(key) || { count: 0, lastSeen: null, contexts: [] };
    
    existing.count++;
    existing.lastSeen = new Date();
    existing.contexts.push(context);
    
    this.errors.set(key, existing);
    
    // Alert if error occurs frequently
    if (existing.count > 10) {
      this.alert(key, existing);
    }
  },
  
  alert(key: string, data: any) {
    logger.error({ key, data }, 'Frequent error detected');
    // Send to monitoring service
  }
};
```

---

## Alerting

### Alert Configuration

```typescript
// config/alerts.ts
const alerts = {
  errorRate: {
    threshold: 0.05, // 5% error rate
    window: 5 * 60 * 1000, // 5 minutes
    action: 'email'
  },
  responseTime: {
    threshold: 1000, // 1 second
    window: 5 * 60 * 1000,
    action: 'slack'
  },
  databaseConnection: {
    threshold: 1, // 1 failure
    window: 60 * 1000, // 1 minute
    action: 'pagerduty'
  }
};
```

### Alert Channels

```typescript
// Send alerts
async function sendAlert(type: string, message: string, severity: string) {
  switch (type) {
    case 'email':
      await emailService.sendAlert(message);
      break;
    case 'slack':
      await slackService.sendMessage(message);
      break;
    case 'pagerduty':
      await pagerdutyService.createIncident(message, severity);
      break;
  }
}
```

---

## Log Aggregation

### Centralized Logging (ELK Stack)

**Logstash Configuration:**
```ruby
input {
  file {
    path => "/var/log/topsmile/*.log"
    type => "topsmile"
  }
}

filter {
  json {
    source => "message"
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "topsmile-%{+YYYY.MM.dd}"
  }
}
```

---

## Dashboard Setup

### Key Metrics Dashboard

**Metrics to Track:**
- Request rate (requests/minute)
- Error rate (%)
- Response time (p50, p95, p99)
- Database query time
- Active users
- Appointment bookings
- System resources (CPU, memory)

**Grafana Dashboard Example:**
```json
{
  "dashboard": {
    "title": "TopSmile Monitoring",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])"
          }
        ]
      }
    ]
  }
}
```

---

## Audit Logging

### Security Events

```typescript
// Log security-relevant events
const auditLog = {
  userId: req.user.id,
  action: 'LOGIN',
  resource: 'auth',
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  timestamp: new Date(),
  success: true,
  details: {}
};

await AuditLog.create(auditLog);
```

### Compliance Logging

```typescript
// HIPAA-compliant logging
const hipaaLog = {
  userId: req.user.id,
  action: 'MEDICAL_RECORD_ACCESS',
  patientId: req.params.patientId,
  timestamp: new Date(),
  ip: req.ip,
  purpose: 'Treatment'
};

await HIPAALog.create(hipaaLog);
```

---

## Log Retention

### Retention Policy

| Log Type | Retention Period | Storage |
|----------|------------------|---------|
| Application Logs | 30 days | Hot storage |
| Error Logs | 90 days | Hot storage |
| Audit Logs | 7 years | Cold storage |
| Performance Metrics | 1 year | Time-series DB |

### Log Rotation

```bash
# PM2 log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

---

## Monitoring Tools

### Recommended Tools

**APM (Application Performance Monitoring):**
- New Relic
- DataDog
- Dynatrace

**Error Tracking:**
- Sentry
- Rollbar
- Bugsnag

**Log Management:**
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Splunk
- CloudWatch Logs

**Uptime Monitoring:**
- Pingdom
- UptimeRobot
- StatusCake

---

## Improvement Recommendations

### 🟥 Critical

1. **Implement Centralized Logging** - ELK or CloudWatch (1 week)
2. **Add Error Tracking Service** - Sentry integration (2 days)
3. **Set Up Alerting** - Critical error notifications (3 days)

### 🟧 High Priority

4. **Implement APM** - New Relic or DataDog (1 week)
5. **Add Custom Dashboards** - Grafana setup (1 week)
6. **Implement Distributed Tracing** - OpenTelemetry (2 weeks)

### 🟨 Medium Priority

7. **Add User Session Recording** - LogRocket/FullStory (1 week)
8. **Implement Synthetic Monitoring** - Automated tests (1 week)

---

**Related:** [16-Deployment-Guide.md](./16-Deployment-Guide.md), [18-Comprehensive-Improvement-Report.md](../improvements/18-Comprehensive-Improvement-Report.md)
