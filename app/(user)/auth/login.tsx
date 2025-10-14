"use client"
import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../../features/userSlice";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";

// Define login form fields
interface LoginFormInputs {
  email: string;
  password: string;
}

// Facebook login response type
interface FacebookAuthResponse {
  accessToken: string;
  userID: string;
}

interface FacebookLoginResponse {
  authResponse?: FacebookAuthResponse;
}

// User type (adjust as per your backend response)
interface User {
  id: string;
  email: string;
  role: string;
  [key: string]: any;
}

const Login: React.FC = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const router = useRouter();

  const initialLoginData: LoginFormInputs = {
    email: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: initialLoginData,
  });

  // Google Login handler
  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      const res = await axios.post<{ token: string; user: User }>(
        "http://localhost:3000/api/users/google-login",
        { token: credentialResponse.credential }
      );

      localStorage.setItem("token", res.data.token);
      dispatch(setUser(res.data.user));
      toast.success("Google login successful!", { position: "top-right", autoClose: 500 });
      // navigate("/dashboard");
      router.push("/dashboard");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("Google login error:", error.response?.data || error.message);
      toast.error("Google login failed: " + (error.response?.data?.message || "Unknown error"), {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Facebook Login handler
  const handleFacebookLogin = async (response: FacebookLoginResponse) => {
    if (response.authResponse) {
      try {
        const res = await axios.post<{ token: string; user: User }>(
          "http://localhost:3000/api/users/facebook-login",
          {
            accessToken: response.authResponse.accessToken,
            userID: response.authResponse.userID,
          }
        );

        localStorage.setItem("token", res.data.token);
        dispatch(setUser(res.data.user));
        toast.success("Facebook login successful!", { position: "top-right", autoClose: 500 });
        // navigate("/dashboard");
        router.push("/dashboard");
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error("Facebook login error:", error.response?.data || error.message);
        toast.error("Facebook login failed: " + (error.response?.data?.message || "Unknown error"), {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } else {
      toast.error("Facebook login cancelled or failed", { position: "top-right", autoClose: 3000 });
    }
  };

  // Form submit handler
  // const handleLoginSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
  //   try {
  //     const res = await axios.post<{ token: string; user: User }>(
  //       "http://localhost:3000/api/users/login",
  //       data
  //     );

  //     const { token, user } = res.data;
  //     localStorage.setItem("token", token);
  //     dispatch(setUser(user));

  //     toast.success("Login successful!", { position: "top-right", autoClose: 500 });
  //     // navigate(user.role === "admin" ? "/admin" : "/dashboard");
  //     router.push(user.role === "admin" ? "/admin" : "/dashboard");
  //     setLoginData(initialLoginData);
  //   } catch (err) {
  //     const error = err as AxiosError<{ message?: string }>;
  //     console.error("Login error:", error.response?.data || error.message);
  //     toast.error("Login failed: " + (error.response?.data?.message || "Unknown error"), {
  //       position: "top-right",
  //       autoClose: 3000,
  //     });
  //   }
  // };

  const handleLoginSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
  try {
    const res = await axios.post<{ token: string; user: User }>(
      "http://localhost:3000/api/users/login",
      data
    );

    const { token, user } = res.data;
    localStorage.setItem("token", token);
    dispatch(setUser(user)); // Set initial user data from login response

    // Fetch full user profile to ensure latest data
    const profileRes = await axios.get("http://localhost:3000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setUser(profileRes.data)); // Update Redux store with full profile

    toast.success("Login successful!", { position: "top-right", autoClose: 500 });
    router.push(user.role === "admin" ? "/admin" : "/dashboard");
    setLoginData(initialLoginData);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    console.error("Login error:", error.response?.data || error.message);
    toast.error("Login failed: " + (error.response?.data?.message || "Unknown error"), {
      position: "top-right",
      autoClose: 3000,
    });
  }
};

  const [loginData, setLoginData] = useState<LoginFormInputs>(initialLoginData);

  // Facebook SDK Login
  const loginWithFacebook = () => {
    if (!(window as any).FB) {
      toast.error("Facebook SDK not loaded yet. Please try again.");
      return;
    }

    (window as any).FB.login(
      (response: FacebookLoginResponse) => {
        handleFacebookLogin(response);
      },
      { scope: "public_profile,email" }
    );
  };

  // Initialize Facebook SDK
  useEffect(() => {
    (window as any).fbAsyncInit = function () {
      (window as any).FB.init({
        // appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v23.0",
      });
      console.log("✅ Facebook SDK initialized");
    };
  }, []);

  return (
    <div className="col-span-2">
      <div className="py-10 mr-10 xl:mr-15 2xl:mr-46 mx-10">
        <h2 className="font-semibold text-3xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-key-round-icon lucide-key-round inline"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg> Login
        </h2>
        <div className="ring ring-gray-200 rounded-lg bg-gray-50 my-10 p-5">
          <form onSubmit={handleSubmit(handleLoginSubmit)}>
            <div className="grid grid-cols-1 space-y-6">
              {/* Email */}
              <div className="flex flex-col">
                <label htmlFor="lEmail" className="font-semibold">
                  Email address
                </label>
                <input
                  type="email"
                  {...register("email", { required: "This is required" })}
                  id="lEmail"
                  placeholder="Email address"
                  autoComplete="username"
                  className={
                    errors.email
                      ? "px-3 bg-white ring-1 ring-red-500 py-2 mr-7 rounded-[13px]"
                      : "px-3 bg-white ring-1 ring-gray-100 py-2 mr-7 rounded-[13px]"
                  }
                />
                <p className="text-red-600">{errors.email?.message}</p>
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label htmlFor="passwordLogin" className="font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  {...register("password", { required: "This is required" })}
                  placeholder="Password"
                  className={
                    errors.password
                      ? "px-3 bg-white ring-1 ring-red-500 py-2 mr-7 rounded-[13px]"
                      : "px-3 bg-white ring-1 ring-gray-100 py-2 mr-7 rounded-[13px]"
                  }
                />
                <p className="text-red-600">{errors.password?.message}</p>
              </div>
            </div>

            {/* Submit */}
            <div>
              <input
                className="py-3 px-7 my-3 mt-7 w-fit rounded-4xl cursor-pointer bg-[#232323] text-white"
                type="submit"
                value="Login"
              />
            </div>
          </form>

          {/* OAuth Login */}
          <div className="p-6">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log("Google Login Failed");
                toast.error("Google login failed!", { position: "top-right", autoClose: 3000 });
              }}
            />
            <div>
              <button
                onClick={loginWithFacebook}
                className="bg-blue-600 text-white w-full py-2 rounded mt-3"
              >
                Login with Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default Login;
