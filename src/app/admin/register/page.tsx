import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { AdminRegisterForm } from "@/components/forms/AdminRegisterForm";

export const metadata = buildMetadata({
  title: "Admin Registration",
});

export default function AdminRegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sand via-white to-primary-50 px-4 py-12">
      <Suspense>
        <AdminRegisterForm />
      </Suspense>
    </div>
  );
}
