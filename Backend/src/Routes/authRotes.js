import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from "../controller/authController.js";
import { protectRoute } from "../Middleware/auth.middleware.js";
const Router = express.Router();

Router.post("/signup", signup);
Router.post("/login", login);
Router.post("/logout", logout);
Router.put("/update-profile", protectRoute, updateProfile);
Router.get("/check", protectRoute, checkAuth);

export default Router;
