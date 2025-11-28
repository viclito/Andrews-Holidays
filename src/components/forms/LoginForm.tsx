"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type LoginValues = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setError(null);
    const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
    const response = await signIn("admin-credentials", {
      ...values,
      redirect: false,
      callbackUrl,
    });

    if (response?.error) {
      setError("Invalid credentials");
      return;
    }

    router.push(callbackUrl);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md rounded-[32px] border border-slate-100 bg-white p-8 shadow-soft"
    >
      <h1 className="text-3xl font-display text-midnight">Agency Console</h1>
      <p className="mt-2 text-sm text-slate-500">
        Use the credentials shared by the Andrews Holiday onboarding team.
      </p>
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
          <label className="text-sm font-semibold text-slate-700">
            Password
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            {...register("password", { required: true })}
          />
        </div>
      </div>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-full bg-midnight py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
      <div className="mt-4 text-center">
        <Link href="/admin/register" className="text-sm text-slate-500 hover:text-midnight">
          Register as Admin
        </Link>
      </div>
    </form>
  );
}
