import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { BookingStatusReminder } from "@/components/dashboard/BookingStatusReminder";

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

  await dbConnect();
  const pastBookings = await Booking.find({
    endDate: { $lt: new Date() },
    status: "confirmed",
  })
    .select("packageTitle startDate endDate travellers status")
    .lean();

  return (
    <div className="min-h-screen bg-slate-50">
      <BookingStatusReminder bookings={JSON.parse(JSON.stringify(pastBookings))} />
      <DashboardSidebar navItems={navItems} user={session?.user || {}} />
      <main className="lg:pl-64">
        <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}

