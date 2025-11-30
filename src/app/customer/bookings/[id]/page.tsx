"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { FadeIn } from "@/components/animations/FadeIn";

type BookingDetail = {
  _id: string;
  packageTitle: string;
  startDate: string;
  endDate: string;
  travellers: {
    fullName: string;
    email: string;
    phone: string;
    nationality: string;
  }[];
  totalAmount: number;
  currency: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  specialRequests?: string;
  createdAt: string;
  packageId: {
    slug: string;
    heroImage: string;
  };
};

export default function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/customer/bookings/${id}`);
        if (!response.ok) throw new Error("Failed to fetch booking");
        const data = await response.json();
        setBooking(data);
      } catch (err) {
        setError("Could not load booking details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      completed: "bg-blue-100 text-blue-700 border-blue-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      cancelled: "bg-rose-100 text-rose-700 border-rose-200",
    };
    // @ts-ignore
    const style = styles[status] || "bg-slate-100 text-slate-700 border-slate-200";

    return (
      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium capitalize ${style}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <p className="text-red-600">{error || "Booking not found"}</p>
        <Link href="/customer/dashboard" className="mt-4 text-sm font-medium text-primary-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <div className="mb-8">
            <Link href="/customer/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900">
              &larr; Back to Dashboard
            </Link>
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{booking.packageTitle}</h1>
                  <p className="mt-1 text-sm text-gray-500">Booking ID: {booking._id}</p>
                </div>
                {getStatusBadge(booking.status)}
              </div>
            </div>

            <div className="px-8 py-8">
              <div className="grid gap-12 md:grid-cols-2">
                {/* Trip Details */}
                <section>
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">Trip Details</h2>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Dates</dt>
                      <dd className="mt-1 text-base text-gray-900">
                        {format(new Date(booking.startDate), "MMM d, yyyy")} &mdash;{" "}
                        {format(new Date(booking.endDate), "MMM d, yyyy")}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Duration</dt>
                      <dd className="mt-1 text-base text-gray-900">
                        {Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} Days
                      </dd>
                    </div>
                    {booking.specialRequests && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Special Requests</dt>
                        <dd className="mt-1 text-base text-gray-900">{booking.specialRequests}</dd>
                      </div>
                    )}
                  </dl>
                </section>

                {/* Payment Info */}
                <section>
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">Payment Summary</h2>
                  <div className="rounded-2xl bg-gray-50 p-6">
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Total Amount</dt>
                        <dd className="font-medium text-gray-900">
                          {booking.currency} {booking.totalAmount.toLocaleString()}
                        </dd>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-3">
                        <dt className="text-sm font-medium text-gray-900">Status</dt>
                        <dd className="text-sm capitalize text-gray-700">{booking.status}</dd>
                      </div>
                    </dl>
                  </div>
                </section>
              </div>

              <div className="mt-12 border-t border-gray-100 pt-8">
                <h2 className="mb-6 text-lg font-semibold text-gray-900">Traveller Information</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {booking.travellers.map((traveller, index) => (
                    <div key={index} className="rounded-xl border border-gray-100 p-4">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900">{traveller.fullName}</span>
                      </div>
                      <div className="space-y-1 pl-11 text-sm text-gray-500">
                        <p>{traveller.email}</p>
                        <p>{traveller.phone}</p>
                        <p>{traveller.nationality}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-100 bg-gray-50/50 px-8 py-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
                 <Link
                  href={`/packages/${booking.packageId?.slug || ''}`}
                  className="inline-flex justify-center rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  View Package
                </Link>
                <a
                  href="mailto:support@southerntrails.com"
                  className="inline-flex justify-center rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
