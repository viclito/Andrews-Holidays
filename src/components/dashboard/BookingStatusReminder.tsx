"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

type BookingRecord = {
  _id: string;
  packageTitle: string;
  startDate: string;
  endDate: string;
  travellers: { fullName: string }[];
  status: string;
};

export function BookingStatusReminder({
  bookings,
}: {
  bookings: BookingRecord[];
}) {
  const [open, setOpen] = useState(bookings.length > 0);
  const [pendingBookings, setPendingBookings] = useState(bookings);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUpdate = async (id: string, status: "completed" | "cancelled") => {
    try {
      await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      const updated = pendingBookings.filter((b) => b._id !== id);
      setPendingBookings(updated);
      
      if (updated.length === 0) {
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update booking", error);
    }
  };

  if (!mounted || pendingBookings.length === 0) return null;

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                  Past Bookings Attention
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    The following bookings have passed their end date but are still marked as "Confirmed". Please update their status.
                  </p>
                  <div className="mt-4 max-h-60 overflow-y-auto space-y-3">
                    {pendingBookings.map((booking) => (
                      <div key={booking._id} className="flex flex-col gap-2 rounded-md border border-gray-200 p-3 text-sm">
                        <div className="flex justify-between font-medium">
                            <span>{booking.packageTitle}</span>
                            <span className="text-gray-500">{new Date(booking.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="text-gray-500">
                            Customer: {booking.travellers[0]?.fullName}
                        </div>
                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={() => handleUpdate(booking._id, "completed")}
                                className="flex-1 rounded-md bg-green-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-green-500"
                            >
                                Mark Completed
                            </button>
                            <button
                                onClick={() => handleUpdate(booking._id, "cancelled")}
                                className="flex-1 rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-500"
                            >
                                Mark Cancelled
                            </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={() => setOpen(false)}
              >
                Remind Me Later
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
