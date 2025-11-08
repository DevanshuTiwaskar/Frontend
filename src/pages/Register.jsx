// src/pages/Register.jsx

import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

// --- Icons ---
import { User, Mail, Lock, Waves, Loader2, Check } from "lucide-react"; // ⭐ 1. Added Check icon

// --- Google Icon SVG (for the button) ---
const GoogleIcon = () => (
  // ... (SVG code is unchanged)
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

// --- ⭐ 2. FIXED Custom Input Component ---
// Now accepts a 'rules' prop for validation
const Input = ({ register, name, label, error, icon, rules = {}, ...rest }) => (
  <div className="space-y-1.5 w-full">
    <label htmlFor={name} className="text-sm font-medium text-muted-foreground">
      {label}
    </label>
    <div
      className="flex items-center gap-3 glass border border-white/20 rounded-lg px-3 
                 focus-within:ring-2 focus-within:ring-primary"
    >
      {icon}
      <input
        id={name}
        {...register(name, rules)} 
        className="w-full py-3 bg-transparent outline-none"
        {...rest}
      />
    </div>
    {error && <p className="text-sm text-red-400">{error.message}</p>}
  </div>
);

// --- ⭐ 3. NEW Custom Checkbox Component ---
// Styled to match your modern, premium UI
const Checkbox = ({ register, name, label, description }) => (
  <div className="flex items-start gap-3.5">
    {/* Custom styled checkbox */}
    <div className="relative flex mt-0.5">
      <input
        id={name}
        type="checkbox"
        {...register(name)}
        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md
                   border border-white/30 bg-transparent
                   checked:bg-primary checked:border-primary
                   focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
      />
      <Check
        className="absolute top-0.5 left-0.5 h-4 w-4
                   pointer-events-none text-black
                   opacity-0 peer-checked:opacity-100 transition-opacity"
      />
    </div>
    {/* Labels */}
    <div className="grid gap-0.5">
      <label htmlFor={name} className="text-sm font-medium leading-none text-white cursor-pointer">
        {label}
      </label>
      <p className="text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  </div>
);


// --- Main Register Component ---
export default function Register() {
  const { register: registerUser, loading, googleLogin } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // --- ⭐ 4. FIXED onSubmit Handler ---
  // Now builds the payload correctly based on the 'isArtist' checkbox
  const onSubmit = async (data) => {
    // 1. Create the base payload from form data
    const payload = {
      username: data.username,
      email: data.email,
      password: data.password,
      fullName: data.fullName,
    };

    // 2. Conditionally add the artist role if the box was checked
    if (data.isArtist) {
      payload.role = "artist";
    }
    
    // 3. Send the correct payload to the backend
    const res = await registerUser(payload);
    
    if (res.ok) {
       setTimeout(() => navigate("/dashboard"), 300);
    }
  };

  return (
    <motion.div
      className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-lg glass p-8 rounded-xl border border-white/10 shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Waves className="mx-auto text-primary" size={40} />
          <h2 className="text-3xl font-bold mt-4">Create your Aura account</h2>
          <p className="text-muted-foreground mt-2">
            Start listening to your music, anywhere.
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              label="First Name"
              name="fullName.firstName"
              register={register} // <-- Correct: Just pass the function
              error={errors.fullName?.firstName}
              icon={<User size={18} className="text-muted-foreground" />}
              placeholder="John"
            />
            <Input
              label="Last Name"
              name="fullName.lastName"
              register={register}
              error={errors.fullName?.lastName}
              icon={<User size={18} className="text-muted-foreground" />}
              placeholder="Doe"
            />
          </div>

          <Input
            label="Username"
            name="username"
            register={register}
            rules={{ required: "Username is required" }}
            error={errors.username}
            icon={<User size={18} className="text-muted-foreground" />}
            placeholder="john_doe"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            register={register}
            rules={{ required: "Email is required" }}
            error={errors.email}
            icon={<Mail size={18} className="text-muted-foreground" />}
            placeholder="john@example.com"
          />

          {/* ⭐ 5. FIXED Password Input Validation */}
          <Input
            label="Password"
            name="password"
            type="password"
            register={register} // <-- Just pass the function
            rules={{ // <-- Pass validation rules here
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" }
            }}
            error={errors.password}
            icon={<Lock size={18} className="text-muted-foreground" />}
            placeholder="••••••••"
          />

          {/* ⭐ 6. NEW Artist Checkbox */}
          <Checkbox
            name="isArtist"
            register={register}
            label="I am an Artist"
            description="Select this to upload your own music."
          />

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full bg-primary text-black py-3 rounded-lg font-semibold shadow-lg shadow-primary/30
                       flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-4" // Added margin-top
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20"></span>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-2 text-muted-foreground">OR</span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <motion.button
          onClick={googleLogin}
          className="w-full bg-white/10 border border-white/20 py-3 rounded-lg font-semibold
                     flex items-center justify-center gap-3 transition-colors hover:bg-white/20"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <GoogleIcon />
          Sign up with Google
        </motion.button>

        {/* Footer Link */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium transition-all hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </motion.div>
  );
}