import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { data } from "react-router-dom";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { use } from "react";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "https://chatlery-realtime-chatapp.onrender.com";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogginging: false,
  isUpdateing: false,
  isCheakingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("error in useAutjStore", error);
      set({ authUser: null });
    } finally {
      set({ isCheakingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account Created Succesfull");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      set({ isSigningUp: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out sucessfully");
      get().DisConnectSocket();
    } catch (error) {
      console.log("error in logout", error);
    }
  },
  login: async (data) => {
    set({ isLogginging: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      console.log(res);
      set({ authUser: res.data });
      toast.success("logged in succesfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLogginging: false });
    }
  },
  updatingProfile: async (data) => {
    set({ isUpdateing: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      console.log(res);
      set({ authUser: res.data });
      toast.success("profile updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("error in frontend updating profile", error);
    } finally {
      set({ isUpdateing: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket: socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  DisConnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
