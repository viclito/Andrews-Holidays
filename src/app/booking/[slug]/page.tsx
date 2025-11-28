import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getPackageBySlug, getPackages } from "@/lib/data/package-service";
import { BookingForm } from "@/components/forms/BookingForm";
import { PackageType } from "@/models/Package";

type BookingParams = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BookingParams) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) {
    return buildMetadata({ title: "Package unavailable" });
  }
  return buildMetadata({
    title: `Book ${pkg.title}`,
    description: pkg.summary,
  });
}

export default async function BookingPackagePage({ params }: BookingParams) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) {
    notFound();
  }

  const otherPackages = await getPackages({}).catch(() => []);
  const normalizeId = (item: Partial<PackageType>) => {
    const rawId = (item as { _id?: { toString(): string } })._id;
    if (typeof rawId === "string") return rawId;
    if (rawId && typeof rawId.toString === "function") {
      return rawId.toString();
    }
    return item.slug ?? "";
  };
  const options = otherPackages.length
    ? otherPackages
        .map((item) => ({
          id: normalizeId(item),
          title: item.title!,
          priceFrom: item.priceFrom!,
        }))
        .filter(Boolean)
    : [
        {
          id: pkg._id?.toString() ?? pkg.slug,
          title: pkg.title,
          priceFrom: pkg.priceFrom,
        },
      ];

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-4">
        <p className="section-heading">{pkg.region}</p>
        <h1 className="font-display text-5xl text-midnight">
          Reserve {pkg.title}
        </h1>
        <p className="text-lg text-slate-600">{pkg.summary}</p>
        <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">From</p>
          <p className="text-4xl font-display text-primary-600">₹{pkg.priceFrom}</p>
          <p className="text-sm text-slate-500">{pkg.duration} day signature route</p>
        </div>
      </div>
      <BookingForm
        options={options}
        defaultPackageId={normalizeId(pkg)}
      />
    </div>
  );
}

