import React from "react";
import { useForm } from "react-hook-form";
import axiosAuth from "../api/axiosAuth";
import toast from "react-hot-toast";

export default function ForgotPassword(){
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await axiosAuth.post("/api/auth/forgot-password", { email: data.email });
      toast.success("OTP sent to your email");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error");
    }
  };

  return (
    <div className="max-w-md mx-auto glass p-6 rounded">
      <h2 className="text-xl">Forgot Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register("email")} placeholder="Email" className="w-full p-3 rounded bg-transparent border border-white/5" />
        <button className="bg-primary px-4 py-2 rounded text-black">Send OTP</button>
      </form>
    </div>
  );
}
