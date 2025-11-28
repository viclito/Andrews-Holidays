import Image from "next/image";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getPackageBySlug } from "@/lib/data/package-service";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { formatCurrency } from "@/lib/utils";

type PackageDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PackageDetailProps) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg) {
    return buildMetadata({ title: "Package not found" });
  }

  return buildMetadata({
    title: pkg.title,
    description: pkg.summary,
    images: pkg.gallery?.length ? pkg.gallery : [pkg.heroImage],
  });
}

export default async function PackageDetailPage({ params }: PackageDetailProps) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <p className="section-heading">{pkg.region}</p>
          <h1 className="font-display text-5xl text-midnight">{pkg.title}</h1>
          <p className="text-lg text-slate-600">{pkg.summary}</p>
          <div className="flex flex-wrap gap-3">
            {pkg.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Starting from
            </p>
            <p className="mt-1 text-4xl font-display text-primary-600">
              {formatCurrency(pkg.priceFrom)}
            </p>
            <p className="text-sm text-slate-500">
              {pkg.duration} days · {pkg.itinerary?.length ?? pkg.duration} touchpoints
            </p>
            <a
              href={`/booking/${pkg.slug}`}
              className="mt-4 inline-flex w-full justify-center rounded-full bg-primary-600 px-4 py-3 text-sm font-semibold text-white"
            >
              Secure this departure
            </a>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] bg-slate-200">
          <Image
            src={pkg.heroImage ?? "/images/placeholder.svg"}
            alt={pkg.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-3xl text-midnight">Itinerary snapshot</h2>
            <p className="text-sm text-slate-500">
              Detailed supplier notes downloadable from the agency console.
            </p>
          </div>
          <div className="space-y-4">
            {pkg.itinerary?.map((day) => (
              <div
                key={day.day}
                className="rounded-3xl border border-slate-100 bg-white p-4 shadow-soft"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Day {day.day}
                </p>
                <h3 className="text-xl font-semibold text-midnight">{day.title}</h3>
                <p className="text-sm text-slate-600">{day.description}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                  {day.highlights?.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-slate-100 px-3 py-1 text-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
            <h3 className="font-semibold text-midnight">Inclusions</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {pkg.inclusions?.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            <h3 className="mt-6 font-semibold text-midnight">Exclusions</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {pkg.exclusions?.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <InquiryForm packageId={pkg._id?.toString()} packageTitle={pkg.title} />
        </div>
      </section>
    </div>
  );
}

