// backend/src/app.ts - FIXED VERSION with Critical Configuration Improvements
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import type { Contact as ContactType, Patient } from "@topsmile/types";

import cookieParser from "cookie-parser";

// Database imports
import { connectToDatabase } from "./config/database";
import { contactService } from "./services/contactService";
import {
  checkDatabaseConnection,
  handleValidationError,
} from "./middleware/database";
import { Contact } from "./models/Contact";

// Authentication imports
import {
  authenticate,
  authorize,
  AuthenticatedRequest,
} from "./middleware/auth";
import { v4 as uuidv4 } from "uuid";
// Route groups
import authRoutes from "./routes/auth";
import clinicalRoutes from "./routes/clinical";
import schedulingRoutes from "./routes/scheduling";
import patientRoutes from "./routes/patient";
import patientAuthRoutes from "./routes/patient/patientAuth";
import securityRoutes from "./routes/security";
import providersRoutes from "./routes/providers";
import appointmentTypesRoutes from "./routes/appointmentTypes";
import formsRoutes from "./routes/forms";
import docsRoutes from "./routes/docs";
import permissionsRoutes from "./routes/permissions";
import roleManagementRoutes from "./routes/roleManagement";
import consentFormsRoutes from "./routes/consentForms";
import contactRoutes from "./routes/contact";
import adminRoutes from "./routes/admin";
import analyticsRoutes from "./routes/analytics";

// Error handling
import { errorHandler } from "./middleware/errorHandler";

// CSRF protection for state-changing operations
import { csrfProtection, mongoSanitization } from "./middleware/security";
// IMPROVED: Trust proxy configuration for production deployments
import logger from "./config/logger";
import pinoHttp from "pino-http";

import { responseWrapper } from "./middleware/normalizeResponse";
import { auditLogger } from './middleware/auditLogger';


dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 5000;

/**
 * IMPROVED: Comprehensive environment variable validation
 */
const validateEnv = () => {
  const requiredInProd = [
    {
      name: "JWT_SECRET",
      message: "JWT_SECRET is required in production",
      validate: (value: string) =>
        value && value !== "your-secret-key" && value.length >= 64, // 32 bytes in hex is 64 chars
      errorMsg:
        "JWT_SECRET must be at least 64 characters long (32-byte hex string) and not use default value",
    },
    {
      name: "DATABASE_URL",
      message: "DATABASE_URL is required in production",
      validate: (value: string) =>
        value &&
        (value.startsWith("mongodb://") || value.startsWith("mongodb+srv://")),
      errorMsg: "DATABASE_URL must be a valid MongoDB connection string",
    },
    {
      name: "SENDGRID_API_KEY",
      message:
        "SENDGRID_API_KEY is required in production for email functionality",
      validate: (value: string) => value && value.startsWith("SG."),
      errorMsg: "SENDGRID_API_KEY must be a valid SendGrid API key",
    },
    {
      name: "ADMIN_EMAIL",
      message: "ADMIN_EMAIL is required in production",
      validate: (value: string) =>
        value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      errorMsg: "ADMIN_EMAIL must be a valid email address",
    },
    {
      name: "FRONTEND_URL",
      message: "FRONTEND_URL is required in production for CORS",
      validate: (value: string) => value && /^https?:\/\/.+/.test(value),
      errorMsg:
        "FRONTEND_URL must be a valid URL starting with http:// or https://",
    },
  ];

  const recommendedInProd = [
    "JWT_REFRESH_SECRET",
    "REDIS_URL",
    "DATABASE_NAME",
    "FROM_EMAIL",
    "ACCESS_TOKEN_EXPIRES",
    "REFRESH_TOKEN_EXPIRES_DAYS",
  ];

  if (process.env.NODE_ENV === "production") {
    const errors: string[] = [];

    // Check required variables
    for (const envVar of requiredInProd) {
      const value = process.env[envVar.name];
      if (!value) {
        errors.push(`Missing required environment variable: ${envVar.name}`);
      } else if (envVar.validate && !envVar.validate(value)) {
        errors.push(`Invalid ${envVar.name}: ${envVar.errorMsg}`);
      }
    }

    if (errors.length > 0) {
      console.error("Environment Configuration Errors:");
      errors.forEach((error) => console.error(`- ${error}`));
      process.exit(1);
    }

    // Check recommended variables
    const missingRecommended = recommendedInProd.filter(
      (name) => !process.env[name]
    );
    if (missingRecommended.length > 0) {
      console.warn("Missing recommended environment variables:");
      missingRecommended.forEach((name) => console.warn(`- ${name}`));
    }
  } else {
    // Development environment - require critical variables
    const errors: string[] = [];
    const warnings: string[] = [];

    // Critical in all environments
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 64) {
      errors.push("JWT_SECRET must be at least 64 characters");
    }
    if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET.length < 64) {
      errors.push("JWT_REFRESH_SECRET must be at least 64 characters");
    }
    if (!process.env.PATIENT_JWT_SECRET || process.env.PATIENT_JWT_SECRET.length < 64) {
      errors.push("PATIENT_JWT_SECRET must be at least 64 characters");
    }
    if (!process.env.DATABASE_URL) {
      errors.push("DATABASE_URL is required");
    }
    if (!process.env.FRONTEND_URL) {
      errors.push("FRONTEND_URL is required for CORS");
    }

    if (errors.length > 0) {
      console.error("Development Environment Errors:");
      errors.forEach((error) => console.error(`- ${error}`));
      process.exit(1);
    }

    // Warnings for optional services
    if (!process.env.SENDGRID_API_KEY) {
      warnings.push("SENDGRID_API_KEY not set, email functionality will use Ethereal");
    }

    if (warnings.length > 0) {
      console.warn("Development Environment Warnings:");
      warnings.forEach((warning) => console.warn(`- ${warning}`));
    }
  }
};

validateEnv();

const httpLogger = pinoHttp({ 
  logger,
  customSuccessMessage: (req, res) => `${req.method} ${req.url} completed`,
  customErrorMessage: (req, res, err) => `${req.method} ${req.url} failed`,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  }
});

// ...

if (process.env.NODE_ENV !== 'test') {
  app.use(httpLogger);
}

// ...

const configureProxy = () => {
  if (
    process.env.TRUST_PROXY === "1" ||
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL ||
    process.env.HEROKU ||
    process.env.AWS_REGION
  ) {
    app.set("trust proxy", 1);
    console.log("✅ Proxy trust enabled for production environment");
  }
};

configureProxy();

// IMPROVED: Enhanced security middleware configuration
const configureSecurityMiddleware = () => {
  // Enhanced helmet configuration
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for development - REMOVE IN PRODUCTION
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false, // Disable for API compatibility
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
    })
  );

  // IMPROVED: Multiple origin CORS configuration
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    process.env.ADMIN_URL,
    process.env.MOBILE_URL,
    // Development origins
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    // Vercel preview deployments
    /\.vercel\.app$/,
    // Netlify deployments
    /\.netlify\.app$/,
  ].filter(Boolean); // Remove undefined values

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        // Check if origin is in allowed list
        const isAllowed = allowedOrigins.some((allowedOrigin) => {
          if (typeof allowedOrigin === "string") {
            return origin === allowedOrigin;
          } else if (allowedOrigin instanceof RegExp) {
            return allowedOrigin.test(origin);
          }
          return false;
        });

        if (isAllowed) {
          callback(null, true);
        } else {
          console.warn(`CORS blocked origin: ${origin}`);
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      optionsSuccessStatus: 200, // Support legacy browsers
      maxAge: 86400, // 24 hours preflight cache
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
        "X-Device-ID",
        "X-Patient-ID",
        "X-CSRF-Token",
        "x-correlation-id",
        "x-client-version",
      ],
    })
  );
};

configureSecurityMiddleware();

// Connect to database
connectToDatabase();

// IMPROVED: Tiered rate limiting strategy
const createRateLimit = (windowMs: number, max: number, message: string) =>
  rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      console.warn(
        `Rate limit exceeded for IP ${req.ip}: ${req.method} ${req.path}`
      );
      res.status(429).json({ success: false, message });
    },
  });

// Specific rate limiters
const contactLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 contact form submissions
  "Muitos formulários enviados. Tente novamente em 15 minutos."
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 10 : 100, // 10 in prod, 100 in dev
  message: {
    success: false,
    message:
      "Muitas tentativas de autenticação. Tente novamente em 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    // Use email from request body if available, otherwise use IP
    const email = req.body?.email;
    return email ? `auth_${email}` : `auth_ip_${req.ip}`;
  },
  handler: (req, res) => {
    console.warn(`Auth rate limit exceeded for ${req.body?.email || req.ip}`);
    res.status(429).json({
      success: false,
      message:
        "Muitas tentativas de autenticação. Tente novamente em 15 minutos.",
    });
  },
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset requests per hour per user/IP
  message: {
    success: false,
    message:
      "Muitas solicitações de redefinição de senha. Tente novamente em 1 hora.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    // Use user ID if authenticated, otherwise use IP address
    const authReq = req as AuthenticatedRequest;
    return authReq.user?.id || req.ip || "unknown";
  },
  handler: (req, res) => {
    const authReq = req as AuthenticatedRequest;
    console.warn(
      `Rate limit exceeded for password reset for user/IP ${
        authReq.user?.id || req.ip
      }`
    );
    res
      .status(429)
      .json({
        success: false,
        message:
          "Muitas solicitações de redefinição de senha. Tente novamente em 1 hora.",
      });
  },
});

const apiLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  process.env.NODE_ENV === "production" ? 100 : 1000, // Lower limit in production
  "Muitas requisições. Tente novamente em 15 minutos."
);

// Apply rate limiting
app.use("/api/contact", contactLimiter);
app.use("/api/auth", authLimiter);
app.use("/api/auth/forgot-password", passwordResetLimiter);
app.use("/api/auth/reset-password", passwordResetLimiter);
app.use("/api", apiLimiter);

// ADDED: Request ID tracking middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).requestId = uuidv4(); // Generate a unique request ID
  res.setHeader("X-Request-ID", (req as any).requestId); // Add to response headers
  next();
});

// IMPROVED: Body parser with security limits
app.use(
  express.json({
    limit: "10mb",
    strict: true,
    type: "application/json",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
    parameterLimit: 100, // Prevent parameter pollution
  })
);
app.use(cookieParser());

// Apply MongoDB sanitization to all requests
app.use(mongoSanitization);

// CSRF token endpoint
app.get("/api/csrf-token", (req: any, res: any, next: any) => {
  csrfProtection(req, res, (err: any) => {
    if (err) return next(err);
    res.json({ csrfToken: (req as any).csrfToken() });
  });
});

// CSRF protection for all state-changing operations
app.use("/api", (req: any, res: any, next: any) => {
  // Skip CSRF for GET, HEAD, OPTIONS
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }
  
  // Skip CSRF for specific endpoints
  const skipPaths = [
    "/api/auth/refresh",
    "/api/auth/logout",
    "/api/patient-auth/refresh",
    "/api/patient-auth/logout",
    "/api/csrf-token"
  ];
  
  if (skipPaths.includes(req.path)) {
    return next();
  }
  
  // Apply CSRF protection
  csrfProtection(req, res, next);
});

// Database connection check middleware for API routes (after CSRF)
app.use("/api", checkDatabaseConnection);

// ... (other imports)

// ... (other middleware)

// Apply the response wrapper middleware
app.use(responseWrapper);

// Apply audit logging middleware (after auth, before routes)
app.use('/api', auditLogger);

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/patient-auth", patientAuthRoutes);
app.use("/api/clinical", authenticate, clinicalRoutes);
app.use("/api/scheduling", authenticate, schedulingRoutes);
app.use("/api/patients", authenticate, patientRoutes);
app.use("/api/security", authenticate, securityRoutes);
app.use("/api/providers", providersRoutes);
app.use("/api/appointment-types", appointmentTypesRoutes);
app.use("/api/forms", formsRoutes);
app.use("/api/docs", docsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/permissions", permissionsRoutes);
app.use("/api/role-management", roleManagementRoutes);
app.use("/api/consent-forms", consentFormsRoutes);
app.use("/api/analytics", analyticsRoutes);

// IMPROVED: Enhanced health check endpoints
app.get("/api/health", (req: any, res: any) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  return res.status(200).json({
    success: true,
    message: "TopSmile API is running",
    data: {
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptime / 60)} minutes`,
      database: {
        status: dbStatus,
        name: mongoose.connection.name || "Not connected",
      },
      memory: {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      },
      environment: process.env.NODE_ENV || "development",
      version: "1.2.0",
      nodeVersion: process.version,
    },
  });
});

// IMPROVED: Comprehensive database health check
app.get("/api/health/database", async (req: any, res: any) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    if (dbState === 1) {
      // Test database with multiple collection checks
      const startTime = Date.now();

      const [contactCount, dbStats] = await Promise.all([
        Contact.countDocuments(), // FIXED: Uses imported Contact model
        (mongoose.connection.db as any).admin().serverStatus(),
      ]);

      const queryTime = Date.now() - startTime;

      return res.json({
        success: true,
        data: {
          database: {
            status: states[dbState as keyof typeof states],
            name: mongoose.connection.name,
            host: mongoose.connection.host,
            port: mongoose.connection.port,
            queryTime: `${queryTime}ms`,
          },
          collections: {
            contacts: contactCount,
          },
          server: {
            version: dbStats.version,
            uptime: Math.floor(dbStats.uptime / 60), // minutes
            connections: dbStats.connections?.current || 0,
          },
        },
      });
    } else {
      return res.status(503).json({
        success: false,
        data: {
          database: {
            status: states[dbState as keyof typeof states],
            message: "Database not connected",
          },
        },
      });
    }
  } catch (error) {
    console.error("Database health check failed:", error);
    return res.status(503).json({
      success: false,
      message: "Database health check failed",
      data: {
        error:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : "Internal database error",
      },
    });
  }
});

// IMPROVED: System metrics endpoint (admin only)
app.get(
  "/api/health/metrics",
  authenticate,
  authorize("super_admin", "admin"),
  async (req: any, res: any) => {
    try {
      const memoryUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();

      return res.json({
        success: true,
        data: {
          system: {
            uptime: process.uptime(),
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
          },
          memory: {
            rss: Math.round(memoryUsage.rss / 1024 / 1024),
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            external: Math.round(memoryUsage.external / 1024 / 1024),
          },
          cpu: {
            user: cpuUsage.user,
            system: cpuUsage.system,
          },
          environment: {
            nodeEnv: process.env.NODE_ENV,
            port: process.env.PORT,
            databaseConfigured: !!process.env.DATABASE_URL,
            emailConfigured: !!process.env.SENDGRID_API_KEY,
          },
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve system metrics",
      });
    }
  }
);

// Error handling middleware
app.use(errorHandler);

// IMPROVED: 404 handler with request logging
app.use("*", (req, res) => {
  console.warn(
    `404 Not Found: ${req.method} ${req.originalUrl} from ${req.ip}`
  );

  return res.status(404).json({
    success: false,
    message: "Endpoint não encontrado",
    path: req.originalUrl,
  });
});

// IMPROVED: Global process handlers with better error management
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // In production, you might want to log this to an external service
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Log to external service in production

  // Graceful shutdown
  if (process.env.NODE_ENV === "production") {
    console.log("Shutting down due to uncaught exception");
    process.exit(1);
  }
});

// IMPROVED: Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

// Start server with improved logging
app.listen(PORT, () => {
  console.log("🚀 ===================================");
  console.log(`🚀 TopSmile API running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`
  );
  console.log(
    `🔐 JWT Secret: ${
      process.env.JWT_SECRET ? "Configured ✅" : "Using default ⚠️"
    }`
  );
  console.log(
    `📧 Email Service: ${
      process.env.SENDGRID_API_KEY ? "SendGrid ✅" : "Ethereal/Console ⚠️"
    }`
  );
  console.log(
    `🗄️  Database: ${
      mongoose.connection.readyState === 1 ? "Connected ✅" : "Connecting... ⏳"
    }`
  );
  console.log("🚀 ===================================");
});

export default app;
