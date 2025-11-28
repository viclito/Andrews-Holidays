import Link from "next/link";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/dashboard/SignOutButton";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Packages", href: "/dashboard/packages" },
  { label: "Bookings", href: "/dashboard/bookings" },
  { label: "Inquiries", href: "/dashboard/inquiries" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white p-6 lg:flex">
        <div className="flex items-center gap-2">
          <img src="/andr-logo.jpeg" alt="Andrews Holiday" className="h-8 w-auto" />
          <div>
            <p className="font-display text-2xl text-primary-600">Andrews Holiday</p>
            <p className="mt-1 text-xs uppercase tracking-[0.4em] text-slate-400">
              Agency Console
            </p>
          </div>
        </div>
        <nav className="mt-8 flex flex-col gap-2 text-sm font-semibold text-slate-600">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl px-3 py-2 transition hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700">{session?.user?.name}</p>
          <p>{session?.user?.email}</p>
          <p className="uppercase tracking-[0.3em] text-primary-500">
            {session?.user?.role}
          </p>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-10">{children}</main>
    </div>
  );
}

