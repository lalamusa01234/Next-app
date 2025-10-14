"use client";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const Footer = () => {
  const [Categories, setCategories] = useState([]);
  const itemData = useSelector((state: any) => state.items);
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e: any) => {
    e.preventDefault(); // stop form reload

    if (!email) {
      toast.error("Please enter an email");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/newsletter", { email });
      toast.success("Subscribed successfully!");
      setEmail(""); // clear input
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Subscription failed");
    }
  };

  const API = "http://localhost:3000/api/categories";

  // Fetch Categories
  const getCategoryData = async () => {
    try {
      const res = await axios.get(API);
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  // console.log(itemData);
  return (
    <div className="bg-[#171717]">
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-10  py-12 row-span-3 text-white mx-10 xl:mx-15 2xl:mx-46">
        <div>
          <ul className=" space-y-2 text-sm text-gray-300">
            <li className="text-2xl mb-7 text-white">
              <span className=" px-3 font-semibold bg-blue-600 mr-3">F</span>
              <span className="font-bold">FALAFEL</span> VERIFIES
            </li>
            <li>685 Market Street</li>
            <li>United States</li>
            <li className="mt-7">Call us: 1.800.000.6690</li>
            <li>Email: email@domain.com</li>
          </ul>
        </div>
        <div className="">
          <ul className=" space-y-2 text-sm text-gray-300 ">
            <li className="mb-4 text-lg text-white tracking-[0.85px]">
              Shop By
            </li>
            {Categories.length > 0 &&
              Categories.slice(0, 4).map((item: any) => (
                <Link key={item._id} href={`/category-products/${item._id}`}>
                  <li className="mb-2 capitalize hover:text-white">
                    {item.category}
                  </li>
                </Link>
              ))}
          </ul>
        </div>

        <div>
          <ul className="tracking-[0.85px] text-sm space-y-2 text-gray-300 ">
            <li className="mb-4 text-lg text-white">Information</li>
            <li className="hover:text-white">
              <Link href={"/about"}>About</Link>
            </li>
            <li className="hover:text-white">
              <Link href={"/category"}>Catagories</Link>
            </li>
            <li className="hover:text-white">
              <Link href={"/privacy"}>Privacy Policy</Link>
            </li>
            <li className="hover:text-white">
              <Link href={"/blog"}>Blog</Link>
            </li>
          </ul>
        </div>
        <div>
          <ul className=" space-y-2 text-sm text-gray-300 ">
            <li className="mb-4 text-lg text-white tracking-[0.85px]">
              Customer Service
            </li>
            <li className="hover:text-white">
              <Link href={"orders&returns"}>Orders & Returns</Link>
            </li>
            <li className="hover:text-white">
              <Link href={"/contact"}>Contact us</Link>
            </li>
            <li className="hover:text-white">
              <Link href={"faq"}>Faqs</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-10 xl:mx-15 2xl:mx-46 py-12 border-y-1 border-gray-800 text-white">
        <form>
          <div className="space-y-2">
            <h1 className="mb-4  text-lg tracking-[0.85px]">
              Newsletter Sign Up
            </h1>
            <p className="text-sm text-gray-300">
              Receive our latest updates about our products and promotions.
            </p>
            <div className="flex items-center gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 px-3 w-90  rounded-xl bg-gray-800  mt-4 ring-1 ring-gray-600"
              />
              <button
                type="submit"
                onClick={handleSubscribe}
                className=" h-9 w-30 rounded-lg text-white bg-blue-600 hover:bg-blue-700 text-xs mt-4 cursor-pointer font-semibold"
              >
                SUBSCRIBE
              </button>
            </div>
          </div>
        </form>
      </div>

      <footer className="mx-10 xl:mx-15 2xl:mx-46 md:py-12 py-20">
        <div className="flex-col flex sm:flex-row gap-5 justify-between">
          <div className="">
            <h3 className="text-gray-400">
              © 2022 FALAFEL VERIFIES. Developed by Egenie Next Solutions
            </h3>
          </div>
          <div className="flex justify-between space-x-3">
            <div>
              <img src="./fd-1.png" alt="" />
            </div>
            <div>
              <img src="./fd-2.png" alt="" />
            </div>
            <div>
              <img src="./fd-3.png" alt="" />
            </div>
            <div>
              <img src="./fd-4.png" alt="" />
            </div>
            <div>
              <img src="./fd-5.png" alt="" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
