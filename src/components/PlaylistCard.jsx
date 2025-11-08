import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, ListMusic } from "lucide-react";

/**
 * A card component that displays a single playlist.
 */
export default function PlaylistCard({ playlist }) {
  const coverImage = playlist.songs?.[0]?.coverImageUrl;
  const pid = playlist.id || playlist._id;

  return (
    <Link to={`/playlist/${pid}`}>
      <motion.div
        className="relative glass p-3 rounded-xl flex flex-col items-center 
                   cursor-pointer overflow-hidden group"
        whileHover={{ scale: 1.05, translateY: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* --- Album Art Container --- */}
        <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden shadow-lg">
          {coverImage ? (
            <img
              src={coverImage}
              alt={playlist.name}
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/150x150/27272a/71717a?text=${playlist.name?.charAt(0) || "?"}`;
              }}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-white/10 flex items-center justify-center">
              <ListMusic size={64} className="text-muted-foreground" />
            </div>
          )}

          {/* --- Play Overlay (visual) --- */}
          <motion.div
            className="absolute inset-0 bg-black/50 flex items-center justify-center 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center 
                         shadow-xl shadow-primary/30 transform transition-transform duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={(e) => e.preventDefault()} // keep it visual; navigation stays on card click
            >
              <Play size={24} fill="currentColor" />
            </motion.button>
          </motion.div>
        </div>

        {/* --- Playlist Info --- */}
        <div className="w-full text-center px-1">
          <div className="font-bold text-base truncate mb-0.5">
            {playlist.name}
          </div>
          <div className="text-sm text-muted-foreground truncate">
            {playlist.songs?.length || 0} songs
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
