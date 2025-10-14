import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { deleteCart } from "@/features/itemSlice";
import { logout } from "@/features/userSlice";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Link from "next/link";

const UserDropdown = () => {
  const user = useSelector((state: any) => state.user.user);
  const prod = useSelector((state: any) => state.item);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<any>(null);
  const navigate = useRouter();
  const dispatchRedux = useDispatch();

  const handleLogout = () => {
    // toast.error("Logging Out!", {
    //   position: "top-right",
    //   autoClose: 3000,
    //   hideProgressBar: false,
    //   pauseOnHover: true,
    //   draggable: true,
    // });
    // dispatchRedux(deleteCart());
    localStorage.removeItem("token");
    //  dispatchRedux(deleteCart(prod));
    dispatchRedux(logout(user));

    navigate.push("/");
  };

  // handle token expire

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const exp = decoded.exp * 1000; // JWT exp is in seconds, convert to ms
        const now = Date.now();
        const timeUntilExpiry = exp - now;
        

        if (timeUntilExpiry <= 0) {
          handleLogout(); // token already expired
        } else {
          const timeout = setTimeout(() => {
            handleLogout();
          }, timeUntilExpiry);

          return () => clearTimeout(timeout); // cleanup
        }
      } catch (err) {
        console.error("Invalid token:", err);
        handleLogout(); // fail-safe logout
      }
    }
  }, []);

    useEffect(() => {
    if (user === null) {
      handleLogout();
    }
  }, [user]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative ml-2 hidden lg:block" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2  rounded-full shadow-inner bg-blue-500  text-white text-xs uppercase font-semibold  hover:shadow-md"
      >
        {user && (
          <p>
            {user.fname} {user.lname}
          </p>
        )}
      </button>

      {open && (
        <ul className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-gray-100 z-50">
          <li className="px-4 py-2 hover:bg-gray-100 text-black">
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li
            className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserDropdown;
