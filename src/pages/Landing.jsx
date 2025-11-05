import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Music, Play, SkipBack, SkipForward } from "lucide-react";

// --- Placeholder Icons ---
// // You should replace these with a real icon library like lucide-react
// const Music = ({ size = 24 }) => <div style={{ width: size, height: size, border: '2px solid', borderRadius: 4 }} >🎵</div>;
// const Play = ({ size = 24 }) => <div style={{ width: size, height: size, border: '2px solid', borderRadius: '50%' }} >▶️</div>;
// const SkipBack = ({ size = 24 }) => <div style={{ width: size, height: size, border: '2px solid', borderRadius: 4 }} >⏮️</div>;
// const SkipForward = ({ size = 24 }) => <div style={{ width: size, height: size, border: '2px solid', borderRadius: 4 }} >⏭️</div>;
// // -------------------------


// Animation variants for the text content
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Stagger the children's animation
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

// Animation variants for the buttons
const buttonVariants = {
  hover: { scale: 1.05, transition: { type: "spring", stiffness: 300 } },
  tap: { scale: 0.95 },
};


export default function Landing() {
  return (
    // Use min-h-screen for a full hero section, adjust padding as needed
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)] py-12 px-8 md:px-16">
      
      {/* --- LEFT SIDE (TEXT CONTENT) --- */}
      <motion.div
        className="space-y-6 md:space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl lg:text-7xl font-extrabold tracking-tighter"
          variants={itemVariants}
        >
          {/* Gradient text for a modern feel */}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-300 to-neutral-500">
            Your Music.
          </span>
          <br />
          Anywhere, Anytime.
        </motion.h1>

        <motion.p
          className="text-lg text-muted-foreground max-w-lg"
          variants={itemVariants}
        >
          A seamless, minimal music player for your personal library. Upload, create playlists, and just listen. No distractions.
        </motion.p>

        <motion.div className="flex gap-4" variants={itemVariants}>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Link
              to="/register"
              className="bg-primary text-black px-6 py-3 rounded-lg font-semibold shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
            >
              Get Started Free
            </Link>
          </motion.div>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Link
              to="/login"
              className="bg-white/10 px-6 py-3 rounded-lg font-semibold border border-white/20 transition-all hover:bg-white/20"
            >
              Sign In
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* --- RIGHT SIDE (VISUAL MOCKUP) --- */}
      <motion.div
        className="flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, type: "spring", stiffness: 80 }}
      >
        {/* Mockup Player */}
        <div className="w-full max-w-sm glass rounded-2xl border border-white/10 shadow-xl overflow-hidden">
          
          {/* Album Art Section - Replace with an <img> tag */}
          <div className="relative h-64 w-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            <Music size={80} />
            {/* Example with a real image:
              <img 
                src="/img/your-album-art-placeholder.png" 
                alt="Album Art" 
                className="w-full h-full object-cover" 
              /> 
            */}
          </div>
          
          {/* Info & Controls Section */}
          <div className="p-6 space-y-4">
            {/* Song Info */}
            <div>
              <h3 className="text-2xl font-semibold">Starlight Echo</h3>
              <p className="text-muted-foreground">The Cosmic Voyagers</p>
            </div>

            {/* Scrubber */}
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                // Animate the progress bar for a dynamic effect
                initial={{ width: "0%" }}
                animate={{ width: "40%" }}
                transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-center items-center gap-6 text-white/80 pt-2">
              <SkipBack size={24} className="cursor-pointer transition-colors hover:text-white" />
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-lg shadow-primary/30 transition-transform hover:scale-105">
                <Play size={28} className="text-black" />
              </div>
              <SkipForward size={24} className="cursor-pointer transition-colors hover:text-white" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}