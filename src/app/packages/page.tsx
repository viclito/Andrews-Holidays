import { buildMetadata } from "@/lib/seo";
import { getPackages } from "@/lib/data/package-service";
import { fallbackPackages } from "@/data/fallback-packages";
import { PackageCard } from "@/components/cards/PackageCard";
import { FilterBar } from "@/components/packages/FilterBar";

type PackagesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";
export const metadata = buildMetadata({
  title: "South India packages",
  description:
    "Browse curated travel packages covering Kerala, Tamil Nadu, Karnataka, and Goa with live availability and concierge notes.",
});

export default async function PackagesPage({ searchParams }: PackagesPageProps) {
  const params = await searchParams;
  const filters = {
    region: typeof params.region === "string" ? params.region : undefined,
    duration:
      typeof params.duration === "string"
        ? Number(params.duration)
        : undefined,
    maxPrice:
      typeof params.price === "string" ? Number(params.price) : undefined,
  };

  const packages = await getPackages(filters).catch(() => []);
  const list = packages.length ? packages : fallbackPackages;

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <p className="section-heading">South India Collection</p>
        <h1 className="font-display text-5xl text-midnight">
          Bespoke departures for agencies
        </h1>
        <p className="text-slate-600 lg:max-w-2xl">
          Filter by region, duration, and investment to shortlist packages. Every
          itinerary ships with concierge notes, supplier contacts, and upsell ideas.
        </p>
      </div>
      <FilterBar />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {list.map((pkg) => (
          <PackageCard
            key={pkg.slug}
            slug={pkg.slug!}
            title={pkg.title!}
            heroImage={pkg.heroImage ?? "/images/placeholder.svg"}
            region={pkg.region!}
            duration={pkg.duration!}
            priceFrom={pkg.priceFrom!}
            tags={pkg.tags ?? []}
            summary={pkg.summary!}
          />
        ))}
      </div>
    </div>
  );
}

