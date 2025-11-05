// src/components/Navbar.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useModalStore } from "../store/useModalStore.js"; // ⭐ 1. Import the store
import {
  Waves,
  LogOut,
  Settings,
  ChevronDown,
  Menu,
} from "lucide-react";

// ... (Animation Variants are unchanged) ...
const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.1 } },
};


export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { openMobileMenu } = useModalStore(); // ⭐ 2. Get the action from the store

  // ... (handleLogout, getInitials, displayName are unchanged) ...
  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length === 1) return name.substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  
  const displayName = user?.fullName?.firstName || user?.username;


  return (
    <motion.nav
      // ... (className, initial, animate, transition are unchanged) ...
      className="w-full py-4 px-4 sm:px-6 lg:px-8 glass sticky top-0 z-50
                 border-b border-white/10 flex-shrink-0"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-4">

          {/* ⭐ 3. This button is now functional */}
          <motion.button
            className="md:hidden p-1 text-muted-foreground hover:text-white"
            onClick={openMobileMenu}
            whileTap={{ scale: 0.9 }}
          >
            <Menu size={24} />
          </motion.button>
          
          {/* ... (Logo is unchanged) ... */}
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Link to="/" className="flex items-center gap-2.5">
              <Waves className="text-primary" size={28} />
              <div className="text-xl font-bold tracking-tight">
                Aura
              </div>
            </Link>
          </motion.div>
        </div>

        {/* --- Nav Links & Auth --- */}
        {/* ... (The rest of your navbar is 100% correct and unchanged) ... */}
        <div className="flex items-center gap-4 sm:gap-6">
          {!user ? (
            <div className="flex items-center gap-3">
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  to="/login"
                  className="bg-transparent text-sm font-semibold px-4 py-2 rounded-lg 
                             border border-white/20 transition-all hover:bg-white/10"
                >
                  Sign In
                </Link>
              </motion.div>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  to="/register"
                  className="bg-primary text-black px-4 py-2 rounded-lg text-sm font-semibold 
                             shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          ) : (
            <div className="relative">
              <motion.button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-white/10"
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center font-semibold text-sm text-primary">
                  {getInitials(displayName)}
                </div>
                <span className="text-sm font-medium hidden md:block">
                  {displayName}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform hidden md:block text-muted-foreground ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </motion.button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="absolute right-0 top-12 w-56 glass border border-white/10 rounded-lg shadow-xl p-2 z-50"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="px-2 py-2 border-b border-white/10 mb-2">
                      <p className="text-sm font-medium truncate">{displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 w-full px-2 py-2 rounded-md text-sm transition-colors hover:bg-white/10"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-2 py-2 rounded-md text-sm transition-colors text-red-400 hover:bg-red-500/20"
                    >
                      <LogOut size={16} />
                      Logout
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