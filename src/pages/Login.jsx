import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx"; // Use the custom hook
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

// --- Icons ---
import { Mail, Lock, Waves, Loader2 } from "lucide-react";

// --- Google Icon SVG (for the button) ---
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.045 0-9.36-3.108-11.423-7.461l-6.571 4.819C9.656 39.663 16.318 44 24 44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C39.099 34.61 44 28.134 44 20c0-1.341-.138-2.65-.389-3.917z"
    ></path>
  </svg>
);

// --- Custom Input Component ---
// This provides the label animation and icon
const Input = ({ register, name, label, error, icon, ...rest }) => (
  <div className="relative w-full">
    <div
      className="flex items-center gap-3 glass border border-white/20 rounded-lg px-3 py-3
                 focus-within:ring-2 focus-within:ring-primary"
    >
      {icon}
      <input
        id={name}
        {...register(name)}
        className="w-full bg-transparent outline-none placeholder:text-transparent peer"
        {...rest}
        placeholder={label} // Placeholder is used for a11y, but hidden by peer-focus
      />
      <label
        htmlFor={name}
        className="absolute left-10 text-muted-foreground transition-all 
                   peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-background px-1
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                   -top-2.5 left-3 text-xs bg-background" // Default state for populated fields
      >
        {label}
      </label>
    </div>
    {error && <p className="text-sm text-red-400 mt-1.5">{error.message}</p>}
  </div>
);

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// --- Main Login Component ---
export default function Login() {
  const { login, loading, googleLogin } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await login(data.email, data.password);
    if (res.ok) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md glass p-8 rounded-xl border border-white/10 shadow-xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <Waves className="mx-auto text-primary" size={40} />
          <h2 className="text-3xl font-bold mt-4">Welcome back to Aura</h2>
          <p className="text-muted-foreground mt-2">
            Sign in to access your music.
          </p>
        </motion.div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <motion.div variants={itemVariants}>
            <Input
              label="Email"
              name="email"
              type="email"
              register={(name) => register(name, {
                required: "Email is required",
              })}
              error={errors.email}
              icon={<Mail size={18} className="text-muted-foreground" />}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              label="Password"
              name="password"
              type="password"
              register={(name) => register(name, {
                required: "Password is required",
              })}
              error={errors.password}
              icon={<Lock size={18} className="text-muted-foreground" />}
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="text-right text-sm"
          >
            <Link
              to="/forgot"
              className="text-primary font-medium transition-all hover:underline"
            >
              Forgot Password?
            </Link>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              className="w-full bg-primary text-black py-3 rounded-lg font-semibold shadow-lg shadow-primary/30
                       flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </motion.button>
          </motion.div>
        </form>

        {/* Divider */}
        <motion.div variants={itemVariants} className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20"></span>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-2 text-muted-foreground">OR</span>
          </div>
        </motion.div>

        {/* Google OAuth Button */}
        <motion.div variants={itemVariants}>
          <motion.button
            onClick={googleLogin}
            className="w-full bg-white/10 border border-white/20 py-3 rounded-lg font-semibold
                     flex items-center justify-center gap-3 transition-colors hover:bg-white/20"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <GoogleIcon />
            Sign in with Google
          </motion.button>
        </motion.div>

        {/* Footer Link */}
        <motion.p
          variants={itemVariants}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-medium transition-all hover:underline"
          >
            Sign Up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
