"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { fetcher } from "@/lib/fetcher";

type PackageRecord = {
  _id: string;
  title: string;
  slug: string;
  region: string;
  duration: number;
  priceFrom: number;
  summary: string;
  heroImage: string;
  tags?: string[];
  inclusions?: string[];
  exclusions?: string[];
  gallery?: string[];
  itinerary?: { day: number; title: string; description: string; highlights: string[] }[];
  isFeatured?: boolean;
};

type PackagesManagerProps = {
  initialPackages: PackageRecord[];
};

type PackageFormValues = {
  title: string;
  slug: string;
  region: string;
  duration: number;
  priceFrom: number;
  summary: string;
  heroImage: string;
  tags: string;
  inclusions: string;
  exclusions: string;
  gallery: string;
  itinerary: string;
  isFeatured: boolean;
};

const regions = ["Kerala", "Tamil Nadu", "Karnataka", "Goa"];

export function PackagesManager({ initialPackages }: PackagesManagerProps) {
  const { data, mutate } = useSWR<PackageRecord[]>(
    "/api/admin/packages",
    fetcher,
    {
      fallbackData: initialPackages,
    }
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [heroImagePreview, setHeroImagePreview] = useState<string>("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PackageFormValues>({
    defaultValues: {
      title: "",
      slug: "",
      region: "Kerala",
      duration: 5,
      priceFrom: 150000,
      summary: "",
      heroImage: "/images/placeholder.svg",
      tags: "",
      inclusions: "",
      exclusions: "",
      gallery: "",
      itinerary: "[]",
      isFeatured: false,
    },
  });

  useEffect(() => {
    if (!editingId) {
      reset({
        title: "",
        slug: "",
        region: "Kerala",
        duration: 5,
        priceFrom: 150000,
        summary: "",
        heroImage: "/images/placeholder.svg",
        tags: "",
        inclusions: "",
        exclusions: "",
        gallery: "",
        itinerary: "[]",
        isFeatured: false,
      });
      setHeroImagePreview("");
      return;
    }
    const pkg = data?.find((item) => item._id === editingId);
    if (pkg) {
      reset({
        title: pkg.title,
        slug: pkg.slug,
        region: pkg.region,
        duration: pkg.duration,
        priceFrom: pkg.priceFrom,
        summary: pkg.summary,
        heroImage: pkg.heroImage,
        tags: pkg.tags?.join(", ") || "",
        inclusions: pkg.inclusions?.join("\n") || "",
        exclusions: pkg.exclusions?.join("\n") || "",
        gallery: pkg.gallery?.join(", ") || "",
        itinerary: JSON.stringify(pkg.itinerary || [], null, 2),
        isFeatured: pkg.isFeatured || false,
      });
      setHeroImagePreview(pkg.heroImage);
    }
  }, [editingId, data, reset]);

  const onSubmit = async (values: PackageFormValues) => {
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `/api/admin/packages/${editingId}`
      : "/api/admin/packages";

    let parsedItinerary = [];
    try {
      parsedItinerary = JSON.parse(values.itinerary);
    } catch {
      alert("Invalid JSON in itinerary");
      return;
    }

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        duration: Number(values.duration),
        priceFrom: Number(values.priceFrom),
        tags: values.tags.split(",").map((t) => t.trim()).filter(Boolean),
        inclusions: values.inclusions.split("\n").map((t) => t.trim()).filter(Boolean),
        exclusions: values.exclusions.split("\n").map((t) => t.trim()).filter(Boolean),
        gallery: values.gallery.split(",").map((t) => t.trim()).filter(Boolean),
        itinerary: parsedItinerary,
      }),
    });

    if (response.ok) {
      await mutate();
      setEditingId(null);
      reset();
    }
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      }
      return null;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
    mutate();
    if (editingId === id) setEditingId(null);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-midnight">
              {editingId ? "Edit package" : "Create package"}
            </h2>
            <p className="text-sm text-slate-500">
              Mandatory fields for publishing packages.
            </p>
          </div>
          {editingId && (
            <button
              type="button"
              className="text-xs font-semibold text-slate-500"
              onClick={() => setEditingId(null)}
            >
              Clear
            </button>
          )}
        </div>
        <input
          placeholder="Title"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          {...register("title", { required: true })}
        />
        <input
          placeholder="Slug"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          {...register("slug", { required: true })}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <select
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            {...register("region")}
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Duration"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            {...register("duration", { valueAsNumber: true })}
          />
        </div>
        <input
          type="number"
          placeholder="Price (INR)"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          {...register("priceFrom", { valueAsNumber: true })}
        />
        <textarea
          placeholder="Summary"
          className="h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          {...register("summary")}
        />
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500">
            Hero Image
          </label>
          <div className="space-y-2">
            {heroImagePreview && (
              <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = await handleImageUpload(file);
                  if (url) {
                    const currentValues = register("heroImage");
                    currentValues.onChange({ target: { value: url, name: "heroImage" } });
                    setHeroImagePreview(url);
                  }
                }
              }}
              disabled={uploading}
            />
            <input
              placeholder="Or enter image URL manually"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              {...register("heroImage")}
              onChange={(e) => {
                register("heroImage").onChange(e);
                setHeroImagePreview(e.target.value);
              }}
            />
          </div>
        </div>
        <input
          placeholder="Gallery URLs (comma separated)"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          {...register("gallery")}
        />
        <input
          placeholder="Tags (comma separated)"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          {...register("tags")}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <textarea
            placeholder="Inclusions (one per line)"
            className="h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            {...register("inclusions")}
          />
          <textarea
            placeholder="Exclusions (one per line)"
            className="h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            {...register("exclusions")}
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500">
            Itinerary (JSON)
          </label>
          <textarea
            placeholder="Itinerary JSON"
            className="h-48 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-mono"
            {...register("itinerary")}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isFeatured"
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            {...register("isFeatured")}
          />
          <label htmlFor="isFeatured" className="text-sm text-slate-700">
            Feature this package
          </label>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-primary-600 py-3 text-sm font-semibold text-white"
        >
          {editingId ? "Update package" : "Create package"}
        </button>
      </form>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-semibold text-midnight">Packages</h2>
        <div className="mt-4 space-y-4">
          {data?.map((pkg) => (
            <div
              key={pkg._id}
              className="rounded-2xl border border-slate-100 p-4 hover:border-primary-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-midnight">{pkg.title}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    {pkg.region} · {pkg.duration}D
                  </p>
                </div>
                <div className="flex gap-2 text-xs">
                  <button
                    className="rounded-full border border-slate-200 px-3 py-1"
                    onClick={() => setEditingId(pkg._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-full border border-red-200 px-3 py-1 text-red-500"
                    onClick={() => handleDelete(pkg._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {pkg.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

