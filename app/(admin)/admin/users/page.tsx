"use client"
import React, { useState, useEffect } from "react"
import UserTable from "./_components/UserTable"
import axios from "axios"
import { toast } from "react-toastify"
import dynamic from "next/dynamic"
import { User } from "./types/User"

const AddEditUser = dynamic(() => import("./_components/AddEditUser"), { ssr: false })

const UsersData = () => {
  const API = "http://localhost:3000/api/users"

  const [showSignUpModel, setShowSignUpModel] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [limit] = useState<number>(5)

  const getUsersData = async (page = 1) => {
    try {
      const res = await axios.get<{
        data: User[]
        totalPages: number
        totalUsers: number
      }>(`${API}?page=${page}&limit=${limit}`)
      setUsers(res.data.data)
      setTotalPages(res.data.totalPages)
      setTotalCount(res.data.totalUsers)
    } catch (error) {
      console.log(error)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      getUsersData(newPage)
    }
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1
      setCurrentPage(newPage)
      getUsersData(newPage)
    }
  }

  const handleFirst = () => {
    setCurrentPage(1)
    getUsersData(1)
  }

  const handleLast = () => {
    setCurrentPage(totalPages)
    getUsersData(totalPages)
  }

  useEffect(() => {
    getUsersData(currentPage)
  }, [currentPage, limit])

  const editUser = (user: User) => {
    setSelectedUser(user)
    setShowSignUpModel(true)
  }

  const newUser = () => {
    setSelectedUser(null)
    setShowSignUpModel(true)
  }

  const confirmDeleteUser = (id: string) => {
    setUserToDelete(id)
    setShowDeleteModal(true)
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return
    try {
      await axios.delete(`${API}/${userToDelete}`)
      toast.info("User deleted!")
      setShowDeleteModal(false)
      setUserToDelete(null)
      getUsersData()
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete user")
    }
  }

  return (
    <div>
      <div className="bg-white rounded-2xl px-7 pt-3 mx-5 my-7">
        <div className="flex justify-between my-4">
          <h1 className="font-semibold text-2xl my-1">Users</h1>
          <button
            onClick={newUser}
            className="h-10 px-4 bg-gray-800 text-white rounded-4xl flex items-center cursor-pointer"
          >
            Add User
          </button>
        </div>
        <UserTable
          onEdit={editUser}
          onDelete={confirmDeleteUser}
          users={users}
          currentPage={currentPage}
          limit={limit}
        />
        <div className="flex items-center justify-between py-5 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} results
          </span>
          <div className="flex gap-4 [&>*]:cursor-pointer">
            <button
              onClick={handleFirst}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-gray-600 bg-white hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="disabled:cursor-not-allowed disabled:bg-gray-300 px-3 py-1 text-sm text-white bg-gray-800 hover:bg-gray-950 border rounded-md"
            >
              Prev
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:bg-gray-300 bg-gray-800 hover:bg-gray-950 border rounded-md"
            >
              Next
            </button>
            <button
              onClick={handleLast}
              disabled={currentPage === totalPages}
              className="disabled:text-gray-300 disabled:cursor-not-allowed px-3 py-1 text-sm text-gray-600 bg-white rounded-md hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7m-8-14l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showSignUpModel && (
        <AddEditUser
          show={showSignUpModel}
          user={selectedUser}
          onClose={() => {
            setShowSignUpModel(false)
            setSelectedUser(null)
          }}
          apiUrl={API}
          onSaveSuccess={() => getUsersData(currentPage)}
        />
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-100">
          <div className="bg-white p-8 rounded-xl shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersData