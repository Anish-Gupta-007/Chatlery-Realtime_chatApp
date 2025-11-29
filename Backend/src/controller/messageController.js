import User from "../Model/user.model.js";
import Message from "../Model/message.model.js";
import cloudnary from "../lib/cloudnary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUserSideBar = async (req, res) => {
  try {
    const isLoggedIn = req.user._id;
    const filterUser = await User.find({ _id: { $ne: isLoggedIn } }).select(
      "-password"
    );

    res.status(200).json(filterUser);
  } catch (error) {
    console.log("error in getUserSideBar controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const message = await Message.find({
      $or: [
        { senderId: myId, reciverId: userToChatId },
        { senderId: userToChatId, reciverId: myId },
      ],
    });
    res.status(200).json(message);
  } catch (error) {
    console.log("error in getMessages controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { image, text } = req.body;
    const { id: reciverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudnary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      reciverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();
    // realtime functinality with socket.io
    const receiverSocketId = getReceiverSocketId(reciverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in logout controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
