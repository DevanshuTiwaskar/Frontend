import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { musicApi } from "../api/axiosMusic.js";
import { motion } from "framer-motion";
import { Plus, Music, ServerCrash } from "lucide-react";
import { useModalStore } from "../store/useModalStore.js";
import toast from "react-hot-toast";

// Card for the "Create Playlist" button
const CreatePlaylistCard = () => {
  const { openPlaylistModal } = useModalStore();
  return (
    <motion.button
      onClick={openPlaylistModal}
      className="glass p-4 rounded-xl flex flex-col items-center justify-center 
                 gap-3 aspect-square text-muted-foreground
                 border-2 border-dashed border-white/20 transition-all
                 hover:border-white/50 hover:text-white"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <Plus size={32} />
      <span className="font-semibold text-sm">Create New Playlist</span>
    </motion.button>
  );
};

// Card for an existing playlist
const PlaylistCard = ({ playlist }) => {
  console.log(playlist._id)
  const navigate = useNavigate();
  return (
    <motion.div
      onClick={() => navigate(`/playlist/${playlist._id}`)}
      className="glass p-4 rounded-xl cursor-pointer"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="w-full aspect-square mb-3 rounded-lg bg-white/10 
                      flex items-center justify-center">
        <Music size={48} className="text-white/30" />
      </div>
      <h3 className="font-semibold truncate">{playlist.name}</h3>
      <p className="text-sm text-muted-foreground truncate">
        {playlist.songs.length} songs
      </p>
    </motion.div>
  );
};

// Skeleton Card
const SkeletonCard = () => (
  <div className="glass p-4 rounded-xl animate-pulse">
    <div className="w-full aspect-square mb-3 rounded-lg bg-white/10"></div>
    <div className="w-3/4 h-4 bg-white/10 rounded mb-1.5"></div>
    <div className="w-1/2 h-3 bg-white/10 rounded"></div>
  </div>
);

export default function Library() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await musicApi.getPlaylists();
        setPlaylists(data.playlists || []);
      } catch (err) {
        setError("Failed to fetch library");
        toast.error("Failed to fetch your library.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <CreatePlaylistCard />
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </>
      );
    }

    if (error) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center text-center py-20">
          <ServerCrash size={48} className="mx-auto text-red-400" />
          <h2 className="mt-4 text-2xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      );
    }

    return (
      <>
        <CreatePlaylistCard />
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist._id} playlist={playlist} />
        ))}
      </>
    );
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-6">Your Library</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {renderContent()}
      </div>
    </div>
  );
}