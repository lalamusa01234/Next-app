"use client";
import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
}

export default function UserChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ senderId: string; message: string }[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // ✅ MOVE SOCKET INSIDE useEffect - Only runs in BROWSER
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    console.log("🟢 Connecting to socket...");

    // ✅ Safe localStorage access
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    if (!token) {
      console.warn("⚠️ No token found in localStorage!");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log("🧾 Decoded token:", decoded);
      setUserId(decoded.id);

      // ✅ Create socket INSIDE useEffect (browser only)
      socketRef.current = io(`${process.env.NEXT_PUBLIC_API_BASE_URL}`, {
        transports: ["websocket"],
      });

      const socket = socketRef.current;

      socket.on("connect", () => {
        console.log("✅ Connected to Socket.IO with ID:", socket.id);
        setIsConnected(true);
        socket.emit("join", decoded.id);
        console.log("📡 Sent join event with userId:", decoded.id);
      });

      socket.on("disconnect", () => {
        console.log("🔴 Disconnected from Socket.IO");
        setIsConnected(false);
      });

      socket.on("receiveMessage", (data) => {
        console.log("📩 Message received:", data);
        setMessages((prev) => [...prev, { senderId: data.from, message: data.message }]);
      });

    } catch (err) {
      console.error("❌ Error decoding token:", err);
    }

    // ✅ Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off("receiveMessage");
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
      }
    };
  }, []);

  const sendMessage = () => {
    if (userId && message.trim() && socketRef.current) {
      console.log("📨 Sending message:", { senderId: userId, receiverId: "admin", message });
      socketRef.current.emit("sendMessage", {
        senderId: userId,
        receiverId: "admin",
        message,
      });
      setMessages((prev) => [...prev, { senderId: userId, message }]);
      setMessage("");
    }
  };

  // ✅ Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  if (!userId) {
    return <div className="p-10">🔐 Please log in to chat</div>;
  }

  return (
    <div className="p-10 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">💬 Live Chat</h1>
        <span className={`px-2 py-1 rounded text-sm ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {isConnected ? '🟢 Online' : '🔴 Offline'}
        </span>
      </div>
      
      <div className="border rounded-lg p-4 h-80 overflow-y-auto mb-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded-lg max-w-xs ${
              msg.senderId === userId 
                ? "bg-blue-500 text-white ml-auto" 
                : "bg-gray-200 text-black"
            }`}
          >
            <p>{msg.message}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type message..."
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!isConnected}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected || !message.trim()}
          className={`px-4 rounded-lg py-2 ${
            isConnected && message.trim()
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          } text-white transition-colors`}
        >
          Send
        </button>
      </div>
    </div>
  );
}