const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const { seedAdminUser } = require("./adminSeed");
const { seedCatalog } = require("./catalogSeed");

/**
 * One-shot demo bootstrap:
 *   admin user → partner user → movies → Indian theatres → showtimes
 *
 * Usage (from server/): npm run seed
 */
async function runSeed() {
  const dbURL = process.env.DB_URL;
  if (!dbURL) {
    throw new Error("DB_URL is missing in server/.env");
  }

  await mongoose.connect(dbURL);

  try {
    console.log("\n=== CineVault seed ===\n");

    const adminResult = await seedAdminUser({
      strict: true,
      logger: console,
    });
    console.log("[seed] admin —", adminResult.message);

    const catalogResult = await seedCatalog({
      strict: true,
      logger: console,
    });
    console.log("[seed] catalog —", catalogResult.message);

    console.log("\n=== Seed complete ===");
    console.log("Partner login:", process.env.SEED_PARTNER_EMAIL || "partner@cinevault.dev");
    console.log("Partner password:", process.env.SEED_PARTNER_PASSWORD ? "(from SEED_PARTNER_PASSWORD)" : "partner");
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

runSeed().catch((err) => {
  console.error("seed — failed:", err.message);
  process.exit(1);
});
