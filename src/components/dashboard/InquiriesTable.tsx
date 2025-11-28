"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

type InquiryRecord = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  status: "new" | "contacted" | "converted";
  packageTitle?: string;
};

const statuses: InquiryRecord["status"][] = ["new", "contacted", "converted"];

export function InquiriesTable({
  initialInquiries,
}: {
  initialInquiries: InquiryRecord[];
}) {
  const { data, mutate } = useSWR<InquiryRecord[]>(
    "/api/admin/inquiries",
    fetcher,
    { fallbackData: initialInquiries }
  );

  const updateStatus = async (id: string, status: InquiryRecord["status"]) => {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    mutate();
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-midnight">Inquiries</h2>
      <div className="mt-4 space-y-4">
        {data?.map((inquiry) => (
          <div key={inquiry._id} className="rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-midnight">{inquiry.fullName}</p>
                <p className="text-xs text-slate-500">{inquiry.email}</p>
              </div>
              <select
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold capitalize"
                value={inquiry.status}
                onChange={(event) =>
                  updateStatus(
                    inquiry._id,
                    event.target.value as InquiryRecord["status"]
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
            <p className="mt-2 text-sm text-slate-500">{inquiry.message}</p>
            <p className="mt-2 text-xs text-slate-400">
              {inquiry.packageTitle ? `Package: ${inquiry.packageTitle}` : "General"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

