import jwt from "jsonwebtoken";
import User from "../Model/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "unAoutharized -NO TOKEN PROVIDED" });
    }
    const deccoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!deccoded) {
      return res.status(401).json({ message: "UnAutharized - Invailid token" });
    }

    const user = await User.findById(deccoded.userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error in logout controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
