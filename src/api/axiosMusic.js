import axios from "axios";

const baseURL = import.meta.env.VITE_MUSIC_BASE_URL || "http://localhost:3002";

// 1. --- The Fixed Axios Instance ---
const axiosMusic = axios.create({
  baseURL,
  withCredentials: true,
  //
  // --- THIS IS THE CRITICAL FIX ---
  // We REMOVE the default 'Content-Type' header.
  //
  // Why? Axios is smart.
  // 1. If you send a plain object, it automatically sets 'Content-Type: application/json'.
  // 2. If you send a FormData object, it automatically sets 'Content-Type: multipart/form-data'.
  //
  // Your old code forced *everything* to be 'application/json', which breaks file uploads.
  //
});

// 2. --- Modern API Helper Functions ---
// Instead of exporting `axiosMusic`, export an object of pre-built functions.
// This is cleaner, safer, and handles errors in one place.

export const musicApi = {
  /**
   * 🎵 1. Upload a new music track.
   * @param {FormData} formData - The form data containing title, music file, and coverImage file.
   */
  createMusic: async (formData) => {
    try {
      // Axios will correctly set Content-Type to multipart/form-data here
      const response = await axiosMusic.post("/api/music/create", formData);
      return response.data;
    } catch (error) {
      console.error("Error creating music:", error.response?.data || error.message);
      throw error.response?.data || new Error("Failed to create music");
    }
  },

  /**
   * 🎶 2. Fetch all available songs.
   */
  getAllMusic: async () => {
    try {
      const response = await axiosMusic.get("/api/music/get");
      return response.data; // { message, songs }
    } catch (error) {
      console.error("Error fetching music:", error.response?.data || error.message);
      throw error.response?.data || new Error("Failed to fetch music");
    }
  },

  /**
   * 🎧 3. Create a new playlist.
   * @param {object} playlistData - Data for the new playlist.
   * @param {string} playlistData.name - The name of the playlist.
   * @param {string} playlistData.description - Short description.
   * @param {string[]} playlistData.songs - Array of song IDs.
   */
  createPlaylist: async (playlistData) => {
    try {
      // Axios will correctly set Content-Type to application/json here
      const response = await axiosMusic.post("/api/music/playlist/create", playlistData);
      return response.data;
    } catch (error) {
      console.error("Error creating playlist:", error.response?.data || error.message);
      throw error.response?.data || new Error("Failed to create playlist");
    }
  },

  /**
   * 🎵 4. Fetch all playlists or a single playlist by ID.
   * @param {string} [playlistId] - Optional ID to fetch a specific playlist.
   */
  getPlaylists: async (playlistId) => {
    try {
      // Use the 'params' config to automatically add the query string if playlistId exists
      const config = {
        params: playlistId ? { playlistId } : {},
      };
      const response = await axiosMusic.get("/api/music/playlist/get", config);
      return response.data;
    } catch (error) {
      console.error("Error fetching playlists:", error.response?.data || error.message);
      throw error.response?.data || new Error("Failed to fetch playlists");
    }
  },
};

// You can still export the base instance if you need it for one-off calls
export default axiosMusic;