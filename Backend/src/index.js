import express from "express";
import authRoutes from "./Routes/authRotes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import dotenv from "dotenv";
import { ConnectDb } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();
dotenv.config();
app.use(express.json({ limit: "50mb" }));

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
  });
}

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log("server is runing on port " + PORT);
  ConnectDb();
});
