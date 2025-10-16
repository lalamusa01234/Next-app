"use client"
import React, { useState, ChangeEvent } from "react";
import axios, { AxiosError } from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import { GoogleLogin } from "@react-oauth/google";
import Login from "./login";

// Define form fields type
interface SignupFormInputs {
  fname: string;
  lname: string;
  username: string;
  phone: string;
  email: string;
  password: string;
}

const Auth: React.FC = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const initialSignUpData: SignupFormInputs = {
    fname: "",
    lname: "",
    username: "",
    phone: "",
    email: "",
    password: "",
  };

  // Signup form state
  const [signupData, setSignupData] = useState<SignupFormInputs>(initialSignUpData);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    defaultValues: initialSignUpData,
  });

  // Handle input change for signup
  const handleSignupChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit signup form
  const handleSignupSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/users`, data);
      console.log("Signup success:", res.data);

      toast.success("Signup successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
      });

      setSignupData(initialSignUpData);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("Signup error:", error);

      toast.error(error.response?.data?.message || "Signup Failed!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div>
      {/* <ToastContainer /> */}
      <div className="grid md:grid-cols-6 grid-cols-1">
        {/* Signup Form */}
        <div className="col-span-4">
          <div className="py-10 mx-10 xl:mx-15 2xl:mx-46">
            <h2 className="font-semibold text-3xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rectangle-ellipsis-icon lucide-rectangle-ellipsis inline"><rect width="20" height="12" x="2" y="6" rx="2"/><path d="M12 12h.01"/><path d="M17 12h.01"/><path d="M7 12h.01"/></svg> Register
            </h2>
            <div className="ring ring-gray-200 rounded-lg bg-gray-50 my-10 p-5">
              <form onSubmit={handleSubmit(handleSignupSubmit)}>
                <div className="grid grid-cols-2 space-y-6">
                  {/* First Name */}
                  <div className="flex flex-col">
                    <label htmlFor="fname" className="font-semibold">First name</label>
                    <input
                      type="text"
                      {...register("fname", { required: "This is required" })}
                      id="fname"
                      placeholder="First Name"
                      className={
                        errors.fname
                          ? "px-3 bg-white ring-1 ring-red-500 py-2 mr-7 rounded-[13px]"
                          : "px-3 bg-white ring-1 ring-gray-100 py-2 mr-7 rounded-[13px]"
                      }
                      value={signupData.fname}
                      onChange={handleSignupChange}
                    />
                    <p className="text-red-600">{errors.fname?.message}</p>
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col">
                    <label htmlFor="lname" className="font-semibold">Last name</label>
                    <input
                      type="text"
                      {...register("lname", {
                        minLength: {
                          value: 4,
                          message: "Min length is 4",
                        },
                        required: "This is required.",
                      })}
                      id="lname"
                      placeholder="Last Name"
                      className={
                        errors.lname
                          ? "px-3 bg-white ring-1 ring-red-500 py-2 mr-7 rounded-[13px]"
                          : "px-3 bg-white ring-1 ring-gray-100 py-2 mr-7 rounded-[13px]"
                      }
                      value={signupData.lname}
                      onChange={handleSignupChange}
                    />
                    <p className="text-red-600">{errors.lname?.message}</p>
                  </div>

                  {/* Username */}
                  <div className="flex flex-col">
                    <label htmlFor="username" className="font-semibold">Username</label>
                    <input
                      type="text"
                      {...register("username", { required: "This is required." })}
                      id="username"
                      placeholder="Username"
                      autoComplete="username"
                      className={
                        errors.username
                          ? "px-3 bg-white ring-1 ring-red-500 py-2 mr-7 rounded-[13px]"
                          : "px-3 bg-white ring-1 ring-gray-100 py-2 mr-7 rounded-[13px]"
                      }
                      value={signupData.username}
                      onChange={handleSignupChange}
                    />
                    <p className="text-red-600">{errors.username?.message}</p>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col">
                    <label htmlFor="phone" className="font-semibold">Phone number</label>
                    <input
                      type="text"
                      {...register("phone")}
                      id="phone"
                      placeholder="Phone Number"
                      className={
                        errors.phone
                          ? "px-3 bg-white ring-1 ring-red-500 py-2 mr-7 rounded-[13px]"
                          : "px-3 bg-white ring-1 ring-gray-100 py-2 mr-7 rounded-[13px]"
                      }
                      value={signupData.phone}
                      onChange={handleSignupChange}
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <label htmlFor="email" className="font-semibold">Email address</label>
                    <input
                      type="email"
                      {...register("email", { required: "This is required" })}
                      id="email"
                      placeholder="Email address"
                      className={
                        errors.email
                          ? "px-3 bg-white ring-1 ring-red-500 py-2 mr-7 rounded-[13px]"
                          : "px-3 bg-white ring-1 ring-gray-100 py-2 mr-7 rounded-[13px]"
                      }
                      value={signupData.email}
                      onChange={handleSignupChange}
                    />
                    <p className="text-red-600">{errors.email?.message}</p>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col">
                    <label htmlFor="password" className="font-semibold">Password</label>
                    <input
                      type="password"
                      {...register("password", {
                        minLength: {
                          value: 4,
                          message: "Minimum 4 letters required",
                        },
                        required: "This is required",
                      })}
                      id="current-password"
                      autoComplete="current-password"
                      placeholder="Password"
                      className={
                        errors.password
                          ? "px-3 bg-white ring-1 ring-red-500 py-2 mr-7 rounded-[13px]"
                          : "px-3 bg-white ring-1 ring-gray-100 py-2 mr-7 rounded-[13px]"
                      }
                      value={signupData.password}
                      onChange={handleSignupChange}
                    />
                    <p className="text-red-600">{errors.password?.message}</p>
                  </div>
                </div>

                <div>
                  <input
                    className="py-3 px-7 my-3 w-fit rounded-4xl cursor-pointer bg-[#232323] text-white"
                    type="submit"
                    value="Sign Up"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <Login />
      </div>
    </div>
  );
};

export default Auth;
