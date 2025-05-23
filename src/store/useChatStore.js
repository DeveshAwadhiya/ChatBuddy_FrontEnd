import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      if (userId === "ai-chat") {
        // Fetch AI chat messages from backend
        const res = await axiosInstance.get("/messages/ai-chat/messages");
        set({ messages: res.data });
      } else {
        const res = await axiosInstance.get(`/messages/${userId}`);
        set({ messages: res.data });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    set({ isSendingMessage: true });
    try {
      if (selectedUser._id === "ai-chat") {
        // Send message to AI chat backend route
        const res = await axiosInstance.post("/messages/ai-chat", { message: messageData.text });
        const aiResponse = res.data.response;
        // Save user message and AI response to backend
        await axiosInstance.post("/messages/ai-chat/messages", {
          senderId: "user",
          text: messageData.text,
        });
        await axiosInstance.post("/messages/ai-chat/messages", {
          senderId: "ai-chat",
          text: aiResponse,
        });
        // Add user message and AI response to messages state
        set({
          messages: [
            ...messages,
            { _id: `user-${Date.now()}`, senderId: "user", text: messageData.text },
            { _id: `ai-${Date.now()}`, senderId: "ai-chat", text: aiResponse },
          ],
        });
      } else {
        const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
        set({ messages: [...messages, res.data] });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      set({ isSendingMessage: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser, messages: [] });
    get().getMessages(selectedUser._id);
  },
}));
