"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { CtaBanner } from "./CtaBanner";

type LayoutWrapperProps = {
  children: React.ReactNode;
};

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const hideMarketingChrome =
    pathname?.startsWith("/dashboard") || pathname?.startsWith("/login");

  if (hideMarketingChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-16 space-y-16">{children}</div>
        <div className="container pb-16">
          <CtaBanner />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

