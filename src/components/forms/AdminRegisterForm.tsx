"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

type RegisterValues = {
  name: string;
  email: string;
  password: string;
  otp: string;
};

export function AdminRegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterValues>();

  const onInitiate = async (values: RegisterValues) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post("/api/admin/register/initiate", {
        name: values.name,
        email: values.email,
      });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to initiate registration");
    } finally {
      setLoading(false);
    }
  };

  const onComplete = async (values: RegisterValues) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post("/api/admin/register/complete", {
        name: values.name,
        email: values.email,
        password: values.password,
        otp: values.otp,
      });
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to complete registration");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (values: RegisterValues) => {
    if (step === 1) {
      onInitiate(values);
    } else {
      onComplete(values);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md rounded-[32px] border border-slate-100 bg-white p-8 shadow-soft"
    >
      <h1 className="text-3xl font-display text-midnight">Admin Registration</h1>
      <p className="mt-2 text-sm text-slate-500">
        {step === 1
          ? "Enter your details to request access."
          : "Enter the OTP sent to the administrator."}
      </p>

      <div className="mt-6 space-y-4">
        {step === 1 && (
          <>
            <div>
              <label className="text-sm font-semibold text-slate-700">Name</label>
              <input
                type="text"
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 chars" } })}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <div>
            <label className="text-sm font-semibold text-slate-700">OTP</label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="Enter 6-digit OTP"
              {...register("otp", { required: "OTP is required" })}
            />
            {errors.otp && (
              <p className="mt-1 text-xs text-red-500">{errors.otp.message}</p>
            )}
            <p className="mt-2 text-xs text-slate-500">
              OTP has been sent to berglin1998@gmail.com
            </p>
          </div>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-midnight py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Processing..." : step === 1 ? "Next" : "Register"}
      </button>

      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm text-slate-500 hover:text-midnight">
          Already have an account? Login
        </Link>
      </div>
    </form>
  );
}
