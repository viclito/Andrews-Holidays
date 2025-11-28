import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

type PackageCardProps = {
  slug: string;
  title: string;
  heroImage: string;
  region: string;
  duration: number;
  priceFrom: number;
  tags?: string[];
  summary: string;
};

export function PackageCard({
  slug,
  title,
  heroImage,
  region,
  duration,
  priceFrom,
  tags = [],
  summary,
}: PackageCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-soft">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={heroImage}
          alt={title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
          {region}
        </div>
      </div>
      <div className="flex flex-1 flex-col space-y-4 p-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-primary-500">
            {duration} days
          </p>
          <h3 className="mt-2 font-display text-2xl text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-500">{summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              From
            </p>
            <p className="text-lg font-semibold text-slate-900">
              {formatCurrency(priceFrom)}
            </p>
          </div>
          <Link
            href={`/packages/${slug}`}
            className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
          >
            View Package
          </Link>
        </div>
      </div>
    </div>
  );
}

