// src/components/MobileSidebar.jsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModalStore } from "../store/useModalStore.js";
import SidebarContent from "./SidebarContent.jsx";
import { X } from "lucide-react";

// Animation for the backdrop
const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

// Animation for the menu sliding in
const menuVariants = {
  visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  hidden: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
};

export default function MobileSidebar() {
  const { isMobileMenuOpen, closeMobileMenu } = useModalStore();

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex md:hidden"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          ></div>

          {/* Menu */}
          <motion.div
            className="glass relative z-10 w-72 h-full border-r border-white/10 p-4
                       flex flex-col"
            variants={menuVariants}
          >
            <button
              onClick={closeMobileMenu}
              className="absolute top-3 right-3 p-1 rounded-full text-muted-foreground transition-colors hover:bg-white/10"
            >
              <X size={20} />
            </button>

            <div className="h-10"></div> 
            
            {/* Render the same content as the desktop sidebar */}
            <SidebarContent />

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}