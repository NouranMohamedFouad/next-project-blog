"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-teal-500 shadow-lg z-50 relative">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        <Link
          href="/"
          className={`text-3xl font-bold text-white`}
        >
          Blogify
        </Link>

        <div className="flex space-x-6">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-white font-semibold hover:underline"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="text-white font-semibold hover:underline"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
