import React from "react";
import { motion } from "framer-motion";

// --- Icons ---
// Play: For the main play button
// MoreHorizontal: For the "..." more options button
import { Play, MoreHorizontal } from "lucide-react";

// --- Context Hook ---
// We import the usePlayer hook to get the playSong function
import { usePlayer } from "../context/PlayerContext.jsx";

/**
 * A card component that displays a single song.
 *
 * @param {object} song - The song object to display.
 * @param {array} allSongs - The entire list of songs this song belongs to (for the player queue).
 */
export default function SongCard({ song, allSongs }) {
  // Get the playSong function from our global PlayerContext
  const { playSong } = usePlayer();

  // This handler starts playing the song
  // We pass both the song and the full list (allSongs) to the context
  const handlePlay = (e) => {
    e.stopPropagation(); // Stop the click from bubbling to the card's onClick
    playSong(song, allSongs);
  };

  // The main card click also plays the song
  const handleCardClick = () => {
    playSong(song, allSongs);
  };

  // A placeholder for the "more" button
  const handleMoreClick = (e) => {
    e.stopPropagation();
    // TODO: Implement a context menu (e.g., "Add to Playlist", "View Artist")
    alert(`More options for ${song.title}`);
  };

  return (
    <motion.div
      className="relative glass p-3 rounded-xl flex flex-col items-center 
                 cursor-pointer overflow-hidden group" // 👈 FIX: Added 'group' class
      whileHover={{ scale: 1.05, translateY: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handleCardClick}
    >
      {/* --- Album Art Container with Play Button Overlay --- */}
      <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden shadow-lg">
        <img
          src={song.coverImageUrl}
          alt={song.title}
          // FIX: Add an onError fallback for broken images
          onError={(e) => {
            e.target.src = `https://placehold.co/150x150/27272a/71717a?text=${song.title.charAt(0)}`;
          }}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* --- Play Overlay (Appears on hover) --- */}
        <motion.div
          className="absolute inset-0 bg-black/50 flex items-center justify-center 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            onClick={handlePlay}
            className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center 
                       shadow-xl shadow-primary/30 transform transition-transform duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Play size={24} fill="currentColor" />
          </motion.button>
        </motion.div>

        {/* --- More Options Button (Appears on hover) --- */}
        <motion.button
          onClick={handleMoreClick}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white 
                     flex items-center justify-center opacity-0 group-hover:opacity-100 
                     transition-all hover:bg-black/80"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
        >
          <MoreHorizontal size={18} />
        </motion.button>
      </div>

      {/* --- Song Info --- */}
      <div className="w-full text-center px-1">
        <div className="font-bold text-base truncate mb-0.5">
          {song.title}
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {song.artist}
        </div>
      </div>
    </motion.div>
  );
}
