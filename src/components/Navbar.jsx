import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useModalStore } from "../store/useModalStore.js";
import { Waves, LogOut, Settings, ChevronDown, Menu } from "lucide-react";

const buttonVariants = { hover: { scale: 1.03 }, tap: { scale: 0.98 } };

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const openMobileMenu = useModalStore((s) => s.openMobileMenu);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
    navigate("/login");
  };

  const displayName = user?.fullName?.firstName || user?.username || "User";
  const initials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length === 1) return name.substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <motion.nav
      className="w-full py-3 px-4 sm:px-6 lg:px-8 glass sticky top-0 z-50 border-b border-white/6"
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.22 }}
    >
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.button
            className="md:hidden p-2 text-muted hover:text-white"
            onClick={openMobileMenu}
            whileTap={{ scale: 0.95 }}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </motion.button>

          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Link to="/" className="flex items-center gap-3">
              <Waves size={26} className="text-gradient" />
              <div className="text-lg sm:text-xl font-bold tracking-tight">Aura</div>
            </Link>
          </motion.div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {!user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/login" className="text-sm px-3 py-1.5 rounded-md hover:bg-white/5">Sign In</Link>
              <Link to="/register" className="bg-gradient-to-r from-[#2EE07A] to-[#4B6FF5] text-black px-3 py-1.5 rounded-md text-sm font-semibold">Get Started</Link>
            </div>
          ) : (
            <div className="relative">
              <motion.button
                onClick={() => setIsDropdownOpen((p) => !p)}
                className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-white/4"
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2EE07A]/20 to-[#4B6FF5]/20 border border-white/6 flex items-center justify-center font-semibold text-sm text-primary">
                  {initials(displayName)}
                </div>
                <span className="hidden md:block text-sm font-medium">{displayName}</span>
                <ChevronDown size={14} className={`hidden md:block text-muted ${isDropdownOpen ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="absolute right-0 top-12 w-56 glass border border-white/6 rounded-lg shadow-xl p-2 z-50"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    <div className="px-2 py-2 border-b border-white/6 mb-2">
                      <p className="text-sm font-medium truncate">{displayName}</p>
                      <p className="text-xs text-muted truncate">{user.email}</p>
                    </div>

                    <Link to="/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 w-full px-2 py-2 rounded-md text-sm hover:bg-white/5">
                      <Settings size={16} /> Settings
                    </Link>

                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-2 py-2 rounded-md text-sm text-red-400 hover:bg-red-500/6">
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
