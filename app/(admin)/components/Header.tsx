import React from "react";
import { useState } from "react";

import { logout } from "../../../features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";




const Header = () => {
   const router = useRouter();
  const user = useSelector((state : any) => state.user.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatchRedux = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem('token');
    //  dispatchRedux(deleteCart(prod)); 
    dispatchRedux(logout(user));
  router.push("/");
  }
  return (
    <div>
      <div className="sticky top-4 z-10 bg-white rounded-2xl mx-4 mt-4 py-4 px-7 shadow-lg flex items-center justify-between">
        <div className="relative w-90">
          <input
            type="text"
            placeholder="Search..."
            className="pr-10 pl-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-600 w-full"
          />
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.15 13.15z"
              />
            </svg>
          </span>
        </div>
        <div className="flex justify-between gap-10">
          <div className="self-center">
       <Link href={"/"}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=" h-7 w-7 text-gray-700 cursor-pointer lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></Link>
          </div>
          <div className="relative">
            <div
              onClick={() => {
                setMenuOpen(!menuOpen);
              }}
              className="cursor-pointer rounded-full bg-gray-800 flex justify-center items-center"
            >
              <div className="center font-medium text-xl text-white select-none cursor-pointer">
                {user ? <img src={user.image ? `http://localhost:3000${user.image}` : "/default-avatar.png"} alt="" className="h-14 w-14 rounded-full object-cover" /> : <div>no user</div>}

              </div>
              {menuOpen ? (
                <div className="absolute top-14 right-2">
                  <ul className=" w-40 bg-white  rounded-md shadow-lg ring-1 ring-gray-100 z-50">
                    <Link href={"/admin"}><li className="px-4 py-2 hover:bg-gray-100">Dashboard</li></Link>
                    <li onClick={handleLogout} className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">
                      Logout
                    </li>
                  </ul>
                </div>
              ) : null}
            </div>
           
          </div>
           
        </div>
      </div>
    </div>
  );
};

export default Header;
