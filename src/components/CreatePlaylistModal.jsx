import React from "react";
import { musicApi } from "../api/axiosMusic.js";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useModalStore } from "../store/useModalStore.js";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  visible: { opacity: 1, y: 0, scale: 1 },
  hidden: { opacity: 0, y: "50px", scale: 0.95 },
};

export default function CreatePlaylistModal() {
  console.log('create playlist page')
  // ✅ FIX: use correct Zustand values
  const { isCreatePlaylistOpen, closeCreatePlaylist } = useModalStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const playlistData = {
        name: data.name,
        description: data.description,
        songs: data.songs
          ? data.songs.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      await musicApi.createPlaylist(playlistData);

      toast.success("Playlist created successfully!");
      reset();
      closeCreatePlaylist(); // ✅ FIX: use correct close function
    } catch (err) {
      toast.error(err.message || "Failed to create playlist.");
    }
  };

  return (
    <AnimatePresence>
      {isCreatePlaylistOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeCreatePlaylist}
          ></div>

          {/* Modal */}
          <motion.div
            className="glass relative z-10 w-full max-w-md rounded-xl border border-white/10 p-6"
            variants={modalVariants}
          >
            <button
              onClick={closeCreatePlaylist}
              className="absolute top-3 right-3 p-1 rounded-full text-muted-foreground transition-colors hover:bg-white/10"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-4">Create New Playlist</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Playlist Name */}
              <div>
                <input
                  {...register("name", { required: "Playlist name is required" })}
                  placeholder="Playlist name"
                  className="w-full p-3 rounded-lg bg-transparent border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <input
                  {...register("description")}
                  placeholder="Description (optional)"
                  className="w-full p-3 rounded-lg bg-transparent border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              {/* Song IDs */}
              <div>
                <input
                  {...register("songs")}
                  placeholder="Song IDs (e.g., id1, id2, id3)"
                  className="w-full p-3 rounded-lg bg-transparent border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary px-5 py-3 rounded-lg text-black font-semibold transition-all hover:bg-primary/90 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Playlist"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
