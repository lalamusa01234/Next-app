"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { User } from "../types/User" 


// interface User {
//   _id: string;
//   fname?: string;
//   lname?: string;
//   email?: string;
//   username?: string;
//   phone?: string;
// }

interface UserTableProps {
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  users: User[];
  currentPage: number;
  limit: number;
}

const UserTable : React.FC<UserTableProps> = ({ onEdit, onDelete,users,currentPage,limit }) => {


  return (
    <div>
      <div className="bg-white rounded-2xl rounded-t-none overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="text-left text-sm uppercase border-y border-gray-100 text-gray-600">
              <th className="p-4">#</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Username</th>
              <th className="p-4">Phone</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="p-4">{(currentPage - 1) * limit + index + 1}</td>
                <td className="p-4">
                  {user.fname || "N/A"} {user.lname || "N/A"}
                </td>
                <td className="p-4">{user.email || "N/A"}</td>
                <td className="p-4">{user.username || "N/A"}</td>
                <td className="p-4">{user.phone || "N/A"}</td>
                <td className="p-4 flex gap-3 justify-end">
                  {/* Delete */}
                  <button
                    onClick={() => onDelete(user._id)}
                    className="cursor-pointer rounded-full p-1.5 bg-red-600 text-white hover:bg-white hover:text-red-600 shadow"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 
                        0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 
                        1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 
                        0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 
                        0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => onEdit(user)}
                    className="cursor-pointer rounded-full p-1.5 bg-indigo-800 text-white hover:bg-white hover:text-indigo-800 shadow"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 
                      2.828l-.793.793-2.828-2.828.793-.793zM11.379 
                      5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
