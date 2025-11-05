import React from "react";
import { useForm } from "react-hook-form";
import axiosAuth from "../api/axiosAuth";
import toast from "react-hot-toast";

export default function ResetPassword(){
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await axiosAuth.post("/api/auth/reset-password", data);
      toast.success("Password reset successful");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error");
    }
  };

  return (
    <div className="max-w-md mx-auto glass p-6 rounded">
      <h2 className="text-xl">Reset Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register("email")} placeholder="Email" className="w-full p-3 rounded bg-transparent border border-white/5" />
        <input {...register("otp")} placeholder="OTP" className="w-full p-3 rounded bg-transparent border border-white/5" />
        <input {...register("newPassword")} placeholder="New password" type="password" className="w-full p-3 rounded bg-transparent border border-white/5" />
        <button className="bg-primary px-4 py-2 rounded text-black">Reset</button>
      </form>
    </div>
  );
}
