const express = require("express");
const app = express();

require("dotenv").config(); // Load environment variables

const connectDB = require("./config/db"); // Import database configuration
const userRouter = require("./routes/userRoutes"); // Import user routes
const movieRouter = require("./routes/movieRoutes");
const theatreRouter = require("./routes/theatreRoutes");
const showRouter = require("./routes/showRoutes");
const bookingRouter = require("./routes/bookingRoutes");

console.log("server", process.env.DB_URL);
connectDB(); // Connect to database

/** Routes */
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/theatres", theatreRouter);
app.use("/api/shows", showRouter);
app.use("/api/booking", bookingRouter);

app.listen(3001, () => {
  console.log("Server is Running");
});
