const express = require("express");
const app = express();

require("dotenv").config(); // Load environment variables

const connectDB = require("./config/db"); // Import database configuration
const {
  applySecurityMiddleware,
  applyBodySanitization,
  authRateLimiter,
} = require("./middlewares/securityMiddleware");
const userRouter = require("./routes/userRoutes"); // Import user routes
const movieRouter = require("./routes/movieRoutes");
const theatreRouter = require("./routes/theatreRoutes");
const showRouter = require("./routes/showRoutes");
const bookingRouter = require("./routes/bookingRoutes");

console.log("server", process.env.DB_URL);

applySecurityMiddleware(app);

/** Routes */
app.use(express.json());
applyBodySanitization(app);
app.use("/api/users", authRateLimiter, userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/theatres", theatreRouter);
app.use("/api/shows", showRouter);
app.use("/api/booking", bookingRouter);

/**
 * Bootstrap: connect DB before accepting traffic.
 * Admin seed on startup is OFF by default (run `npm run seed:admin` or CI instead).
 * Opt-in only for local/Docker: AUTO_SEED_ADMIN=true + SEED_ADMIN_PASSWORD set.
 */
async function start() {
  await connectDB();

  if (process.env.AUTO_SEED_ADMIN === "true") {
    const { seedAdminUser } = require("./seeding/adminSeed");
    await seedAdminUser({ strict: false });
  }

  const port = Number(process.env.PORT) || 3001;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

start().catch((err) => {
  console.error("Server startup failed:", err.message);
  process.exit(1);
});
