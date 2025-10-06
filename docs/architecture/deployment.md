# Deployment Architecture

## Production Environment

```
                    ┌─────────────┐
                    │   Users     │
                    └──────┬──────┘
                           │ HTTPS
                    ┌──────▼──────┐
                    │     CDN     │
                    │  (Frontend) │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Load Balancer│
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌─────▼────┐      ┌─────▼────┐
   │ API     │       │ API      │      │ API      │
   │ Server 1│       │ Server 2 │      │ Server 3 │
   └────┬────┘       └─────┬────┘      └─────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌─────▼────┐      ┌─────▼────┐
   │ MongoDB │       │  Redis   │      │ External │
   │ Cluster │       │  Cluster │      │ Services │
   └─────────┘       └──────────┘      └──────────┘
```

## Components

**CDN:** Static frontend assets  
**Load Balancer:** Nginx/AWS ALB  
**API Servers:** Node.js (PM2)  
**MongoDB:** Replica set (3 nodes)  
**Redis:** Cluster mode  
**External:** Stripe, Twilio, SMTP
