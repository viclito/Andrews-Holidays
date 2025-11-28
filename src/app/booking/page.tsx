import { buildMetadata } from "@/lib/seo";
import { getPackages } from "@/lib/data/package-service";
import { fallbackPackages } from "@/data/fallback-packages";
import { BookingForm } from "@/components/forms/BookingForm";
import { PackageType } from "@/models/Package";

export const metadata = buildMetadata({
  title: "Secure booking",
  description:
    "Lock South India departures with transparent pricing and instant Stripe checkout for your travellers.",
});

export default async function BookingLandingPage() {
  const packages = await getPackages({}).catch(() => []);
  const list = packages.length ? packages : fallbackPackages;
  const normalizeId = (pkg: Partial<PackageType>) => {
    const rawId = (pkg as { _id?: { toString(): string } })._id;
    if (typeof rawId === "string") return rawId;
    if (rawId && typeof rawId.toString === "function") {
      return rawId.toString();
    }
    return pkg.slug ?? "";
  };
  const options = list
    .map((pkg) => ({
      id: normalizeId(pkg),
      title: pkg.title!,
      priceFrom: pkg.priceFrom!,
    }))
    .filter((option) => option.id);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <p className="section-heading">Booking desk</p>
        <h1 className="font-display text-5xl text-midnight">
          Confirm departures with split payments & live dashboards.
        </h1>
        <p className="text-lg text-slate-600">
          Add basic traveller details, dates, and adult count. We generate a hosted
          Stripe checkout session so your customers can pay securely in INR.
        </p>
        <ul className="space-y-3 text-sm text-slate-600">
          <li>• Works with domestic & international cards</li>
          <li>• Automated booking record on success</li>
          <li>• GST invoice and payout alerts emailed instantly</li>
        </ul>
      </div>
      <BookingForm options={options} />
    </div>
  );
}

