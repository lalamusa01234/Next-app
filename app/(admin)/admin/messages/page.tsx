"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

// Define message type
interface Message {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
}

const MessagesTable: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const API = `${API_BASE_URL}/api/contacts`;

  // Fetch messages
  const getMessages = async () => {
    try {
      const res = await axios.get<Message[]>(API);
      setMessages(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Open modal
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API}/${deleteId}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== deleteId));
      toast.success("Message deleted successfully!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message!");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <div className="overflow-x-auto p-4 mt-3">
      {/* Header */}
      <div className="bg-white rounded-t-2xl px-7 pt-7 flex justify-between items-center pb-4">
        <h1 className="font-semibold text-2xl">Messages</h1>
        <h3 className="text-gray-500 text-sm font-medium">
          {messages.length} Total
        </h3>
      </div>

      {/* Table */}
      <div className="p-4 w-full bg-white rounded-2xl rounded-t-none overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="text-left text-sm uppercase border-y border-gray-100 text-gray-600">
              <th className="py-4 px-6 font-semibold">#</th>
              <th className="py-4 px-6 font-semibold">Name</th>
              <th className="py-4 px-6 font-semibold">Email</th>
              <th className="py-4 px-6 font-semibold">Subject</th>
              <th className="py-4 px-6 font-semibold">Message</th>
              <th className="py-4 px-6 font-semibold">Date</th>
              <th className="py-4 px-6 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg, ind) => (
              <tr key={msg._id} className="hover:bg-gray-50">
                <td className="py-3 px-6">{ind + 1}</td>
                <td className="py-3 px-6">{msg.name}</td>
                <td className="py-3 px-6">{msg.email}</td>
                <td className="py-3 px-6">{msg.subject || "-"}</td>
                <td className="py-3 px-6">{msg.message}</td>
                <td className="py-3 px-6">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => openDeleteModal(msg._id)}
                    className="bg-red-600 hover:bg-white hover:text-red-600 text-white p-2 rounded-full"
                  >
                    <FaTrash size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {messages.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-gray-500"
                >
                  No messages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this message?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesTable;
