"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import{ jwtDecode } from "jwt-decode"; // <-- import default, not destructure
import { useSelector } from "react-redux";

interface DecodedToken {
  id: string;
  exp?: number;
  iat?: number;
}

interface UserProfile {
  fname: string;
  lname: string;
  username: string;
  email: string;
  phone: string;
  image?: string;
}

interface ProfileFormInputs {
  fname: string;
  lname: string;
  username: string;
  email: string;
  phone: string;
}

const Profile = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const user = useSelector((state: any) => state.user.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormInputs>();

  const API = `${API_BASE_URL}/api/users`;

  // ✅ Load token safely on client
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        setUserId(decoded.id);
      } catch (err) {
        console.error("Invalid token", err);
        toast.error("Invalid token, please login again.");
      }
    }
  }, []);

  // ✅ Fetch user profile
  const getUserProfile = async () => {
    if (!userId || !token) return;
    try {
      const res = await axios.get<UserProfile>(`${API}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      reset(res.data);
      if (res.data.image) {
        setImagePreview(`${API_BASE_URL}${res.data.image}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    if (userId && token) getUserProfile();
  }, [userId, token]);

  // ✅ Handle file upload
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ✅ Update profile
  const onSubmit = async (data: any) => {
    if (!userId || !token) return;
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value as string)
      );
      if (selectedFile) formData.append("image", selectedFile);

      await axios.put(`${API}/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Profile updated successfully!");
      getUserProfile();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  // ✅ Handle password change
  const handlePasswordChange = async (e: any) => {
    e.preventDefault();
    if (!userId || !token) return;

    const currentPassword = e.target.currentPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      await axios.put(
        `${API}/${userId}/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Password updated successfully!");
      setShowPasswordModal(false);
      e.target.reset();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update password");
    }
  };
  return (
    <div className="rounded-2xl p-10">
      <div className="mb-7 space-y-1">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="">Manage your personal information and preferences</p>
      </div>
      <div className="flex flex-col gap-2 items-center lg:items-start lg:flex-row">
      <div className="">
        <div className="flex flex-col items-center p-7 min-w-100 border text-gray-600 border-gray-200 rounded-lg mr-7 mb-8 h-fit">
        <div className="relative">
          <img
            src={imagePreview || "/default-avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 shadow-md"
          />
          <label
            htmlFor="imageUpload"
            className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen w-4 h-4" aria-hidden="true"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <p className="pt-5 font-semibold text-xl">{user?.fname} {user?.lname}</p>
        <p className="mb-4">{user?.email}</p>
        <p className="flex items-center gap-2 "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone inline w-4 h-4" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path></svg> <span>{user?.phone}</span></p>
        <p className="flex items-center gap-2 "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail w-4 h-4 inline" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg><span>Verified</span></p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 w-fit min-w-100">
          <h2 className="text-xl font-semibold mb-5">Account Stats</h2>
          <div className="grid grid-cols-2 space-y-2 text-gray-600">
              <p>Member Since</p><p className="text-right font-semibold text-black">jan 2022</p>
              <p>Total Orders</p><p className="text-right font-semibold text-black">47</p>
              <p>Wishlist Items</p><p className="text-right font-semibold text-black">12</p>
              <p>Reviews Written</p><p className="text-right font-semibold text-black">15</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 flex-1 border rounded-lg border-gray-200 p-6">
        <div>
          <h3 className="text-xl font-semibold mb-4 border-gray-200 pb-2 ">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                {...register("fname", { required: "First name is required" })}
                className="w-full bg-gray-50 ring-1 ring-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gray-400"
              />
              {errors.fname && <p className="text-red-500 text-sm">{errors.fname.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                {...register("lname", { required: "Last name is required" })}
                className="w-full bg-gray-50 ring-1 ring-gray-200 rounded-lg px-3 py-2  focus:ring-1 focus:ring-gray-400"
              />
              {errors.lname && <p className="text-red-500 text-sm">{errors.lname.message}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              {...register("username", { required: "Username is required" })}
              className="w-full bg-gray-50 ring-1 ring-gray-200 rounded-lg px-3 py-2  focus:ring-1 focus:ring-gray-400"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              {...register("phone", { required: "Phone is required" })}
              className="w-full bg-gray-50 ring-1 ring-gray-200 rounded-lg px-3 py-2  focus:ring-1 focus:ring-gray-400"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Security Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b pb-2 border-gray-200">Security</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full bg-gray-50 ring-1 ring-gray-200 rounded-lg px-3 py-2  focus:ring-1 focus:ring-gray-400"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                disabled
                placeholder="***********"
                className="w-full bg-gray-50 ring-1 ring-gray-200 rounded-lg px-3 py-2  focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className=" py-2.5  px-5 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 flex items-center justify-center"
            >
              Change
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition"
        >
          Save Changes
        </button>
      </form>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <form
            onSubmit={handlePasswordChange}
            className="bg-white p-6 rounded-lg shadow-lg space-y-4 w-full max-w-sm"
          >
            <h2 className="text-lg font-semibold">Change Password</h2>

            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              className="w-full bg-gray-50 px-3 py-2 ring-1 ring-gray-200 rounded-lg"
              required
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              className="w-full bg-gray-50 px-3 py-2 ring-1 ring-gray-200 rounded-lg"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              className="w-full bg-gray-50 px-3 py-2 ring-1 ring-gray-200 rounded-lg"
              required
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
