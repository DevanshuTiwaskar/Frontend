// src/store/useModalStore.js

import { create } from 'zustand';

export const useModalStore = create((set) => ({
  // --- Playlist Modal State ---
  isPlaylistModalOpen: false,
  openPlaylistModal: () => set({ isPlaylistModalOpen: true }),
  closePlaylistModal: () => set({ isPlaylistModalOpen: false }),

  // --- ⭐ NEW: Mobile Menu State ---
  isMobileMenuOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));