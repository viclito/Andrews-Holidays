import { dbConnect } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { BookingsTable } from "@/components/dashboard/BookingsTable";

export default async function DashboardBookingsPage() {
  await dbConnect();
  const bookings = await Booking.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div>
        <p className="section-heading">Bookings</p>
        <h1 className="font-display text-2xl md:text-4xl text-midnight">
          Track upcoming departures
        </h1>
      </div>
      <BookingsTable initialBookings={JSON.parse(JSON.stringify(bookings))} />
    </div>
  );
}

