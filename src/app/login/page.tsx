import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata = buildMetadata({
  title: "Agency login",
});

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sand via-white to-primary-50 px-4 py-12">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
