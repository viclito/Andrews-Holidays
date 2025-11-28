import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const metadata = buildMetadata({
  title: "Register",
});

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sand via-white to-primary-50 px-4 py-12">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
