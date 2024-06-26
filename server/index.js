const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
// const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const connectDB = require("./config/database");

const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`Successfully connected to port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("<h1>Social Media API Working Properly</h1>");
});
