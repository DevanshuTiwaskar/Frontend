import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { usePlayer } from "./context/PlayerContext.jsx";

// Page Imports
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PlaylistPage from "./pages/PlaylistPage.jsx";
import Playlists from "./pages/Playlists.jsx";
import CreatePlaylist from "./components/CreatePlaylistModal.jsx";
import GoogleCallback from "./pages/GoogleCallback.jsx";
import MainLayout from "./components/MainLayout";

// Component Imports
import Navbar from "./components/Navbar.jsx";
import Player from "./components/Player.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  const { currentSong, playNext, playPrev } = usePlayer();

  return (
    <div className="min-h-screen flex flex-col bg-background text-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/google-callback" element={<GoogleCallback />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlists"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Playlists />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlist/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <PlaylistPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-playlist"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CreatePlaylist />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Persistent Player */}
      {currentSong && (
        <Player
          songToPlay={currentSong}
          onPlayNext={playNext}
          onPlayPrev={playPrev}
        />
      )}
    </div>
  );
}
