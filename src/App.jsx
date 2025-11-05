// src/App.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts & Pages
import AppLayout from "./components/AppLayout.jsx";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard.jsx";
import Library from "./pages/Library.jsx";
import GoogleCallback from "./pages/GoogleCallback.jsx"; // Make sure this path is correct

// Components
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      {/* === PUBLIC ROUTES === */}
      {/* These routes are for unauthenticated users */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="/google-callback" element={<GoogleCallback />} />

      {/* === PROTECTED APP ROUTES === */}
      {/*
        * This is the fix:
        * This parent <Route> has NO path. It just provides the
        * <ProtectedRoute> and <AppLayout> shell for all the
        * child routes nested inside it.
      */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/*
          * These child routes will render inside AppLayout's <Outlet />
          * Their paths are now relative to the root.
        */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/library" element={<Library />} />
        
        {/* Add your other protected routes here: */}
        {/* <Route path="/search" element={<SearchPage />} /> */}
        {/* <Route path="/playlist/:id" element={<ViewPlaylistPage />} /> */}
      </Route>

      {/* === FALLBACK ROUTE === */}
      {/* Any route not matched above redirects to the landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}