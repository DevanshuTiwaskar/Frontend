import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { musicApi } from "../api/axiosMusic.js";
import {
  ListMusic,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  Search,
} from "lucide-react";

// ===============================================
// 🔹 MAIN LAYOUT COMPONENT
// ===============================================
export default function MainLayout({ children }) {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex gap-2 h-[calc(100vh-160px)]">
        {/* Sidebar */}
        <Sidebar />
 
        {/* Main Scrollable Content */}
        <main className="flex-1 glass rounded-xl overflow-y-auto">
          <StickyHeader />
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

// ===============================================
// 🔹 SIDEBAR COMPONENT (Dynamic Playlist Fetch)
// ===============================================
function Sidebar() {
  const [filter, setFilter] = useState("Playlists");
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch playlists when Sidebar mounts
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const data = await musicApi.getPlaylists();
        console.log("🎵 Sidebar Playlists:", data.playlists);
        setPlaylists(data.playlists || []);
      } catch (error) {
        console.error("❌ Failed to fetch playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <aside className="w-full max-w-xs flex-shrink-0 glass rounded-xl p-4 flex flex-col gap-4">
      {/* Top Nav */}
      <nav className="space-y-2">
        <Link
          to="/dashboard"
          className="flex items-center gap-4 text-white font-bold p-2 rounded-lg"
        >
          <Home size={24} />
          <span>Home</span>
        </Link>
        <Link
          to="/search"
          className="flex items-center gap-4 text-muted-foreground font-bold p-2 rounded-lg transition-colors hover:text-white"
        >
          <Search size={24} />
          <span>Search</span>
        </Link>
      </nav>

      {/* Library Section */}
      <div className="glass rounded-xl p-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/playlists"
            className="flex items-center gap-2 text-muted-foreground font-bold transition-colors hover:text-white cursor-pointer"
          >
            <ListMusic size={24} />
            <span>Your Library</span>
          </Link>

          {/* Add Playlist Button */}
          <Link to="/create-playlist">
            <motion.div
              className="p-2 rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus size={20} />
            </motion.div>
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-4">
          {["Playlists", "Artists", "Albums"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors
                ${
                  filter === f
                    ? "bg-primary text-black"
                    : "bg-white/10 hover:bg-white/20"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Playlist List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {/* Always show Liked Songs */}
          <PlaylistItem
            title="Liked Songs"
            icon={<Heart fill="currentColor" />}
            subtitle="Playlist • Auto-generated"
          />

          {/* Divider */}
          <hr className="border-white/10 my-2" />

          {/* Show dynamic playlists */}
          {loading ? (
            <p className="text-sm text-muted-foreground px-2">Loading playlists...</p>
          ) : playlists.length > 0 ? (
            playlists.map((playlist) => (
              <Link key={playlist.id} to={`/playlist/${playlist.id}`}>
                <PlaylistItem
                  title={playlist.name}
                  subtitle={`By ${playlist.createdBy?.fullName?.firstName || "User"}`}
                  imageUrl={
                    playlist.songs?.[0]?.coverImageUrl ||
                    "https://cdn-icons-png.flaticon.com/512/726/726107.png"
                  }
                />
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground px-2">
              No playlists found
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

// ===============================================
// 🔹 PLAYLIST ITEM COMPONENT
// ===============================================
function PlaylistItem({ title, subtitle, imageUrl, icon }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:bg-white/10">
      {icon ? (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white">
          {icon}
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={title}
          className="w-12 h-12 rounded-lg object-cover"
        />
      )}
      <div>
        <div className="font-semibold truncate">{title}</div>
        <div className="text-sm text-muted-foreground truncate">{subtitle}</div>
      </div>
    </div>
  );
}

// ===============================================
// 🔹 STICKY HEADER COMPONENT
// ===============================================
function StickyHeader() {
  const { user } = useAuth();
  const displayName = user?.fullName?.firstName || user?.username;
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 p-4 glass flex items-center justify-between border-b border-white/10">
      <div className="flex gap-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-black/30 hover:bg-black/50"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => navigate(1)}
          className="p-2 rounded-full bg-black/30 hover:bg-black/50"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <motion.button
          className="text-sm font-bold bg-white text-black px-4 py-2 rounded-full hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Premium
        </motion.button>
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center font-semibold text-sm text-primary">
          {displayName ? displayName.charAt(0).toUpperCase() : <User size={16} />}
        </div>
      </div>
    </header>
  );
}
