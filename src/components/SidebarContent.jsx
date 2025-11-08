import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Search, Library, Plus, Music2, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { musicApi } from "../api/axiosMusic.js";
import { useModalStore } from "../store/useModalStore.js";

const NavItem = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "bg-white/10 text-white"
          : "text-muted-foreground hover:text-white"
      }`
    }
  >
    {icon}
    <span>{children}</span>
  </NavLink>
);

const PlaylistLink = ({ playlist }) => {
  const pid = playlist.id || playlist._id;
  return (
    <NavLink
      to={`/playlist/${pid}`}
      className={({ isActive }) =>
        `block w-full text-left px-4 py-1.5 text-sm truncate rounded transition-colors ${
          isActive ? "text-primary" : "text-muted-foreground hover:text-white"
        }`
      }
    >
      {playlist.name}
    </NavLink>
  );
};

export default function SidebarContent() {
  const { openCreatePlaylist } = useModalStore();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const data = await musicApi.getPlaylists();
        setPlaylists(data.playlists || []);
      } catch (error) {
        console.error("Failed to fetch playlists for sidebar:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  return (
    <>
      {/* Main Nav */}
      <nav className="flex flex-col gap-1.5 mb-6 px-4">
        <NavItem to="/dashboard" icon={<Home size={20} />}>
          Discover
        </NavItem>
        <NavItem to="/search" icon={<Search size={20} />}>
          Search
        </NavItem>
        <NavItem to="/library" icon={<Library size={20} />}>
          Your Library
        </NavItem>
      </nav>

      {/* Playlist Section */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            Playlists
          </h2>
          <motion.button
            onClick={openCreatePlaylist}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 rounded-md text-muted-foreground transition-colors hover:text-white hover:bg-white/10"
            title="Create new playlist"
          >
            <Plus size={16} />
          </motion.button>
        </div>

        <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1">
          <div className="px-4">
            <NavItem to="/collection/liked" icon={<Heart size={20} />}>
              Liked Songs
            </NavItem>
            <NavItem to="/collection/uploads" icon={<Music2 size={20} />}>
              My Uploads
            </NavItem>
          </div>

          <hr className="border-white/10 my-2" />

          <div className="px-4 space-y-1.5">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading playlists...</div>
            ) : playlists.length > 0 ? (
              playlists.map((playlist) => (
                <PlaylistLink key={playlist.id || playlist._id} playlist={playlist} />
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No playlists found</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
