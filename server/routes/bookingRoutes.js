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
        success_url: `${
          process.env.CLIENT_URL
        }/success?show=${showId}&seats=${selectedSeats.join(",")}`,
        cancel_url: `${process.env.CLIENT_URL}/error`,
      });

      res.send({ success: true, url: session.url });
    } catch (err) {
      res.send({ success: false, message: err.message });
    }
  }
);

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
