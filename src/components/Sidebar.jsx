// src/components/Sidebar.jsx

import React from "react";
import { motion } from "framer-motion";
import SidebarContent from "./SidebarContent.jsx"; // ⭐ 1. Import the new content

export default function Sidebar() {
  return (
    <motion.aside
      className="w-64 glass p-4 border-r border-white/10
                 flex-col flex-shrink-0
                 hidden md:flex" // ⭐ 2. FIX: Re-add 'hidden md:flex'
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* ⭐ 3. Render the reusable content */}
      <SidebarContent /> 
    </motion.aside>
  );
}