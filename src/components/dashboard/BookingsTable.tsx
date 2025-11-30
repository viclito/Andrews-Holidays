"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

type BookingRecord = {
  _id: string;
  packageTitle: string;
  startDate: string;
  endDate: string;
  travellers: { fullName: string; email: string; phone: string; nationality: string }[];
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
};

const statuses: BookingRecord["status"][] = ["pending", "confirmed", "cancelled", "completed"];

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

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  const updateStatus = async (id: string, status: BookingRecord["status"]) => {
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    mutate();
  };

  const filteredBookings = useMemo(() => {
    if (!data) return [];

    return data.filter((booking) => {
      // Status filter
      if (statusFilter !== "all" && booking.status !== statusFilter) {
        return false;
      }

      // Search filter (name or package)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = booking.travellers.some((t) =>
          t.fullName.toLowerCase().includes(query)
        );
        const matchesPackage = booking.packageTitle.toLowerCase().includes(query);
        if (!matchesName && !matchesPackage) {
          return false;
        }
      }

      // Start date filter
      if (startDateFilter) {
        const bookingStart = new Date(booking.startDate);
        const filterStart = new Date(startDateFilter);
        if (bookingStart < filterStart) {
          return false;
        }
      }

      // End date filter
      if (endDateFilter) {
        const bookingEnd = new Date(booking.endDate);
        const filterEnd = new Date(endDateFilter);
        if (bookingEnd > filterEnd) {
          return false;
        }
      }

      return true;
    });
  }, [data, statusFilter, searchQuery, startDateFilter, endDateFilter]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-midnight">Bookings</h2>
      
      {/* Filters */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="all">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Search</label>
          <input
            type="text"
            placeholder="Name or package..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Start Date From</label>
          <input
            type="date"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">End Date Until</label>
          <input
            type="date"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-slate-500">
        Showing {filteredBookings.length} of {data?.length || 0} bookings
      </div>

      {/* Mobile Card View */}
      <div className="mt-4 space-y-4 lg:hidden">
        {filteredBookings.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            No bookings found matching your filters
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const lead = booking.travellers[0];
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
            const style = statusStyles[booking.status];

            return (
              <div
                key={booking._id}
                className={`rounded-lg border border-slate-200 border-l-4 ${style.border} bg-white p-4 space-y-3`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{booking.packageTitle}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {new Date(booking.startDate).toLocaleDateString("en-IN")} – {new Date(booking.endDate).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${style.badge}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Customer</p>
                    <p className="font-medium text-slate-700">{lead?.fullName || "N/A"}</p>
                    <p className="text-xs text-slate-400">{lead?.nationality || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Travellers</p>
                    <p className="font-medium text-slate-700">{booking.travellers.length}</p>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="text-xs text-slate-500 mb-1">Contact</p>
                  <p className="text-xs text-slate-600">{lead?.email}</p>
                  <p className="text-xs text-slate-600">{lead?.phone}</p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs text-slate-500 mb-1">Update Status</label>
                  <select
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium capitalize bg-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
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
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 hidden lg:block">
        <table className="mt-4 w-full text-sm min-w-[800px]">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-2 pl-4">Package</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Contact</th>
              <th className="py-2">Dates</th>
              <th className="py-2">Travellers</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No bookings found matching your filters
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => {
                const lead = booking.travellers[0];
                
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

                const style = statusStyles[booking.status];

                return (
                  <tr 
                    key={booking._id} 
                    className={`border-t border-slate-100 border-l-4 ${style.border} hover:bg-slate-50 transition-colors`}
                  >
                    <td className="py-3 pl-4 font-semibold text-slate-700">
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
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${style.badge}`}>
                        {booking.status}
                      </span>
                      <select
                        className="ml-2 rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium capitalize bg-white hover:bg-slate-50 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

