const path = require("path");

if (require.main === module) {
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
}

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

/**
 * Idempotent admin user provisioning.
 *
 * CLI: `npm run seed:admin` (from server directory).
 * Optional opt-in on server start: AUTO_SEED_ADMIN=true (see server.js).
 *
 * @param {object} options
 * @param {Console} [options.logger=console]
 * @param {boolean} [options.strict=true] — if true, missing password/config throws (CLI). If false, skips with reason (runtime).
 * @returns {Promise<{ ok: boolean, status: 'created'|'skipped'|'error', message: string }>}
 */
async function seedAdminUser(options = {}) {
  const { logger = console, strict = true } = options;
  const dbURL = process.env.DB_URL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@cinevault.dev")
    .toLowerCase()
    .trim();
  const name = process.env.SEED_ADMIN_NAME || "Admin";

  const skipWithReason = (message) => {
    logger.warn?.("[admin-seed]", message);
    return { ok: true, status: "skipped", message };
  };

  if (!dbURL) {
    const msg = "DB_URL is missing.";
    if (strict) throw new Error(`seed:admin — ${msg}`);
    return skipWithReason(msg + " Skipping admin seed.");
  }

  if (!password) {
    const msg =
      "SEED_ADMIN_PASSWORD is missing (required when provisioning admin).";
    if (strict) throw new Error(`seed:admin — ${msg}`);
    return skipWithReason(msg + " Skipping admin seed.");
  }

  let ownsConnection = false;
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(dbURL);
      ownsConnection = true;
    }

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      logger.info?.(
        "[admin-seed] skipped — admin already exists:",
        existingAdmin.email
      );
      return {
        ok: true,
        status: "skipped",
        message: `Admin already exists (${existingAdmin.email}).`,
      };
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      logger.info?.(
        "[admin-seed] skipped — seed email already registered:",
        email
      );
      return {
        ok: true,
        status: "skipped",
        message: `Email ${email} already registered.`,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      isAdmin: true,
    });

    logger.info?.("[admin-seed] created admin user:", email);
    return {
      ok: true,
      status: "created",
      message: `Admin user ${email} created.`,
    };
  } finally {
    if (ownsConnection) {
      await mongoose.disconnect().catch(() => {});
    }
  }
}

module.exports = { seedAdminUser };

if (require.main === module) {
  (async () => {
    try {
      const result = await seedAdminUser({ strict: true });
      if (!result.ok) {
        console.error("seed:admin —", result.message);
        process.exit(1);
      }
      console.log("seed:admin —", result.message);
    } catch (err) {
      console.error("seed:admin — failed:", err.message);
      await mongoose.disconnect().catch(() => {});
      process.exit(1);
    }
    process.exit(0);
  })();
}
