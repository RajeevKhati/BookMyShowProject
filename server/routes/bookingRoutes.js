const bookingRouter = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");
const emailHelper = require("../utils/emailHelper");

const BOOKING_POPULATE = [
  { path: "user" },
  {
    path: "show",
    populate: [
      { path: "movie", model: "movies" },
      { path: "theatre", model: "theatres" },
    ],
  },
];

async function loadPopulatedBooking(bookingId) {
  return Booking.findById(bookingId).populate(BOOKING_POPULATE);
}

function formatTicketDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTicketTime(value) {
  if (!value) return "—";
  const match = String(value).match(/^(\d{1,2}):(\d{2})/);
  if (!match) return String(value);
  let hours = Number(match[1]);
  const minutes = match[2];
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${suffix}`;
}

function formatSeats(seats) {
  if (Array.isArray(seats)) return seats.join(", ");
  return String(seats ?? "");
}

async function sendTicketEmailForBooking(bookingId) {
  const populatedBooking = await loadPopulatedBooking(bookingId);
  if (!populatedBooking?.user?.email) {
    throw new Error("Booking user email not found for ticket email.");
  }

  await emailHelper("ticketTemplate.html", populatedBooking.user.email, {
    name: populatedBooking.user.name,
    movie: populatedBooking.show.movie.movieName,
    theatre: populatedBooking.show.theatre.name,
    date: formatTicketDate(populatedBooking.show.date),
    time: formatTicketTime(populatedBooking.show.time),
    seats: formatSeats(populatedBooking.seats),
    amount: populatedBooking.seats.length * populatedBooking.show.ticketPrice,
    transactionId: populatedBooking.transactionId,
  });
}

let stripeClient;
/** Lazy init so loading this module doesn't require Stripe env (scripts/tests/offline tooling). */
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  if (!stripeClient) {
    stripeClient = require("stripe")(key);
  }
  return stripeClient;
}

bookingRouter.post(
  "/create-checkout-session",
  authMiddleware,
  async (req, res) => {
    try {
      const { selectedSeats, showId, ticketPrice } = req.body;

      const session = await getStripe().checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "CineVault — Movie Ticket",
                description: `${selectedSeats.length} seat(s) for Show ID: ${showId}`,
              },
              unit_amount: ticketPrice * 100,
            },
            quantity: selectedSeats.length,
          },
        ],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/error`,
        metadata: {
          showId,
          seats: JSON.stringify(selectedSeats),
          userId: req.userId, // coming from authMiddleware
        },
      });

      res.send({ success: true, url: session.url });
    } catch (err) {
      res.status(500).send({ success: false, message: err.message });
    }
  }
);

bookingRouter.post("/confirm-booking", async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    const showId = session.metadata.showId;
    const seats = JSON.parse(session.metadata.seats);
    const userId = session.metadata.userId;
    const transactionId = String(session.payment_intent);

    const existingBooking = await Booking.findOne({ transactionId });
    if (existingBooking) {
      return res.send({
        success: true,
        message: "Booking already confirmed.",
        data: existingBooking,
      });
    }

    const newBooking = new Booking({
      show: showId,
      seats,
      user: userId,
      transactionId,
    });

    await newBooking.save();

    const existingShow = await Show.findById(showId);
    const updatedSeats = [...existingShow.bookedSeats, ...seats];
    await Show.findByIdAndUpdate(showId, {
      bookedSeats: updatedSeats,
    });

    try {
      await sendTicketEmailForBooking(newBooking._id);
    } catch (emailErr) {
      console.error("confirm-booking: ticket email failed:", emailErr);
    }

    res.send({
      success: true,
      message: "Booking confirmed and transaction stored.",
      data: newBooking,
    });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

// Create a booking after the payment
bookingRouter.post("/book-show", authMiddleware, async (req, res) => {
  try {
    const { show, seats, user } = req.body;
    if (user == null || String(user) !== String(req.userId)) {
      return res.status(403).send({
        success: false,
        message: "You can only book for your own account.",
      });
    }
    const newBooking = new Booking({ show, seats, user });
    await newBooking.save();

    const existingShow = await Show.findById(show).populate("movie");
    const updatedBookedSeats = [...existingShow.bookedSeats, ...seats];
    await Show.findByIdAndUpdate(show, {
      bookedSeats: updatedBookedSeats,
    });

    await sendTicketEmailForBooking(newBooking._id);

    res.send({
      success: true,
      message: "New Booking done!",
      data: newBooking,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

bookingRouter.get("/get-all-bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate("user")
      .populate("show")
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "movies",
        },
      })
      .populate({
        path: "show",
        populate: {
          path: "theatre",
          model: "theatres",
        },
      });
    res.send({
      success: true,
      message: "Bookings fetched!",
      data: bookings,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

module.exports = bookingRouter;
