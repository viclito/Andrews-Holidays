"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatCurrency } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const schema = z.object({
  packageId: z.string().min(1, "Select a package"),
  startDate: z.string().min(1, "Required"),
  endDate: z.string().min(1, "Required"),
  travellers: z.number().min(1).max(8),
  contactName: z.string().min(3),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(5),
  specialRequests: z.string().optional(),
});

export type BookingOption = {
  id: string;
  title: string;
  priceFrom: number;
};

type BookingFormProps = {
  options: BookingOption[];
  defaultPackageId?: string;
};

type FormValues = z.infer<typeof schema>;

export function BookingForm({ options, defaultPackageId }: BookingFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      packageId: defaultPackageId ?? options[0]?.id ?? "",
      travellers: 2,
    },
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
        setValue("contactName", session.user.name);
      }
      if (session.user.email) {
        setValue("contactEmail", session.user.email);
      }
    }
  }, [session, setValue]);

  const selectedPackageId = useWatch({ control, name: "packageId" });
  const travellerWatch = useWatch({ control, name: "travellers" }) ?? 1;
  const travellerCount =
    typeof travellerWatch === "number"
      ? travellerWatch
      : Number(travellerWatch) || 1;
  const selectedPackage = options.find((pkg) => pkg.id === selectedPackageId);
  const indicativeTotal = selectedPackage
    ? selectedPackage.priceFrom * travellerCount
    : 0;

  if (!options.length) {
    return (
      <div className="rounded-[32px] border border-dashed border-slate-200 bg-white/60 p-8 text-center">
        <p className="font-semibold text-slate-700">
          No packages available yet.
        </p>
        <p className="text-sm text-slate-500">
          Create packages in the admin console or run the seed script to populate demo
          data.
        </p>
      </div>
    );
  }

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "Unable to start checkout.");
      return;
    }

    const data = await response.json();
    if (data?.url) {
      window.location.assign(data.url);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-[32px] border border-slate-100 bg-white p-8 shadow-soft"
    >
      <div>
        <label className="text-sm font-semibold text-slate-700">
          Package to reserve
        </label>
        <select
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          {...register("packageId")}
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.title}
            </option>
          ))}
        </select>
        {errors.packageId && (
          <p className="mt-1 text-xs text-red-500">{errors.packageId.message}</p>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-700">Start date</label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            {...register("startDate")}
          />
          {errors.startDate && (
            <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">End date</label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            {...register("endDate")}
          />
          {errors.endDate && (
            <p className="mt-1 text-xs text-red-500">{errors.endDate.message}</p>
          )}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-700">
          Travellers (adults)
        </label>
        <input
          type="number"
          min={1}
          max={8}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          {...register("travellers", { valueAsNumber: true })}
        />
        {errors.travellers && (
          <p className="mt-1 text-xs text-red-500">{errors.travellers.message}</p>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-700">Lead name</label>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            {...register("contactName")}
          />
          {errors.contactName && (
            <p className="mt-1 text-xs text-red-500">{errors.contactName.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Lead email</label>
          <input
            type="email"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            {...register("contactEmail")}
          />
          {errors.contactEmail && (
            <p className="mt-1 text-xs text-red-500">{errors.contactEmail.message}</p>
          )}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-700">Contact number</label>
        <input
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          {...register("contactPhone")}
        />
        {errors.contactPhone && (
          <p className="mt-1 text-xs text-red-500">{errors.contactPhone.message}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-700">
          Special requests
        </label>
        <textarea
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          rows={4}
          {...register("specialRequests")}
        />
      </div>
      <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-700">Indicative total</p>
        <p className="text-3xl font-display text-primary-600">
          {formatCurrency(indicativeTotal)}
        </p>
        <p className="text-xs text-slate-500">
          Final invoice may vary by seasonality. Stripe charges in INR.
        </p>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-500 disabled:opacity-60"
      >
        {isSubmitting ? "Redirecting…" : "Confirm your booking"}
      </button>
    </form>
  );
}

