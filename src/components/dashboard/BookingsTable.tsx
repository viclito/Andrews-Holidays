"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

type BookingRecord = {
  _id: string;
  packageTitle: string;
  startDate: string;
  endDate: string;
  travellers: { fullName: string; email: string; phone: string; nationality: string }[];
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled";
};

const statuses: BookingRecord["status"][] = ["pending", "confirmed", "cancelled"];

export function BookingsTable({
  initialBookings,
}: {
  initialBookings: BookingRecord[];
}) {
  const { data, mutate } = useSWR<BookingRecord[]>(
    "/api/admin/bookings",
    fetcher,
    { fallbackData: initialBookings }
  );

  const updateStatus = async (id: string, status: BookingRecord["status"]) => {
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    mutate();
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-midnight">Bookings</h2>
      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500">
            <th className="py-2">Package</th>
            <th className="py-2">Customer</th>
            <th className="py-2">Contact</th>
            <th className="py-2">Dates</th>
            <th className="py-2">Travellers</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((booking) => {
             const lead = booking.travellers[0];
             return (
            <tr key={booking._id} className="border-t border-slate-100">
              <td className="py-3 font-semibold text-slate-700">
                {booking.packageTitle}
              </td>
              <td className="py-3 text-slate-600">
                <div className="font-medium">{lead?.fullName || "N/A"}</div>
                <div className="text-xs text-slate-400">{lead?.nationality || "N/A"}</div>
              </td>
              <td className="py-3 text-slate-600">
                <div className="text-xs">{lead?.email}</div>
                <div className="text-xs">{lead?.phone}</div>
              </td>
              <td className="py-3 text-slate-500">
                {new Date(booking.startDate).toLocaleDateString("en-IN")} –{" "}
                {new Date(booking.endDate).toLocaleDateString("en-IN")}
              </td>
              <td className="py-3 text-slate-500">{booking.travellers.length}</td>
              <td className="py-3">
                <select
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold capitalize"
                  value={booking.status}
                  onChange={(event) =>
                    updateStatus(
                      booking._id,
                      event.target.value as BookingRecord["status"]
                    )
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
}

