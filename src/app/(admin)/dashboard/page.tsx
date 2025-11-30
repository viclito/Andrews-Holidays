import { dbConnect } from "@/lib/mongodb";
import { Package } from "@/models/Package";
import { Booking } from "@/models/Booking";
import { Inquiry } from "@/models/Inquiry";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardHomePage() {
  await dbConnect();
  const [packageCount, bookingCount, inquiryCount, recentBookings] = await Promise.all([
    Package.countDocuments(),
    Booking.countDocuments(),
    Inquiry.countDocuments(),
    Booking.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const totalRevenue = await Booking.aggregate([
    { $match: { status: "confirmed" } },
    { $group: { _id: null, amount: { $sum: "$totalAmount" } } },
  ]);

  const revenue = totalRevenue[0]?.amount ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <p className="section-heading">Dashboard</p>
        <h1 className="font-display text-2xl md:text-4xl text-midnight">
          Hello, here is your South India pipeline.
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Packages live" value={packageCount.toString()} />
        <StatCard label="Bookings" value={bookingCount.toString()} />
        <StatCard label="Inquiries" value={inquiryCount.toString()} />
        <StatCard label="Revenue (INR)" value={formatCurrency(revenue)} />
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 overflow-hidden">
        <h2 className="text-xl font-semibold text-midnight">Latest bookings</h2>
        <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
          <table className="mt-4 w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2 pl-4">Package</th>
                <th className="py-2">Dates</th>
                <th className="py-2">Travellers</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => {
                const statusStyles = {
                  confirmed: {
                    border: "border-l-emerald-500",
                    badge: "bg-emerald-100 text-emerald-700 border-emerald-200"
                  },
                  completed: {
                    border: "border-l-blue-500",
                    badge: "bg-blue-100 text-blue-700 border-blue-200"
                  },
                  pending: {
                    border: "border-l-amber-500",
                    badge: "bg-amber-100 text-amber-700 border-amber-200"
                  },
                  cancelled: {
                    border: "border-l-red-500",
                    badge: "bg-red-100 text-red-700 border-red-200"
                  }
                };

                const style = statusStyles[booking.status as keyof typeof statusStyles];

                return (
                  <tr 
                    key={booking._id?.toString()} 
                    className={`border-t border-slate-100 border-l-4 ${style.border} hover:bg-slate-50 transition-colors`}
                  >
                    <td className="py-3 pl-4 font-semibold text-slate-700">
                      {booking.packageTitle}
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(booking.startDate).toLocaleDateString("en-IN")} –{" "}
                      {new Date(booking.endDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3 text-slate-500">{booking.travellers.length}</td>
                    <td className="py-3 text-slate-500">{formatCurrency(booking.totalAmount)}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${style.badge}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-display text-midnight">{value}</p>
    </div>
  );
}

