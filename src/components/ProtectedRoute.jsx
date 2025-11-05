// src/components/ProtectedRoute.jsx

import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Show a loading spinner while AuthContext is checking.
  // This prevents a "flash" of the login page.
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-white">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  // 2. If the user is NOT logged in, redirect to /login.
  // We pass the current 'location' in the state. This tells the
  // login page where to send the user back to after they log in.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If the user is logged in, show the component
  // (e.g., AppLayout, Dashboard, etc.)
  return children;
}