
const dns = require("node:dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Event routes
app.use("/api/events", require("./routes/eventroutes"));

// Home route
app.get("/", (req, res) => {
  res.send("Event Admin API is running");
});

const PORT = process.env.PORT || 5000;

// Check whether the MongoDB URI contains unwanted text
console.log(
  "Contains nslookup:",
  process.env.MONGO_URI?.includes("nslookup")
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
