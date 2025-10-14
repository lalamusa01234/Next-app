import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Blog } from "../types/blog";

interface BlogTableProps {
  blogs: Blog[];
  onEdit: (blog: Blog) => void;
  onRefresh: () => void;
}

const BlogTable: React.FC<BlogTableProps> = ({ blogs, onEdit, onRefresh }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const API = "http://localhost:3000/api/blogs";

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API}/${deleteId}`);
      toast.success("Blog deleted successfully!", { autoClose: 1000 });
      setShowDeleteModal(false);
      setDeleteId(null);
      onRefresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete blog.");
    }
  };

  return (
    <div className="p-4 w-full bg-white rounded-2xl rounded-t-none overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="text-left text-sm uppercase border-y border-gray-100 text-gray-600">
            <th className="text-center font-medium">#</th>
            <th className="p-4 font-medium">Image</th>
            <th className="p-4 font-medium">Title</th>
            <th className="p-4 font-medium">Description</th>
            <th className="p-4 font-medium">Date</th>
            <th className="p-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500 italic">
                No Data
              </td>
            </tr>
          ) : (
            blogs.map((b, index) => (
              <tr key={b._id} className="hover:bg-gray-50 bg-white w-full">
                <td className="text-center px-2">{index + 1}</td>
                <td className="p-4">
                  <img
                    src={`http://localhost:3000${b.image}`}
                    alt={b.title}
                    className="h-13 w-13 object-cover rounded"
                  />
                </td>
                <td className="p-4">{b.title}</td>
                <td className="p-4">{b.description}</td>
                <td className="p-4">
                  {new Date(b.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="p-4 flex gap-3 justify-end">
                  {/* Delete */}
                   <button
                    className="cursor-pointer rounded-full p-1.5 bg-red-600 text-white hover:bg-white hover:text-red-600 shadow"
                    onClick={() => openDeleteModal(b._id)}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 
                        0 000 2v10a2 2 0 002 2h8a2 2 0 
                        002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 
                        1 0 0011 2H9zM7 8a1 1 0 012 
                        0v6a1 1 0 11-2 0V8zm5-1a1 1 
                        0 00-1 1v6a1 1 0 102 
                        0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {/* Edit */}
                  <button
                    className="cursor-pointer rounded-full p-1.5 bg-indigo-800 text-white hover:bg-white hover:text-indigo-800 shadow"
                    onClick={() => onEdit(b)}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M13.586 3.586a2 2 0 112.828 
                      2.828l-.793.793-2.828-2.828.793-.793zM11.379 
                      5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this blog?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
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

export default BlogTable;
