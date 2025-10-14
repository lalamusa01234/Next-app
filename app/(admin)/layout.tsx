"use client";
import Link from "next/link";
import { FaShoppingBag, FaUser, FaHeart } from "react-icons/fa";
import Header from "./components/Header";
import AdminSide from "./components/AdminSide";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
   const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="bg-gray-100">
      {/* <ToastContainer /> */}
      <div className="flex flex-1 min-h-screen">
        <aside className={`lg:w-64 w-20 bg-slate-200 p-4 rounded-2xl m-4 border-4 border-gray-200 transition-all ease-in-out ${
          isExpanded ? "w-64" : "w-20"
        }`}>
          <AdminSide isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        </aside>
        <main className="flex-1 flex flex-col overflow-auto h-screen">
            <Header />
          <div className="flex-grow">
            {children}
          </div>
          {/* <div className="p-5 text-center bg-black text-white rounded-2xl mx-4">
            Admin Footer
          </div> */}
        </main>
      </div>
    </div>
  );
}