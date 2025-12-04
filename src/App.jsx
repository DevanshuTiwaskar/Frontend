// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
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
import GoogleCallback from "./pages/GoogleCallback.jsx";
import Library from "./pages/Library.jsx";

// New Artist page import
import ArtistDashboard from "./pages/ArtistDashboard.jsx";

// Component Imports
import Navbar from "./components/Navbar.jsx";
import Player from "./components/Player.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MainLayout from "./components/MainLayout.jsx";

/**
 * ProtectedLayout
 * A small wrapper that composes ProtectedRoute + MainLayout + Outlet so we can
 * define protected child routes just once.
 */
function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <MainLayout>
        {/* child protected routes render here */}
        <Outlet />
      </MainLayout>
    </ProtectedRoute>
  );
}

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

          {/* Protected routes grouped under ProtectedLayout */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlist/:id" element={<PlaylistPage />} />
            <Route path="/library" element={<Library />} />

            <Route path="/artist/dashboard" element={<ArtistDashboard />} />
            {/* Artist Dashboard - protected */}
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Persistent Player */}
      {currentSong && (
        <Player songToPlay={currentSong} onPlayNext={playNext} onPlayPrev={playPrev} />
      )}
    </div>
  );
}
