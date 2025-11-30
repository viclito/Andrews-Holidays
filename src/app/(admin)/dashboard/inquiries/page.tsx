import { dbConnect } from "@/lib/mongodb";
import { Inquiry } from "@/models/Inquiry";
import { InquiriesTable } from "@/components/dashboard/InquiriesTable";

export default async function DashboardInquiriesPage() {
  await dbConnect();
  const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div>
        <p className="section-heading">Inquiries</p>
        <h1 className="font-display text-2xl md:text-4xl text-midnight">
          Respond to leads quickly
        </h1>
      </div>
      <InquiriesTable
        initialInquiries={JSON.parse(JSON.stringify(inquiries))}
      />
    </div>
  );
}

