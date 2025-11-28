import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="section-heading">404</p>
      <h1 className="mt-3 font-display text-5xl text-midnight">
        The page you are after took a detour.
      </h1>
      <p className="mt-4 text-slate-600 max-w-xl">
        It might have been archived or moved into the agency console. Try heading back
        to the packages hub.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Back to home
        </Link>
        <Link
          href="/packages"
          className="rounded-full border border-primary-100 px-5 py-3 text-sm font-semibold text-primary-600"
        >
          View packages
        </Link>
      </div>
    </div>
  );
}

