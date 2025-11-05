// src/components/AppLayout.jsx

import React from "react";
import { Outlet } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext.jsx";

// Components
import Navbar from "./Navbar";
import Sidebar from "./Sidebar.jsx";
import Player from "./Player";
import CreatePlaylistModal from "./CreatePlaylistModal.jsx";
import MobileSidebar from "./MobileSidebar.jsx"; // ⭐ 1. Import the new mobile menu

export default function AppLayout() {
  const { currentSong, playNext, playPrev } = usePlayer();
  // We don't need useModalStore here anymore, components manage it

  return (
    <div className="h-screen w-full flex flex-col bg-background text-white overflow-hidden">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {currentSong && (
        <Player
          songToPlay={currentSong}
          onPlayNext={playNext}
          onPlayPrev={playPrev}
        />
      )}
      
      {/* These components are modals, they float above everything */}
      <CreatePlaylistModal />
      <MobileSidebar /> {/* ⭐ 2. Render the mobile menu here */}
    </div>
  );
}