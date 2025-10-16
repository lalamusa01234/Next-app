"use client";

import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const SOCKET_URL = `${API_BASE_URL}`;

interface Message {
  senderId: string;
  message: string;
}

export default function AdminChat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [chats, setChats] = useState<Record<string, Message[]>>({});
  const [message, setMessage] = useState("");

  // 🧩 Load saved chats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("adminChats");
    if (saved) {
      setChats(JSON.parse(saved));
      console.log("💾 Restored chat history from localStorage");
    }
  }, []);

  // 🧩 Save chats whenever they change
  useEffect(() => {
    if (Object.keys(chats).length > 0) {
      localStorage.setItem("adminChats", JSON.stringify(chats));
    }
  }, [chats]);

  // 🧩 Connect socket
  useEffect(() => {
    const s = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    setSocket(s);

    s.on("connect", () => {
      console.log("🟢 Admin connected to socket:", s.id);
      s.emit("join", "admin"); // admin joins with special ID
    });

    s.on("onlineUsers", (users: string[]) => {
      console.log("📡 Received onlineUsers:", users);
      setOnlineUsers(users.filter((u) => u !== "admin"));
    });

    s.on("receiveMessage", (data: Message & { from: string }) => {
      console.log("💬 Message received:", data);
      setChats((prev) => {
        const prevMsgs = prev[data.from] || [];
        return {
          ...prev,
          [data.from]: [...prevMsgs, { senderId: data.from, message: data.message }],
        };
      });
    });

    s.on("disconnect", () => {
      console.log("🔴 Admin socket disconnected");
    });

    return () => {
      s.disconnect();
    };
  }, []);

  // ✉️ Send message to user
  const sendMessage = () => {
    if (!activeUser || !socket || !message.trim()) return;

    const msg = {
      senderId: "admin",
      receiverId: activeUser,
      message,
    };

    socket.emit("sendMessage", msg);
    console.log("📤 Sent message:", msg);

    setChats((prev) => {
      const prevMsgs = prev[activeUser] || [];
      return {
        ...prev,
        [activeUser]: [...prevMsgs, { senderId: "admin", message }],
      };
    });

    setMessage("");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 border-r p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">🟢 Online Users</h2>
        {onlineUsers.length === 0 ? (
          <p className="text-gray-500">No users online</p>
        ) : (
          onlineUsers.map((userId) => (
            <button
              key={userId}
              onClick={() => setActiveUser(userId)}
              className={`block w-full text-left p-2 rounded ${
                activeUser === userId
                  ? "bg-blue-200 text-blue-800"
                  : "hover:bg-gray-100"
              }`}
            >
              {userId}
            </button>
          ))
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {activeUser ? (
          <>
            <div className="border-b p-4 bg-gray-100 font-semibold">
              Chatting with: {activeUser}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {(chats[activeUser] || []).map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-md max-w-xs ${
                    msg.senderId === "admin"
                      ? "bg-blue-100 self-end ml-auto"
                      : "bg-gray-200"
                  }`}
                >
                  {msg.message}
                </div>
              ))}
            </div>

            <div className="p-4 border-t flex gap-2">
              <input
                type="text"
                className="flex-1 border rounded p-2"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            Select a user to start chatting 💬
          </div>
        )}
      </div>
    </div>
  );
}
