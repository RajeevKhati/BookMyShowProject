const bookingRouter = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");

bookingRouter.post(
  "/create-checkout-session",
  authMiddleware,
  async (req, res) => {
    try {
      const { selectedSeats, showId, ticketPrice } = req.body;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Movie Ticket Booking",
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

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const showId = session.metadata.showId;
    const seats = JSON.parse(session.metadata.seats);
    const userId = session.metadata.userId;
    const transactionId = session.payment_intent;

    const newBooking = new Booking({
      show: showId,
      seats,
      user: userId,
      transactionId,
    });

    await newBooking.save();

    // Update booked seats
    const existingShow = await Show.findById(showId);
    const updatedSeats = [...existingShow.bookedSeats, ...seats];
    await Show.findByIdAndUpdate(showId, {
      bookedSeats: updatedSeats,
    });

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
    const newBooking = new Booking({ show, seats, user });
    await newBooking.save();

    const existingShow = await Show.findById(show).populate("movie");
    const updatedBookedSeats = [...existingShow.bookedSeats, ...seats];
    await Show.findByIdAndUpdate(show, {
      bookedSeats: updatedBookedSeats,
    });

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
    const bookings = await Booking.find({ user: req.body.userId })
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
