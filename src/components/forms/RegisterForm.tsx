"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

type RegisterValues = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterValues>();

  const onSubmit = async (values: RegisterValues) => {
    setError(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/customer/login");
      }, 2000);
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md rounded-[32px] border border-slate-100 bg-white p-8 shadow-soft"
    >
      <h1 className="text-3xl font-display text-midnight">Create Account</h1>
      <p className="mt-2 text-sm text-slate-500">
        Register to track your bookings and inquiries
      </p>

      {success && (
        <div className="mt-4 rounded-2xl bg-green-50 p-4 text-sm text-green-700">
          Registration successful! Redirecting to login...
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700">Full Name</label>
          <input
            type="text"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            {...register("name", { required: true })}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            {...register("email", { required: true })}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Phone (Optional)</label>
          <input
            type="tel"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            {...register("phone")}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            {...register("password", { required: true, minLength: 6 })}
          />
          <p className="mt-1 text-xs text-slate-500">Minimum 6 characters</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || success}
        className="mt-6 w-full rounded-full bg-primary-600 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? "Creating account..." : "Create Account"}
      </button>

      <p className="mt-4 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/customer/login" className="font-semibold text-primary-600">
          Sign in
        </Link>
      </p>
    </form>
  );
}
