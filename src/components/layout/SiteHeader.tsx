"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { mainNav } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const toggle = () => setOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/80 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
        >
          <img 
            src="/andr-logo.jpeg" 
            alt="Andrews Holiday" 
            className="h-6 w-auto sm:h-8" 
          />
          <span className="text-base sm:text-xl font-semibold tracking-tight text-gray-900 whitespace-nowrap">
            Andrews Holiday
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition hover:text-gray-900",
                pathname === item.href && "text-gray-900"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          {session ? (
            <>
              <Link
                href={session.user.userType === "admin" ? "/dashboard" : "/customer/dashboard"}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/customer/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                Login
              </Link>
              <Link
                href="/customer/register"
                className="rounded-full bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800 transition"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="text-xs font-medium text-gray-400 hover:text-gray-600 transition"
              >
                Agency
              </Link>
            </>
          )}
        </div>
        <button
          className="lg:hidden rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 flex-shrink-0"
          onClick={toggle}
          aria-label="Toggle navigation"
        >
          {open ? (
            <XMarkIcon className="h-5 w-5" />
          ) : (
            <Bars3Icon className="h-5 w-5" />
          )}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-6 py-4">
          <nav className="flex flex-col gap-4 text-base font-medium text-gray-700">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-gray-900"
                onClick={() => setOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {session ? (
              <>
                <Link
                  href={session.user.userType === "admin" ? "/dashboard" : "/customer/dashboard"}
                  className="hover:text-gray-900"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  className="text-left text-gray-600"
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/customer/login"
                  className="hover:text-gray-900"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/customer/register"
                  className="hover:text-gray-900"
                  onClick={() => setOpen(false)}
                >
                  Register
                </Link>
                <Link
                  href="/login"
                  className="text-sm text-gray-400 hover:text-gray-600"
                  onClick={() => setOpen(false)}
                >
                  Agency Login
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
