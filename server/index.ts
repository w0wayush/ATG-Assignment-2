import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
// import userRoutes from "./routes/user";
import postRoutes from "./routes/post";
import connectDB from "./config/database";

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
