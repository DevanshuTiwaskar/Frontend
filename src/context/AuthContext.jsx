import  { createContext, useState,  useContext } from "react";
import axiosAuth from "../api/axiosAuth";
import toast from "react-hot-toast";

export const AuthContext = createContext();

// Helper hook for easy access
export const useAuth = () => {
 return useContext(AuthContext);
};

// Get base URL for Google Login
const baseURL = import.meta.env.VITE_AUTH_BASE_URL || "http://localhost:3000";

export const AuthProvider = ({ children }) => {
 // Initialize user state from localStorage
 const [user, setUser] = useState(() => {
  try {
   const raw = localStorage.getItem("user");
   return raw ? JSON.parse(raw) : null;
  } catch {
 return null;
  }
 });
 
 const [loading, setLoading] = useState(false);

 // --- 🛑 NO TOKEN STATE NEEDED ---
 // The browser manages the httpOnly cookie automatically.

 const login = async (email, password) => {
  setLoading(true);
  try {
   // Backend returns the user object on success
   const res = await axiosAuth.post("/api/auth/login", { email, password });
   const { user } = res.data; 

   // Save user to localStorage and state
   localStorage.setItem("user", JSON.stringify(user));
   setUser(user);
   
   toast.success("Logged in successfully!");
   return { ok: true };
  } catch (err) {
   toast.error(err?.response?.data?.message || "Login failed");
   return { ok: false, err };
  } finally {
   setLoading(false);
  }
 };

 const register = async (payload) => {
  setLoading(true);
  try {
   // Per your backend, register *also* logs the user in (sets cookie)
   // and returns the user object.
   const res = await axiosAuth.post("/api/auth/register", payload);
   const { user } = res.data;

   // Save user to localStorage and state
   localStorage.setItem("user", JSON.stringify(user));
   setUser(user);

   toast.success("Registered successfully!");
   return { ok: true, data: res.data };
  } catch (err) {
   toast.error(err?.response?.data?.message || "Registration failed");
   return { ok: false, err };
  } finally { 
   setLoading(false); 
  }
 };

 const logout = async () => {
  try {
   // Call backend to clear the httpOnly cookie
   // (Endpoint is based on your backend 'logoutUser' function)
   await axiosAuth.post("/api/auth/logout"); 
  } catch (e) {
   console.error("Logout failed:", e); // Still log out client-side
  }
  // Clear user from localStorage and state
  localStorage.removeItem("user");
  setUser(null);
  toast.success("Logged out");
 };

 const forgotPassword = async (email) => {
  setLoading(true);
  try {
   // (Using route from your previous spec)
   await axiosAuth.post("/api/auth/forgot-password", { email });
   toast.success("If email is valid, an OTP will be sent.");
   return { ok: true };
  } catch (err) {
   toast.error(err?.response?.data?.message || "Failed to send OTP");
   return { ok: false, err };
  } finally {
   setLoading(false);
  }
 };

 const resetPassword = async (email, otp, newPassword) => {
  setLoading(true);
  try {
   // (Using route from your previous spec, which maps to your
   // 'verifyForgotPassword' controller)
   await axiosAuth.post("/api/auth/reset-password", { email, otp, newPassword });
   toast.success("Password reset! Please login.");
   return { ok: true };
  } catch (err) {
   toast.error(err?.response?.data?.message || "Password reset failed");
   return { ok: false, err };
  } finally {
   setLoading(false);
  }
 };

 const googleLogin = () => {
  // This just starts the redirect flow.
  window.location.href = `${baseURL}/api/auth/google`;
 };
 
 // Note: Your Google OAuth flow will redirect to your backend,
 // which sets the cookie. Your backend *must* then redirect
 // back to your frontend (e.g., 'http://localhost:5173/google-callback').
 // You'll need a component at that route to fetch the user
 // (or just redirect to the dashboard, since the login is complete).

// ⭐ --- NEW FUNCTION --- ⭐
  // This function uses the cookie to fetch the user data
  const fetchAndSetUser = async () => {
    try {
      // This new endpoint must be created on your backend
      const res = await axiosAuth.get("/api/auth/me");
      const { user } = res.data;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        return { ok: true };
      }
    } catch (err) {
      // This is expected if no valid cookie is found
      localStorage.removeItem("user");
      setUser(null);
      return { ok: false };
    }
  };


 return (
  <AuthContext.Provider value={{
   user,
   loading,
   login,
   logout,
   register,
   forgotPassword,
   resetPassword,
   googleLogin,
   fetchAndSetUser,
  }}>
   {children}
  </AuthContext.Provider>
 );
};