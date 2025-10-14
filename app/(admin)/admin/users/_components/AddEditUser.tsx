"use client"
import React from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { User } from "../types/User"
import axios from "axios"
import { toast } from "react-toastify"

interface AddEditUserProps {
  show: boolean
  user: User | null
  onClose: () => void
  apiUrl: string
  onSaveSuccess: () => void
}

const initialSignUpData: Omit<User, '_id'> = {
  fname: "",
  lname: "",
  username: "",
  phone: "",
  email: "",
  password: "",
}

const AddEditUser = ({ show, user, onClose, apiUrl, onSaveSuccess }: AddEditUserProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<User>({
    defaultValues: user ?? initialSignUpData
  })

  const handleFormSubmit: SubmitHandler<User> = async (data) => {
    try {
      if (user) {
        await axios.put(`${apiUrl}/${user._id}`, data)
        toast.success("User updated!")
      } else {
        await axios.post(apiUrl, data)
        toast.success("User created!")
      }
      onSaveSuccess()
      onClose()
    } catch (err) {
      console.error("Error:", err)
      toast.error("Something went wrong!")
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[100]">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="bg-white rounded-2xl shadow-2xl w-[28rem] overflow-hidden"
      >
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {user ? <span>Edit User</span> : <span>Add User</span>}
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <input
              type="text"
              placeholder="First Name"
              {...register("fname", { required: "First name is required" })}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            {errors.fname && <p className="text-red-500 text-sm">{errors.fname.message}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Last Name"
              {...register("lname", { required: "Last name is required" })}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            {errors.lname && <p className="text-red-500 text-sm">{errors.lname.message}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Username"
              {...register("username", { required: "Username is required" })}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Phone"
              {...register("phone", { required: "Phone is required" })}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 cursor-pointer text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-900 transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddEditUser