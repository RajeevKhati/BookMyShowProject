const express = require("express");
const app = express();

require("dotenv").config(); // Load environment variables

const connectDB = require("./config/db"); // Import database configuration
const userRouter = require("./routes/userRoutes"); // Import user routes

console.log("server", process.env.DB_URL);
connectDB(); // Connect to database

/** Routes */
app.use(express.json());
app.use("/api/users", userRouter);

app.listen(3001, () => {
  console.log("Server is Running");
});
