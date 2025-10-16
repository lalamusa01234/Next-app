import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AdminSideProps {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminSide: React.FC<AdminSideProps> = ({ isExpanded, setIsExpanded }) => {
  const router = useRouter();
  const user = useSelector((state: any) => state.user.user);
  const dispatchRedux = useDispatch();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleLogout = () => {
    localStorage.removeItem("token");
    //  dispatchRedux(deleteCart(prod));
    dispatchRedux(logout(user));
    router.push("/");
  };

  return (
    <div className="flex flex-col justify-between h-full transition-all ease-in-out">
      <div className="relative">
        <div className="flex gap-2 border-b-1 pb-8 border-gray-200 p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-user-star-icon lucide-user-star"
          >
            <path d="M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z" />
            <path d="M8 15H7a4 4 0 0 0-4 4v2" />
            <circle cx="10" cy="7" r="4" />
          </svg>
          <span
            className={`self-end font-bold ${
              isExpanded ? "block" : "hidden lg:block"
            }`}
          >
            ADMIN
          </span>
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -right-7 lg:hidden  bg-gray-200 hover:bg-gray-300 rounded-full p-2 cursor-pointer shadow-md flex flex-col items-center"
          >
            <span className="w-1 h-1 bg-gray-600 rounded-full mb-0.5"></span>
            <span className="w-1 h-1 bg-gray-600 rounded-full mb-0.5"></span>
            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>

            <span className="w-px h-6 bg-gray-500 mt-1"></span>
          </div>
        </div>
        <ul className="flex flex-col gap-3 my-3">
          <li>
            <Link href="/admin">
              <button className="flex gap-2 cursor-pointer items-center w-full rounded-4xl px-2 py-3  hover:bg-gray-800 hover:text-white text-gray-600">
                <svg
                  viewBox="0 -0.5 25 25"
                  className="h-5 w-auto inline"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.918 10.0005H7.082C6.66587 9.99708 6.26541 10.1591 5.96873 10.4509C5.67204 10.7427 5.50343 11.1404 5.5 11.5565V17.4455C5.5077 18.3117 6.21584 19.0078 7.082 19.0005H9.918C10.3341 19.004 10.7346 18.842 11.0313 18.5502C11.328 18.2584 11.4966 17.8607 11.5 17.4445V11.5565C11.4966 11.1404 11.328 10.7427 11.0313 10.4509C10.7346 10.1591 10.3341 9.99708 9.918 10.0005Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.918 4.0006H7.082C6.23326 3.97706 5.52559 4.64492 5.5 5.4936V6.5076C5.52559 7.35629 6.23326 8.02415 7.082 8.0006H9.918C10.7667 8.02415 11.4744 7.35629 11.5 6.5076V5.4936C11.4744 4.64492 10.7667 3.97706 9.918 4.0006Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.082 13.0007H17.917C18.3333 13.0044 18.734 12.8425 19.0309 12.5507C19.3278 12.2588 19.4966 11.861 19.5 11.4447V5.55666C19.4966 5.14054 19.328 4.74282 19.0313 4.45101C18.7346 4.1592 18.3341 3.9972 17.918 4.00066H15.082C14.6659 3.9972 14.2654 4.1592 13.9687 4.45101C13.672 4.74282 13.5034 5.14054 13.5 5.55666V11.4447C13.5034 11.8608 13.672 12.2585 13.9687 12.5503C14.2654 12.8421 14.6659 13.0041 15.082 13.0007Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.082 19.0006H17.917C18.7661 19.0247 19.4744 18.3567 19.5 17.5076V16.4936C19.4744 15.6449 18.7667 14.9771 17.918 15.0006H15.082C14.2333 14.9771 13.5256 15.6449 13.5 16.4936V17.5066C13.525 18.3557 14.2329 19.0241 15.082 19.0006Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className={` ${isExpanded ? "block" : "hidden lg:block"}`}
                >
                  Dashboard
                </span>
              </button>
            </Link>
          </li>
          <li>
            <Link href="/admin/orders">
              {" "}
              <button className="flex gap-2 w-full cursor-pointer items-center rounded-4xl px-2 py-3 hover:bg-gray-800 text-gray-600 hover:text-white">
                <svg
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-auto inline"
                  viewBox="0 0 100 100"
                  xmlSpace="preserve"
                >
                  <g>
                    <g>
                      <path
                        d="M78.8,62.1l-3.6-1.7c-0.5-0.3-1.2-0.3-1.7,0L52,70.6c-1.2,0.6-2.7,0.6-3.9,0L26.5,60.4
			c-0.5-0.3-1.2-0.3-1.7,0l-3.6,1.7c-1.6,0.8-1.6,2.9,0,3.7L48,78.5c1.2,0.6,2.7,0.6,3.9,0l26.8-12.7C80.4,65,80.4,62.8,78.8,62.1z"
                      />
                    </g>
                    <g>
                      <path
                        d="M78.8,48.1l-3.7-1.7c-0.5-0.3-1.2-0.3-1.7,0L52,56.6c-1.2,0.6-2.7,0.6-3.9,0L26.6,46.4
			c-0.5-0.3-1.2-0.3-1.7,0l-3.7,1.7c-1.6,0.8-1.6,2.9,0,3.7L48,64.6c1.2,0.6,2.7,0.6,3.9,0l26.8-12.7C80.4,51.1,80.4,48.9,78.8,48.1
			z"
                      />
                    </g>
                    <g>
                      <path
                        d="M21.2,37.8l26.8,12.7c1.2,0.6,2.7,0.6,3.9,0l26.8-12.7c1.6-0.8,1.6-2.9,0-3.7L51.9,21.4
			c-1.2-0.6-2.7-0.6-3.9,0L21.2,34.2C19.6,34.9,19.6,37.1,21.2,37.8z"
                      />
                    </g>
                  </g>
                </svg>
                <span
                  className={` ${isExpanded ? "block" : "hidden lg:block"}`}
                >
                  Orders
                </span>
              </button>
            </Link>
          </li>{" "}
          <li>
            <Link href="/admin/users">
              <button className="flex gap-2 cursor-pointer items-center rounded-4xl px-2 py-3 w-full text-gray-600 hover:bg-gray-800 hover:text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-auto inline"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="6"
                    r="4"
                    stroke="#1C274C"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M18 9C19.6569 9 21 7.88071 21 6.5C21 5.11929 19.6569 4 18 4"
                    stroke="#1C274C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 9C4.34315 9 3 7.88071 3 6.5C3 5.11929 4.34315 4 6 4"
                    stroke="#1C274C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M17.1973 15C17.7078 15.5883 18 16.2714 18 17C18 19.2091 15.3137 21 12 21C8.68629 21 6 19.2091 6 17C6 14.7909 8.68629 13 12 13C12.3407 13 12.6748 13.0189 13 13.0553"
                    stroke="#1C274C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M20 19C21.7542 18.6153 23 17.6411 23 16.5C23 15.3589 21.7542 14.3847 20 14"
                    stroke="#1C274C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 19C2.24575 18.6153 1 17.6411 1 16.5C1 15.3589 2.24575 14.3847 4 14"
                    stroke="#1C274C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span
                  className={` ${isExpanded ? "block" : "hidden lg:block"}`}
                >
                  Users
                </span>
              </button>
            </Link>
          </li>
          <li>
            <Link href="/admin/categories">
              <button className="flex gap-2 cursor-pointer items-center rounded-4xl px-2 py-3 w-full  text-gray-600 hover:bg-gray-800 hover:text-white">
                <svg
                  fill="currentColor"
                  className="h-5 w-auto inline"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6.5,22 C4.01471863,22 2,19.9852814 2,17.5 C2,15.0147186 4.01471863,13 6.5,13 C8.98528137,13 11,15.0147186 11,17.5 C11,19.9852814 8.98528137,22 6.5,22 Z M17.5,22 C15.0147186,22 13,19.9852814 13,17.5 C13,15.0147186 15.0147186,13 17.5,13 C19.9852814,13 22,15.0147186 22,17.5 C22,19.9852814 19.9852814,22 17.5,22 Z M6.5,11 C4.01471863,11 2,8.98528137 2,6.5 C2,4.01471863 4.01471863,2 6.5,2 C8.98528137,2 11,4.01471863 11,6.5 C11,8.98528137 8.98528137,11 6.5,11 Z M17.5,11 C15.0147186,11 13,8.98528137 13,6.5 C13,4.01471863 15.0147186,2 17.5,2 C19.9852814,2 22,4.01471863 22,6.5 C22,8.98528137 19.9852814,11 17.5,11 Z M17.5,9 C18.8807119,9 20,7.88071187 20,6.5 C20,5.11928813 18.8807119,4 17.5,4 C16.1192881,4 15,5.11928813 15,6.5 C15,7.88071187 16.1192881,9 17.5,9 Z M6.5,9 C7.88071187,9 9,7.88071187 9,6.5 C9,5.11928813 7.88071187,4 6.5,4 C5.11928813,4 4,5.11928813 4,6.5 C4,7.88071187 5.11928813,9 6.5,9 Z M17.5,20 C18.8807119,20 20,18.8807119 20,17.5 C20,16.1192881 18.8807119,15 17.5,15 C16.1192881,15 15,16.1192881 15,17.5 C15,18.8807119 16.1192881,20 17.5,20 Z M6.5,20 C7.88071187,20 9,18.8807119 9,17.5 C9,16.1192881 7.88071187,15 6.5,15 C5.11928813,15 4,16.1192881 4,17.5 C4,18.8807119 5.11928813,20 6.5,20 Z" />
                </svg>
                <span
                  className={` ${isExpanded ? "block" : "hidden lg:block"}`}
                >
                  Categories
                </span>
              </button>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/products"
              className="flex gap-2 cursor-pointer items-center rounded-4xl px-2 py-3 w-full text-gray-600 hover:bg-gray-800 hover:text-white"
            >
              <svg
                className="h-5 w-auto inline"
                viewBox="0 0 16 16"
                id="meteor-icon-kit__regular-products-s"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 4V2H2V10H4V6C4 4.89543 4.89543 4 6 4H10zM12 4H14C15.1046 4 16 4.89543 16 6V14C16 15.1046 15.1046 16 14 16H6C4.89543 16 4 15.1046 4 14V12H2C0.89543 12 0 11.1046 0 10V2C0 0.89543 0.89543 0 2 0H10C11.1046 0 12 0.89543 12 2V4zM6 6V14H14V6H6z"
                />
              </svg>
              <span className={`${isExpanded ? "block" : "hidden lg:block"}`}>
                Products
              </span>
            </Link>
          </li>
          <li>
            <Link href="/admin/messages">
              <button className="flex gap-2 cursor-pointer items-center rounded-4xl px-2 py-3 w-full  text-gray-600 hover:bg-gray-800 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-auto inline"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <title>Chat with dots</title>
                  <path d="M20 2H4a2 2 0 0 0-2 2v14l4-2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM7 10a1.25 1.25 0 1 1 0-2.5A1.25 1.25 0 0 1 7 10zm5 0a1.25 1.25 0 1 1 0-2.5A1.25 1.25 0 0 1 12 10zm5 0a1.25 1.25 0 1 1 0-2.5A1.25 1.25 0 0 1 17 10z" />
                </svg>

                <span
                  className={` ${isExpanded ? "block" : "hidden lg:block"}`}
                >
                  Messages
                </span>
              </button>
            </Link>
          </li>
          <li>
            <Link href="/admin/blogs">
              <button className="flex gap-2 cursor-pointer items-center rounded-4xl px-2 py-3 w-full  text-gray-600 hover:bg-gray-800 hover:text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-auto inline"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-label="Blog icon"
                >
                  <path d="M6 3h7l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
                  <path d="M13 3v5h5" />
                  <path d="M8.5 12H15" />
                  <path d="M8.5 15H13.5" />
                  <path d="M8.5 18H12" />
                  <path d="M14.6 10.6l3.2-3.2a1.4 1.4 0 0 1 2 2l-3.2 3.2-2.3.4.3-2.4z" />
                </svg>

                <span
                  className={` ${isExpanded ? "block" : "hidden lg:block"}`}
                >
                  Blogs
                </span>
              </button>
            </Link>
          </li>
          <li>
            <Link href="/admin/subscribers">
              <button className="flex gap-2 cursor-pointer items-center rounded-4xl px-2 py-3 w-full  text-gray-600 hover:bg-gray-800 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-auto inline"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  role="img"
                >
                  <path d="M20 4H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h6v-2H4a1 1 0 0 1-1-1V8c0-.552.448-1 1-1h16c.552 0 1 .448 1 1v3h2V7a3 3 0 0 0-3-3z" />
                  <path d="M7.293 8.293a1 1 0 0 0-1.086-.217L12 12.414l5.793-4.338a1 1 0 0 0-.986-1.756L12 9.586 7.293 8.293z" />
                  <path d="M18 14v2h2v2h-2v2h-2v-2h-2v-2h2v-2h2z" />
                </svg>

                <span
                  className={` ${isExpanded ? "block" : "hidden lg:block"}`}
                >
                  Subscribers
                </span>
              </button>
            </Link>
          </li>
        </ul>
      </div>

      <div className=" flex flex-col items-center py-2">
        <div>
          {user ? (
            <img
              src={
                user.image
                  ? `${API_BASE_URL}${user.image}`
                  : "/default-avatar.png"
              }
              alt="Profile"
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div>no user</div>
          )}
        </div>
        <h4
          className={`mt-3 text-sm font-semibold text-gray-900 transition-all ease-in-out
        ${isExpanded ? "block" : "hidden lg:block"}`}
        >
          {user ? user.fname : "no user"} {user ? user.lname : "no user"}
        </h4>
        <p
          className={`text-xs text-gray-500 transition-all ease-in-out ${
            isExpanded ? "block" : "hidden lg:block"
          }`}
        >
          {user ? user.email : "no user"}
        </p>
        <p
          className={`text-xs text-gray-500 transition-all ease-in-out ${
            isExpanded ? "block" : "hidden lg:block"
          }`}
        >
          <button
            onClick={handleLogout}
            className="text-red-700 cursor-pointer"
          >
            Logout
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminSide;
