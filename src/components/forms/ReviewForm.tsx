"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type BookingOption = {
  _id: string;
  packageTitle: string;
  endDate: string;
  heroImage?: string;
};

export function ReviewForm({ bookings }: { bookings: BookingOption[] }) {
  const router = useRouter();
  const [selectedBooking, setSelectedBooking] = useState<string>(
    bookings[0]?._id || ""
  );
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBooking,
          rating,
          title,
          comment,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }

      router.push("/experience?success=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center">
        <p className="text-lg text-gray-600">
          You don't have any completed journeys to review yet.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Journey
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              onClick={() => setSelectedBooking(booking._id)}
              className={`cursor-pointer rounded-xl border p-4 transition-all ${
                selectedBooking === booking._id
                  ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-gray-900">
                {booking.packageTitle}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(booking.endDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl transition-colors ${
                star <= rating ? "text-yellow-400" : "text-gray-200"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="Summarize your experience"
        />
      </div>

      <div className="space-y-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Your Story
        </label>
        <textarea
          id="comment"
          required
          rows={5}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="Tell us about your favorite moments..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-apple btn-primary w-full"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
