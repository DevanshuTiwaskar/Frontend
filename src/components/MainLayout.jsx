// src/components/MainLayout.jsx
import React from "react";
import Sidebar from "./Sidebar.jsx"; // desktop sidebar (hidden on small screens)
import MobileSidebar from "./MobileSidebar.jsx";
import CreatePlaylistModal from "./CreatePlaylistModal.jsx";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, User } from "lucide-react";

/**
 * MainLayout
 * App shell used for authenticated pages: sidebar (desktop), mobile drawer,
 * sticky header, main scrollable content, and global modals.
 */
export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen w-full mt-[20px] flex flex-col bg-background text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="flex gap-4 h-[calc(100vh-140px)]">
          {/* Desktop Sidebar (hidden on mobile via Sidebar.jsx which should use `hidden md:flex`) */}
          <Sidebar />

          {/* Main content area */}
          <main
            className="flex-1 glass rounded-xl overflow-y-auto"
            // Add bottom padding to avoid the persistent player overlapping content on small screens
            style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))" }}
            aria-label="Main content"
          >
            {/* Sticky header */}
            <div className="sticky top-0 z-20">
              <div className="p-4">
                <StickyHeader />
              </div>
            </div>

            {/* Page content */}
            <div className="p-4 sm:p-6">{children}</div>
          </main>
        </div>
      </div>

      {/* Mobile Drawer Sidebar (mount once for all pages using this layout) */}
      <MobileSidebar />

      {/* Mount modals globally so Zustand open/close works from any child */}
      <CreatePlaylistModal />
    </div>
  );
}

/* ================================================
   StickyHeader (inline small header used inside MainLayout)
   Kept inline so it can easily access layout-level hooks.
   ================================================ */
function StickyHeader() {
  const { user } = useAuth();
  const displayName = user?.fullName?.firstName || user?.username;
  const navigate = useNavigate();

  return (
    <header
      className="sticky top-0 z-10 p-4 glass flex items-center justify-between border-b border-white/10"
      role="banner"
    >
      <div className="flex gap-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-black/30 hover:bg-black/50"
          aria-label="Go back"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => navigate(1)}
          className="p-2 rounded-full bg-black/30 hover:bg-black/50"
          aria-label="Go forward"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          className="text-sm font-bold bg-white text-black px-4 py-2 rounded-full hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Explore premium"
        >
          Explore Premium
        </motion.button>

        <div
          className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center font-semibold text-sm text-primary"
          aria-hidden="true"
        >
          {displayName ? displayName.charAt(0).toUpperCase() : <User size={16} />}
        </div>
      </div>
    </header>
  );
}
