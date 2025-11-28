"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const regions = ["Kerala", "Tamil Nadu", "Karnataka", "Goa"];

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    startTransition(() => {
      const query = params.toString();
      router.push(query ? `/packages?${query}` : "/packages");
    });
  };

  return (
    <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-soft">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Region
          </label>
          <select
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            defaultValue={searchParams.get("region") ?? ""}
            onChange={(event) => handleChange("region", event.target.value)}
            disabled={isPending}
          >
            <option value="">All regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Min duration
          </label>
          <select
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            defaultValue={searchParams.get("duration") ?? ""}
            onChange={(event) => handleChange("duration", event.target.value)}
            disabled={isPending}
          >
            <option value="">Any</option>
            <option value="4">4+ nights</option>
            <option value="6">6+ nights</option>
            <option value="8">8+ nights</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Budget
          </label>
          <select
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            defaultValue={searchParams.get("price") ?? ""}
            onChange={(event) => handleChange("price", event.target.value)}
            disabled={isPending}
          >
            <option value="">All</option>
            <option value="100000">Under ₹1L</option>
            <option value="200000">Under ₹2L</option>
            <option value="300000">Under ₹3L</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            className="w-full rounded-full bg-primary-600 py-3 text-sm font-semibold text-white disabled:opacity-60"
            onClick={() => {
              handleChange("region", "");
              handleChange("duration", "");
              handleChange("price", "");
            }}
            disabled={isPending}
          >
            Clear filters
          </button>
        </div>
      </div>
    </div>
  );
}

