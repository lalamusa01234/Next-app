"use client";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
}

const socket: Socket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL}`, {
  transports: ["websocket"],
});

export default function UserChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ senderId: string; message: string }[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    console.log("🟢 Connecting to socket...");

    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO with ID:", socket.id);
    });

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        console.log("🧾 Decoded token:", decoded);
        setUserId(decoded.id);
        socket.emit("join", decoded.id);
        console.log("📡 Sent join event with userId:", decoded.id);
      } catch (err) {
        console.error("❌ Error decoding token:", err);
      }
    } else {
      console.warn("⚠️ No token found in localStorage!");
    }

    socket.on("receiveMessage", (data) => {
      console.log("📩 Message received:", data);
      setMessages((prev) => [...prev, { senderId: data.from, message: data.message }]);
    });
    

    return () => {
      socket.off("receiveMessage");
      socket.off("connect");
    };
  }, []);

  const sendMessage = () => {
    if (userId && message.trim()) {
      console.log("📨 Sending message:", { senderId: userId, receiverId: "admin", message });
      socket.emit("sendMessage", {
        senderId: userId,
        receiverId: "admin",
        message,
      });
      setMessages((prev) => [...prev, { senderId: userId, message }]);
      setMessage("");
    }
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">💬 Live Chat</h1>
      <div className="border rounded-lg p-4 h-80 overflow-y-auto mb-4 bg-gray-50">
        {messages.map((msg, i) => (
          <p
            key={i}
            className={`mb-2 p-2 rounded ${
              msg.senderId === userId ? "bg-blue-100 text-right" : "bg-gray-200 text-left"
            }`}
          >
            {msg.message}
          </p>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
