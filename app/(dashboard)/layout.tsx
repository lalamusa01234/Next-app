"use client";
import Link from "next/link";
import { FaShoppingBag, FaUser, FaHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../(user)/layout";
import { usePathname } from "next/navigation";
import { logout } from "@/features/userSlice";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
    const dispatchRedux = useDispatch();
     const user = useSelector((state: any) => state.user.user);
  const pathname = usePathname();

    const handleLogout = () => {
      localStorage.removeItem("token");
      //  dispatchRedux(deleteCart(prod));
      dispatchRedux(logout(user));
      router.push("/");
    };

  const navItems = [
    { id: "dashboard", href: "/dashboard", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house w-5 h-5" aria-hidden="true"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>, label: "Dashboard" },
    { id: "orders", href: "/orders", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package w-5 h-5" aria-hidden="true"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path><path d="M12 22V12"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><path d="m7.5 4.27 9 5.15"></path></svg>, label: "Orders" },
    { id: "wishlist", href: "/wishlist", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart w-5 h-5" aria-hidden="true"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path></svg>, label: "Wishlist" },
    { id: "profile", href: "/profile", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user w-5 h-5" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>, label: "Profile" },
    { id: "setting", href: "/setting", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings w-5 h-5" aria-hidden="true"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path><circle cx="12" cy="12" r="3"></circle></svg>, label: "Settings" },
  ];

  return (
    <DefaultLayout>
      <div className="flex mb-10 mx-10 xl:mx-15 2xl:mx-46">
        {/* Sidebar */}
        <aside className="w-64 ring-1 ring-gray-200 text-gray-900 p-6 rounded-2xl mt-10 max-h-fit">
          <div className="flex gap-2 mb-8">
            <div className="bg-gray-900 rounded-full h-12 w-12 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                className="lucide lucide-user w-6 h-6 text-white">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <h2 className="font-semibold">My Account</h2>
              <p className="text-sm">Manage your account</p>
            </div>
          </div>

          <nav className="space-y-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg transition ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.icon} {item.label}
                </Link>
              );
            })}

            <div className="border-t border-gray-200 mt-10">
              
              <h1 className="flex items-center gap-3 px-4 py-3 text-red-600 rounded-lg mt-10 hover:bg-red-50 cursor-pointer" onClick={handleLogout}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out w-5 h-5 mr-3" aria-hidden="true"><path d="m16 17 5-5-5-5"></path><path d="M21 12H9"></path><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path></svg>
                Logout
              </h1>
            </div>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1">{children}</main>
      </div>
    </DefaultLayout>
  );
}
