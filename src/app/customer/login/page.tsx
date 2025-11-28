import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { CustomerLoginForm } from "@/components/forms/CustomerLoginForm";

export const metadata = buildMetadata({
  title: "Customer Login",
});

export default function CustomerLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sand via-white to-primary-50 px-4 py-12">
      <Suspense>
        <CustomerLoginForm />
      </Suspense>
    </div>
  );
}
