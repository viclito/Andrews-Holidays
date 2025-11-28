import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-primary-600 px-6 py-10 text-white shadow-soft">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-white/70">
            South India Specialists
          </p>
          <h3 className="mt-2 text-3xl font-display lg:text-4xl">
            Ready to launch bespoke itineraries in under 10 minutes?
          </h3>
          <p className="mt-3 text-base text-white/80 lg:max-w-2xl">
            Sync packages across coastal Kerala, Chettinad trails, and Nilgiri
            escapes. Collect enquiries, confirm bookings, and manage payouts with
            a single dashboard.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm font-semibold">
          <Link
            href="/booking"
            className="rounded-full bg-white px-5 py-3 text-center text-primary-600 shadow-lg shadow-black/10 hover:bg-white/90"
          >
            Book a Discovery Call
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/40 px-5 py-3 text-center text-white hover:bg-white/10"
          >
            View Agency Console
          </Link>
        </div>
      </div>
    </section>
  );
}

