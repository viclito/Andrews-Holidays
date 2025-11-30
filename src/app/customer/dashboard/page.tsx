"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { FadeIn, StaggerContainer, staggerItem, MotionDiv } from "@/components/animations/FadeIn";

type Booking = {
  _id: string;
  packageTitle: string;
  startDate: string;
  endDate: string;
  travellers: { fullName: string }[];
  totalAmount: number;
  currency: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
};

type Inquiry = {
  _id: string;
  packageTitle?: string;
  message: string;
  status: "new" | "contacted" | "converted";
  createdAt: string;
};

export default function CustomerDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/customer/my-data");
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
        setInquiries(data.inquiries || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      completed: "bg-blue-100 text-blue-700 border-blue-200",
      converted: "bg-emerald-100 text-emerald-700 border-emerald-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      new: "bg-blue-100 text-blue-700 border-blue-200",
      cancelled: "bg-rose-100 text-rose-700 border-rose-200",
      contacted: "bg-purple-100 text-purple-700 border-purple-200",
    };
    
    // @ts-ignore
    const style = styles[status] || "bg-slate-100 text-slate-700 border-slate-200";

    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}>
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

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-10 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
              <p className="mt-2 text-sm text-gray-500">Manage your travel plans and inquiries.</p>
            </div>
            <Link
              href="/packages"
              className="inline-flex items-center justify-center rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all"
            >
              Explore New Packages
            </Link>
          </div>
        </FadeIn>

        <StaggerContainer className="grid gap-8 lg:grid-cols-2">
          {/* Bookings Section */}
          <MotionDiv variants={staggerItem} className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {bookings.length} Total
              </span>
            </div>

            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
                <div className="mb-4 rounded-full bg-gray-50 p-4">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900">No bookings yet</h3>
                <p className="mt-1 text-sm text-gray-500">Start your journey by exploring our packages.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Link
                    key={booking._id}
                    href={`/customer/bookings/${booking._id}`}
                    className="group block relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{booking.packageTitle}</h3>
                          {getStatusBadge(booking.status)}
                        </div>
                        <p className="text-sm text-gray-500">
                          {format(new Date(booking.startDate), "MMM d, yyyy")} &rarr;{" "}
                          {format(new Date(booking.endDate), "MMM d, yyyy")}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.travellers.length} Traveller{booking.travellers.length > 1 ? 's' : ''} &middot; {booking.currency} {booking.totalAmount.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="text-gray-400 transition-transform group-hover:translate-x-1">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    {((booking.status === "confirmed" && new Date(booking.endDate) < new Date()) || booking.status === "completed") && (
                      <div className="mt-4 border-t border-gray-100 pt-4">
                        <span className="text-sm font-medium text-primary-600 hover:text-primary-700">
                          Write a Review &rarr;
                        </span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </MotionDiv>

          {/* Inquiries Section */}
          <MotionDiv variants={staggerItem} className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Inquiries</h2>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {inquiries.length} Total
              </span>
            </div>

            {inquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
                <div className="mb-4 rounded-full bg-gray-50 p-4">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900">No inquiries yet</h3>
                <p className="mt-1 text-sm text-gray-500">Questions about a trip? Ask us anything.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <div
                    key={inquiry._id}
                    className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">
                            {inquiry.packageTitle || "General Inquiry"}
                          </h3>
                          {getStatusBadge(inquiry.status)}
                        </div>
                        <p className="line-clamp-2 text-sm text-gray-600">
                          &ldquo;{inquiry.message}&rdquo;
                        </p>
                        <p className="text-xs text-gray-400">
                          Sent on {format(new Date(inquiry.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </MotionDiv>
        </StaggerContainer>
      </div>
    </div>
  );
}
