"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addData,
  deleteData,
  decreaseData,
  deleteCart,
} from "@/features/itemSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import UserDropdown from "./dropdown";
import Link from "next/link";

const element = <FontAwesomeIcon icon={faEnvelope} />;

const NavBar = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const user = useSelector((state : any) => state.user.user);
  const items = useSelector((state: any) => state.items.list);
  const dispatchRedux = useDispatch();
  const itemData = useSelector((state: any) => state.items);
  const itemQuantity = React.useMemo(
  () => items.reduce((acc: number, item: any) => acc + item.quantity, 0),
  [items]
);
  const itemTotal = React.useMemo(
  () => items.reduce((acc: number, item: any) => acc + item.finalPrice * item.quantity, 0),
  [items]
);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState(false)  
    const [mounted, setMounted] = useState(false);

  const NavItems = [
    { id: 1, name: "HOME", slug: "/" },
    { id: 2, name: "SHOP", slug: "/shop" },
    { id: 3, name: "CATEGORIES", slug: "/category" },
    { id: 4, name: "CONTACT", slug: "/contact" },
  ];

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const body = document.body
  //     if(menuOpen) {
  //       body.classList.add("overflow-y-hidden")
  //     } else {
  //       body.classList.remove("overflow-y-hidden");
  //     }
  //   }
  // }, [])


    useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent hydration mismatch by rendering nothing until mounted
    return null;
  }


  return (
    <header className="sticky z-1000 top-0 bg-[#171717]  header1 ring-[0.1px] border-b-1 ring-gray-100">
      {/* <ToastContainer /> */}
      {cart && (
        <div className="toggle-cart bg-gray-50 fixed h-full w-[40rem] right-0 z-100 overflow-y-auto flex flex-col justify-between">
          <div className="mx-5">
            <svg
              onClick={() => setCart(!cart)}
              className="mt-5 relative left-[94%] w-5 h-5 cursor-pointer transition-all duration-1000 ease-in-out z-2500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                d="M 0 0 L 15 15 M 0 15 L 15 0"
                style={{ stroke: "rgb(87, 82, 82)", strokeWidth: 2 }}
              />
            </svg>

            <div className=" text-center max-w-xl mx-auto">
              <div className="flex justify-between ml-2  my-5">
                <h2 className="text-xl font-bold mb-4">🛒 Cart </h2>
                <p
                  onClick={() => dispatchRedux(deleteCart(itemData))}
                  className="hover:text-red-500 text-gray-500 underline cursor-pointer"
                >
                  Empty cart
                </p>
              </div>
              {itemData.list.length === 0 ? (
                <p>No items in cart</p>
              ) : (
                <ul className="space-y-4">
                  {itemData.list.map((item: any, id: number) => (
                    <li
                      key={id}
                      className="flex justify-between items-start border-b-1 border-gray-200 py-3 rounded"
                    >
                      <div className="flex">
                        <div className="relative min-h-25 w-25 min-w-25 mx-2 ring-1 ring-gray-100">
                          <img
                            src={`${API_BASE_URL}${
                              Array.isArray(item.image)
                                ? item.image[0]
                                : item.image || "/placeholder.jpg"
                            }`}
                            className="w-full absolute inset-0 object-cover block h-25"
                            alt=""
                          />
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold text-start w-[80%]">
                            {item.name}
                          </p>

                          {/* Display selected options */}
                          {item.selectedOptions &&
                            item.selectedOptions.length > 0 && (
                              <div className="text-gray-500 text-xs mt-1 flex gap-2">
                                {item.selectedOptions.map(
                                  (opt: any, i: number) => (
                                    <span key={i} className="">
                                      {opt.name}: {opt.value}
                                    </span>
                                  )
                                )}
                              </div>
                            )}

                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() =>
                                dispatchRedux(
                                  decreaseData({
                                    _id: item._id,
                                    selectedOptions: item.selectedOptions,
                                  })
                                )
                              }
                              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                            >
                              –
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                dispatchRedux(addData({ ...item }))
                              }
                              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between gap-3 items-center">
                        <button
                          onClick={() =>
                            dispatchRedux(
                              deleteData({
                                _id: item._id,
                                selectedOptions: item.selectedOptions,
                              })
                            )
                          }
                          className="ml-2 px-3 py-1 cursor-pointer hover:text-red-500"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                        <p className="">
                          ${(item.finalPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="bg-white pt-3 px-5">
            {itemData.list.length === 0 ? (
              <p></p>
            ) : (
              <div className="mx-3">
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <p className="text-gray-700">Subtotal</p>
                  <p className="text-right text-gray-700">
                    $ {itemTotal.toFixed(2)}
                  </p>

                  <p className="text-gray-700">Tax</p>
                  <p className="text-right text-gray-700">
                    $ {itemQuantity * 3}
                  </p>

                  <p className="text-2xl font-semibold pt-3">Total</p>
                  <p className="text-right font-semibold text-2xl pt-3">
                    $ {(itemTotal + itemQuantity * 3).toFixed(2)}
                  </p>
                </div>

                <Link href="/cart">
                  <button
                    onClick={() => setCart(!cart)}
                    className="w-full block py-2 my-3 cursor-pointer bg-gray-50 text-black text-lg rounded-[20px] ring-1 ring-gray-200"
                  >
                    Cart<i className="fa-brands fa-cc-visa"></i>
                  </button>
                </Link>
                <Link href="/checkout">
                  <button
                    onClick={() => setCart(!cart)}
                    className="w-full block py-2 my-3 cursor-pointer bg-black text-white text-lg  rounded-[20px]"
                  >
                    CheckOut
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-[#155cfc] text-sm text-white text-center py-2">
        Mid-Season Sale Up to 70% OFF.
      </div>

      <nav className="flex justify-between items-center gap-2 sm:gap-7  py-4 text-white mx-10 xl:mx-15 2xl:mx-46 ">
        <div className="text-xl">
          <span className="font-bold">
            <span className="py-1 px-3 font-semibold bg-blue-600 mr-3">F</span>
            FALAFEL
          </span>{" "}
          VERIFIES
        </div>
        <div>
          <ul className="md:flex md:space-x-6 flex-col md:flex-row hidden">
            {NavItems &&
              NavItems.length > 0 &&
              NavItems.map((item, id) => {
                return (
                  <li key={id} className="cursor-pointer">
                    <Link
                      className="hover:text-blue-400 border-gray-100 py-1"
                      href={item.slug}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="relative w-112 hidden lg:block">
          <input
            type="text"
            placeholder="Search products..."
            className="pr-10 pl-4 py-1.5 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-600 w-full"
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
        <div className="gap-6 flex">
          <div className="flex gap-2 items-center">
            {/* icon 1 */}
            <Link href={"tracking"}>
              <div className="p-2 group hover:bg-gray-800 rounded-lg">
                <div className="h-5 w-5 group-hover:text-blue-500">
                  <div >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
            {/* icon 2 */}
            <div
              className="p-2 group hover:bg-gray-800 rounded-lg cursor-pointer"
              onClick={() => setCart(!cart)}
            >
              <div className="h-4 w-4 group-hover:text-blue-500">
                <div
                  className={user ? "relative block" : "relative block"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-shopping-cart"
                  >
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                  </svg>
                  <p className="quant absolute cart-button cursor-pointer left-3 -top-2 bg-blue-500 rounded-[100%] w-4 h-4 text-center counter text-white cart-counter text-xs flex justify-center items-center">
                    {itemQuantity}
                  </p>
                </div>
              </div>
            </div>
            {/* icon 3 */}
            <Link href={user ? "/dashboard" : "/auth"}>
              <div className="p-2 group hover:bg-gray-800 rounded-lg lg:hidden">
                <div className="h-4 w-4 group-hover:text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-user cursor-pointer"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {user ?(
            <div>
              <UserDropdown />
            </div>
          ) : (
            <Link href="/auth">
              <div className="uppercase hidden lg:block bg-blue-500 z-20 rounded-full hover:shadow-sm hover:shadow-blue-400 transition-shadow duration-300 px-4 py-2 text-white font-semibold text-xs">
                Login/Register
              </div>
            </Link>
          )}

          <svg
            onClick={() => setMenuOpen(!menuOpen)}
            className="z-9 w-5 h-7 cursor-pointer transition-all duration-1000 ease-in-out ham md:hidden"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </div>
      </nav>
      {menuOpen && (
        <div>
          <ul className="flex flex-col h-dvh bg-white w-dvw md:hidden fixed inset-0 z-99999">
            <svg
              onClick={() => setMenuOpen(!menuOpen)}
              className="mt-5 relative left-[94%] w-5 h-5 cursor-pointer transition-all duration-1000 ease-in-out md:hidden z-2500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                className=""
                d="M 0 0 L 15 15 M 0 15 L 15 0"
                style={{ stroke: "rgb(87, 82, 82)", strokeWidth: 2 }}
              />
            </svg>
            {NavItems &&
              NavItems.length > 0 &&
              NavItems.filter((item, id) => {
                return item.id == 4;
              }).map((item, id) => {
                return (
                  <li
                    key={id}
                    className="p-5 cursor-pointer border-b-1 border-gray-100"
                  >
                    <a href={item.slug}>{item.name}</a>
                  </li>
                );
              })}
          </ul>
        </div>
      )}

      {/* below nav bar  */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden z-50">
        <ul className="flex justify-around items-center">
          {NavItems &&
            NavItems.length > 0 &&
            NavItems.filter((item) => item.id < 4).map((item) => (
              <Link href={item.slug} key={item.id} className="flex-1">
                <li className="p-4 text-center cursor-pointer text-sm font-medium hover:text-blue-500 transition">
                  {item.name}
                </li>
              </Link>
            ))}
        </ul>
      </div>
    </header>
  );
};

export default NavBar;
