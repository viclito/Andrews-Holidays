"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

type LoginValues = {
  email: string;
  password: string;
};

export function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginValues>();

  const onSubmit = async (values: LoginValues) => {
    setError(null);
    const callbackUrl = searchParams.get("callbackUrl") || "/customer/dashboard";

    const response = await signIn("customer-credentials", {
      ...values,
      redirect: false,
      callbackUrl,
    });

    if (response?.error) {
      setError("Invalid credentials");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md rounded-[32px] border border-slate-100 bg-white p-8 shadow-soft"
    >
      <h1 className="text-3xl font-display text-midnight">Welcome Back</h1>
      <p className="mt-2 text-sm text-slate-500">
        Sign in to view your bookings and inquiries
      </p>

      {error && (
        <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            {...register("email", { required: true })}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            {...register("password", { required: true })}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-full bg-primary-600 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>

      <p className="mt-4 text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <Link href="/customer/register" className="font-semibold text-primary-600">
          Create one
        </Link>
      </p>
    </form>
  );
}
