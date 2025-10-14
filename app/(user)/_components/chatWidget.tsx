"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChatbubblesOutline, IoClose } from "react-icons/io5";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";


interface DecodedToken {
  id: string;
}

interface ChatMessage {
  senderId: string;
  message: string;
}

// ✅ Initialize socket globally (persistent)
const socket: Socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [greetingShown, setGreetingShown] = useState(false);

  // 🧩 1. Socket setup + fetch chat history (runs once)
  useEffect(() => {
    console.log("🟢 Connecting to Socket.IO...");

    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);
    });

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserId(decoded.id);
        console.log("📡 Joining as user:", decoded.id);
        socket.emit("join", decoded.id);

        // 🧩 Fetch chat history from backend
        fetch(`http://localhost:3000/api/chats/${decoded.id}`)
          .then((res) => res.json())
          .then((data) => {
            console.log("📜 Chat history:", data);
            setMessages(
              data.map((msg: any) => ({
                senderId: msg.senderId,
                message: msg.message,
              }))
            );
          })
          .catch((err) => console.error("❌ Error fetching chat history:", err));
      } catch (err) {
        console.error("❌ Error decoding token:", err);
      }
    } else {
      console.warn("⚠️ No JWT token found in localStorage");
    }

    // 🧩 Listen for new incoming messages
    socket.on("receiveMessage", (data) => {
      console.log("📩 Message received:", data);
      setMessages((prev) => [
        ...prev,
        { senderId: data.from, message: data.message },
      ]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("connect");
    };
  }, []); // ✅ empty — fixed dependency array

  // ✉️ Send message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !userId) return;

    const newMessage = { senderId: userId, message: input };
    setMessages((prev) => [...prev, newMessage]);

    socket.emit("sendMessage", {
      senderId: userId,
      receiverId: "admin",
      message: input,
    });

    setInput("");
  };

  // 🧩 2. Greeting effect (only once per session)
  useEffect(() => {
    if (isOpen && !greetingShown) {
      setMessages((prev) => [
        ...prev,
        {
          senderId: "admin",
          message:
            "Hi! I'm your Falafel Verifies support assistant. How can I help you today?",
        },
      ]);
      setGreetingShown(true);
    }
  }, [isOpen, greetingShown]); // ✅ stable dependency list

return (
  <div className="fixed bottom-6 right-6 z-50">
    <AnimatePresence mode="wait">
      {/* 💬 Floating Chat Button — only visible when chat is closed */}
      {!isOpen && (
        <motion.button
          key="chatButton"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsOpen(true)}
          className="bg-black text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition"
        >
          <IoChatbubblesOutline size={24} />
        </motion.button>
      )}

      {/* 🧾 Chat Box — appears exactly where the button was */}
      {isOpen && (
        <motion.div
          key="chatCard"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25 }}
          className="w-90 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gray-900 text-white p-4 flex justify-between items-center border-b">
            <div className="flex items-center justify-center gap-2">
              <div className="p-2 bg-gray-800 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-message-circle w-5 h-5"
                  aria-hidden="true"
                >
                  <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"></path>
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-sm">Support Assistant</h2>
                <p className="text-xs text-green-500">
                  {socket.connected
                    ? "Online • Typically replies instantly"
                    : "Offline"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <IoClose size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-96 min-h-80 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <p className="text-gray-400 text-sm text-center mt-10">
                Start a conversation with our support team 💬
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.senderId === userId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg text-sm ${
                    msg.senderId === userId
                      ? "bg-gray-900 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="border-t border-gray-200 flex items-center p-3 bg-white"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 text-sm outline-none px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-400"
            />
            <button
              type="submit"
              className="ml-2 bg-black text-white px-3 py-2 text-ce  rounded-lg text-sm hover:bg-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send w-5 h-5" aria-hidden="true"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg>
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
}