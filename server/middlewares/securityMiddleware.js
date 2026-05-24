const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

function parseAllowedOrigins() {
  const raw = process.env.CLIENT_URL || process.env.CORS_ORIGIN || "";
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const corsMiddleware = cors({
  origin(origin, callback) {
    const allowedOrigins = parseAllowedOrigins();

    // Same-origin or non-browser clients (no Origin header)
    if (!origin || allowedOrigins.length === 0) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

function applySecurityMiddleware(app) {
  app.use(helmet());
  app.use(corsMiddleware);
  app.use(apiRateLimiter);
}

function applyBodySanitization(app) {
  app.use(
    mongoSanitize({
      replaceWith: "_",
    }),
  );
}

module.exports = {
  applySecurityMiddleware,
  applyBodySanitization,
  authRateLimiter,
};
