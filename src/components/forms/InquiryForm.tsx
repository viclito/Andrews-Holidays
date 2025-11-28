"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const schema = z.object({
  fullName: z.string().min(3, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please add a short brief"),
});

type InquiryFormProps = {
  packageId?: string;
  packageTitle?: string;
};

type FormValues = z.infer<typeof schema>;

export function InquiryForm({ packageId, packageTitle }: InquiryFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/customer/login?callbackUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [status, router]);

  // Autofill name and email when session is available
  useEffect(() => {
    if (session?.user) {
      if (session.user.name) {
        setValue("fullName", session.user.name);
      }
      if (session.user.email) {
        setValue("email", session.user.email);
      }
    }
  }, [session, setValue]);

  const onSubmit = async (values: FormValues) => {
    setFormStatus("idle");
    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, packageId, packageTitle }),
    });

    if (response.ok) {
      setFormStatus("success");
      reset();
    } else {
      setFormStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft"
    >
      <div>
        <label className="text-sm font-semibold text-slate-700">Full name</label>
        <input
          className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none"
          placeholder="Ananya Rao"
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <input
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none"
            placeholder="you@agency.com"
            type="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Phone</label>
          <input
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none"
            placeholder="+91 98765 43210"
            {...register("phone")}
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-700">Brief</label>
        <textarea
          className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none"
          rows={4}
          placeholder="Dates, pax count, preferred region..."
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-500 disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send enquiry"}
      </button>
      {formStatus === "success" && (
        <p className="text-sm text-primary-600">We&apos;ll get back within 2 hours.</p>
      )}
      {formStatus === "error" && (
        <p className="text-sm text-red-500">
          Something went wrong. Please try again later.
        </p>
      )}
    </form>
  );
}

