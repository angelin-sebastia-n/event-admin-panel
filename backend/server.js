
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Event routes
app.use("/api/events", require("./routes/eventroutes"));

// Serve the React frontend
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// API home route
app.get("/api", (req, res) => {
  res.json({ message: "Event Admin API is running" });
});

// React frontend fallback
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api/")) {
    return next();
  }

  res.sendFile(path.join(frontendPath, "index.html"), (err) => {
    if (err) next(err);
  });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
