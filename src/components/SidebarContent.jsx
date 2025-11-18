import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Search, Library, Plus, Music2, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { musicApi } from "../api/axiosMusic.js";
import { useModalStore } from "../store/useModalStore.js";

const NavItem = ({ to, icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isActive ? "bg-white/6 text-white" : "text-muted hover:text-white"
      }`
    }
  >
    {icon}
    <span>{children}</span>
  </NavLink>
);

const PlaylistLink = ({ playlist, onClick }) => {
  const pid = playlist.id || playlist._id;
  const cover = playlist.songs?.[0]?.coverImageUrl;

  return (
    <NavLink
      to={`/playlist/${pid}`}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
         ${isActive ? "bg-white/4 text-white" : "text-muted hover:text-white"}`
      }
    >
      <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-white/6">
        {cover ? (
          <img
            src={cover}
            alt={playlist.name}
            className="w-full h-full object-cover"
            onError={(e) =>
              (e.currentTarget.src =
                "https://placehold.co/60x60/27272a/71717a?text=?")
            }
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <Music2 size={18} />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="font-medium text-sm truncate">{playlist.name}</div>
        <div className="text-xs text-muted truncate">{playlist.createdBy?.fullName?.firstName || "User"}</div>
      </div>
    </NavLink>
  );
};

export default function SidebarContent({ onItemClick }) {
  const openCreatePlaylist = useModalStore((s) => s.openCreatePlaylist);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await musicApi.getPlaylists();
        if (!mounted) return;
        setPlaylists(data.playlists || []);
      } catch (err) {
        console.error("Failed to load playlists:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Top nav */}
      <nav className="px-2">
        <NavItem to="/dashboard" icon={<Home size={18} />} onClick={onItemClick}>
          Discover
        </NavItem>
        <NavItem to="/search" icon={<Search size={18} />} onClick={onItemClick}>
          Search
        </NavItem>
        <NavItem to="/library" icon={<Library size={18} />} onClick={onItemClick}>
          Your Library
        </NavItem>
      </nav>

      {/* Playlists header */}
      <div className="px-3">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-semibold uppercase text-muted tracking-wide">Playlists</h3>
          <motion.button
            title="Create playlist"
            onClick={() => {
              openCreatePlaylist();
              if (onItemClick) onItemClick();
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="p-1.5 rounded-md text-muted hover:text-white hover:bg-white/6"
          >
            <Plus size={16} />
          </motion.button>
        </div>

        <div className="rounded-lg panel p-2">
          {/* Quick links */}
          <div className="mb-3">
            <NavItem to="/collection/liked" icon={<Heart size={16} />} onClick={onItemClick}>
              Liked Songs
            </NavItem>
            <NavItem to="/collection/uploads" icon={<Music2 size={16} />} onClick={onItemClick}>
              My Uploads
            </NavItem>
          </div>

          <hr className="border-white/6 my-2" />

          {/* Playlists list */}
          <div className="flex flex-col gap-1">
            {loading ? (
              <div className="text-sm text-muted px-2">Loading playlists…</div>
            ) : playlists.length > 0 ? (
              playlists.map((p) => (
                <PlaylistLink key={p.id || p._id} playlist={p} onClick={onItemClick} />
              ))
            ) : (
              <div className="text-sm text-muted px-2">No playlists found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
