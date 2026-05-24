const path = require("path");

if (require.main === module) {
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
}

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Movie = require("../models/movieModel");
const Theatre = require("../models/theatreModel");
const Show = require("../models/showModel");
const {
  INDIAN_THEATRES,
  SEED_MOVIES,
  SHOW_SLOTS,
} = require("./demoCatalogData");

const SHOW_DAYS_AHEAD = 7;
const MOVIES_PER_THEATRE = 8;

function toMovieDoc(entry) {
  return {
    movieName: entry.movieName,
    description:
      entry.description ||
      `${entry.movieName} — now showing at CineVault partner theatres across India.`,
    duration: entry.duration || 120,
    genre: entry.genre,
    language: entry.language,
    releaseDate: new Date(entry.releaseDate || "2024-01-01"),
    poster: entry.poster,
  };
}

function loadMovieCatalog(logger) {
  const movies = SEED_MOVIES.map(toMovieDoc);
  logger.info?.(`[catalog-seed] Loaded ${movies.length} movies.`);
  return movies;
}

function upcomingShowDates(count) {
  const dates = [];
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();

  for (let i = 0; i < count; i++) {
    dates.push(new Date(Date.UTC(y, m, d + i)));
  }
  return dates;
}

function cityPriceBoost(city) {
  if (city === "Mumbai" || city === "Delhi") return 40;
  if (city === "Bengaluru" || city === "Hyderabad") return 25;
  return 0;
}

async function seedPartnerUser(logger) {
  const email = (process.env.SEED_PARTNER_EMAIL || "partner@cinevault.dev")
    .toLowerCase()
    .trim();
  const password = process.env.SEED_PARTNER_PASSWORD || "partner";
  const name = process.env.SEED_PARTNER_NAME || "Demo Partner";

  let partner = await User.findOne({ email });
  if (partner) {
    logger.info?.("[catalog-seed] partner user exists:", email);
    return partner;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  partner = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "partner",
    isAdmin: false,
  });

  logger.info?.("[catalog-seed] created partner user:", email);
  return partner;
}

async function seedMovies(logger) {
  const catalog = loadMovieCatalog(logger);
  let created = 0;

  for (const doc of catalog) {
    const found = await Movie.findOne({ movieName: doc.movieName });
    if (found) {
      await Movie.findByIdAndUpdate(found._id, doc);
      continue;
    }
    await Movie.create(doc);
    created++;
  }

  logger.info?.(
    `[catalog-seed] movies ready — ${created} new, ${catalog.length} in catalog.`,
  );
  return { created, movies: await Movie.find() };
}

async function seedTheatres(logger, partnerId) {
  const theatres = [];
  for (const row of INDIAN_THEATRES) {
    let theatre = await Theatre.findOne({ name: row.name });
    if (!theatre) {
      theatre = await Theatre.create({
        name: row.name,
        address: row.address,
        phone: row.phone,
        email: row.email,
        owner: partnerId,
        isActive: true,
      });
      logger.info?.("[catalog-seed] created theatre:", row.name);
    } else if (!theatre.isActive || !theatre.owner) {
      theatre.isActive = true;
      theatre.owner = theatre.owner || partnerId;
      await theatre.save();
    }
    theatres.push(theatre);
  }

  return theatres;
}

async function seedShows(logger, movies, theatres, force) {
  const existing = await Show.countDocuments();

  if (force && existing > 0) {
    await Show.deleteMany({});
    logger.info?.("[catalog-seed] cleared existing shows (SEED_FORCE).");
  }

  const dates = upcomingShowDates(SHOW_DAYS_AHEAD);
  let created = 0;

  for (let tIdx = 0; tIdx < theatres.length; tIdx++) {
    const theatre = theatres[tIdx];
    const cityBoost =
      cityPriceBoost(INDIAN_THEATRES[tIdx]?.city) ||
      cityPriceBoost(theatre.address);

    const theatreMovies = Array.from({ length: MOVIES_PER_THEATRE }, (_, i) => {
      return movies[(tIdx * 2 + i) % movies.length];
    });

    for (const movie of theatreMovies) {
      for (const date of dates) {
        for (const slot of SHOW_SLOTS.slice(0, 3)) {
          const exists = await Show.findOne({
            theatre: theatre._id,
            movie: movie._id,
            date,
            time: slot.time,
          });
          if (exists) continue;

          await Show.create({
            name: slot.name,
            date,
            time: slot.time,
            movie: movie._id,
            theatre: theatre._id,
            ticketPrice: slot.ticketPrice + cityBoost,
            totalSeats: 150 + (tIdx % 4) * 30,
            bookedSeats: [],
          });
          created++;
        }
      }
    }
  }

  logger.info?.(`[catalog-seed] created ${created} showtimes.`);
  return { created };
}

/**
 * Seed demo movies, Indian theatres, and showtimes.
 * Idempotent by default; set SEED_FORCE=true to refresh shows.
 */
async function seedCatalog(options = {}) {
  const { logger = console, strict = true, force = false } = options;
  const dbURL = process.env.DB_URL;

  if (!dbURL) {
    const msg = "DB_URL is missing.";
    if (strict) throw new Error(`seed:catalog — ${msg}`);
    logger.warn?.("[catalog-seed]", msg);
    return { ok: false, status: "error", message: msg };
  }

  const seedForce =
    force || String(process.env.SEED_FORCE || "").toLowerCase() === "true";

  let ownsConnection = false;
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(dbURL);
      ownsConnection = true;
    }

    const partner = await seedPartnerUser(logger);
    const { movies } = await seedMovies(logger);
    const theatres = await seedTheatres(logger, partner._id);
    const { created: showsCreated } = await seedShows(
      logger,
      movies,
      theatres,
      seedForce,
    );

    return {
      ok: true,
      status: "created",
      message: `Catalog seeded: ${movies.length} movies, ${theatres.length} theatres, ${showsCreated} new showtimes.`,
      counts: {
        movies: movies.length,
        theatres: theatres.length,
        showsCreated,
      },
    };
  } finally {
    if (ownsConnection) {
      await mongoose.disconnect().catch(() => {});
    }
  }
}

module.exports = { seedCatalog };

if (require.main === module) {
  (async () => {
    try {
      const result = await seedCatalog({ strict: true });
      console.log("seed:catalog —", result.message);
      process.exit(result.ok ? 0 : 1);
    } catch (err) {
      console.error("seed:catalog — failed:", err.message);
      await mongoose.disconnect().catch(() => {});
      process.exit(1);
    }
  })();
}
