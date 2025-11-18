import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

/**
 * PlaylistCard - shows a larger artwork with hover glow and compact metadata
 */
export default function PlaylistCard({ playlist }) {
  const cover = playlist.songs?.[0]?.coverImageUrl;
  const pid = playlist.id || playlist._id;
  const title = playlist.name;
  const subtitle = playlist.songs?.length ? `${playlist.songs.length} songs` : "No songs";

  return (
    <Link to={`/playlist/${pid}`}>
      <motion.div
        whileHover={{ translateY: -6, boxShadow: "0 14px 40px rgba(75,111,245,0.14)" }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="relative p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-white/6 cursor-pointer overflow-hidden"
      >
        <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3">
          {cover ? (
            <img
              src={cover}
              alt={title}
              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
              onError={(e) =>
                (e.currentTarget.src =
                  `https://placehold.co/300x300/27272a/71717a?text=${encodeURIComponent(title?.charAt(0) || "?")}`)
              }
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/6">
              <div className="text-muted text-2xl">{title?.charAt(0) || "?"}</div>
            </div>
          )}

          {/* Play overlay button (visual) */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
          >
            <div className="play-outer">
              <div className="play-center">
                <Play size={20} className="text-black" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="text-left">
          <div className="font-semibold truncate">{title}</div>
          <div className="text-sm text-muted truncate">{subtitle}</div>
        </div>
      </motion.div>
    </Link>
  );
}
