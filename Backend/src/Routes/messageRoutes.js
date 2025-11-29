import express from "express";
import { protectRoute } from "../Middleware/auth.middleware.js";
import {
  getMessages,
  getUserSideBar,
  sendMessages,
} from "../controller/messageController.js";

const Router = express.Router();

Router.get("/users", protectRoute, getUserSideBar);
Router.get("/:id", protectRoute, getMessages);
Router.post("/send/:id", protectRoute, sendMessages);
export default Router;
