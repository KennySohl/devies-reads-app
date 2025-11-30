"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getToken, logout, getUserId } from "@/lib/auth";
import { getUser } from "@/lib/users";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);

    if (token) {
      const userId = getUserId();
      if (userId) {
        getUser(userId)
          .then((user) => setUsername(user.username))
          .catch(() => setUsername(null));
      }
    }
  }, [pathname]); // Re-check on route change

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUsername(null);
    setMobileMenuOpen(false);
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "Books" },
    { href: "/profile", label: "My Profile", requiresAuth: true },
  ];

  return (
    <nav className="bg-[#181c1f] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="text-2xl font-bold text-[#f8f8f8] hover:text-[#2a8fbd] transition-colors"
          >
            Devies Reads
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              if (link.requiresAuth && !isLoggedIn) return null;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition-colors ${
                    pathname === link.href
                      ? "text-[#5ec3d3]"
                      : "text-[#f8f8f8] hover:text-[#5ec3d3]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLogout}
                  className="bg-[#5ec3d3] text-white px-4 py-1 rounded-lg font-medium hover:bg-[#2a8fbd] transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-[#f8f8f8] font-medium hover:text-[#5ec3d3] transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-[#5ec3d3] text-white ml-3 px-4 py-2 rounded-lg font-medium hover:bg-[#2a8fbd] transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-[#5ec3d3] transition-colors"
          >
            {mobileMenuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                if (link.requiresAuth && !isLoggedIn) return null;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-medium transition-colors ${
                      pathname === link.href
                        ? "text-[#5ec3d3]"
                        : "text-gray-700 hover:text-[#5ec3d3]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {isLoggedIn ? (
                <>
                  <div className="text-gray-700 pt-2 border-t">
                    Hello, <span className="font-semibold">{username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-[#5ec3d3] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2a8fbd] transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 font-medium hover:text-[#5ec3d3] transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-[#5ec3d3] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2a8fbd] transition-colors text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
