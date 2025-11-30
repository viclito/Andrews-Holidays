"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { SignOutButton } from "./SignOutButton";

interface NavItem {
  label: string;
  href: string;
}

interface User {
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

interface DashboardSidebarProps {
  navItems: NavItem[];
  user: User;
}

export function DashboardSidebar({ navItems, user }: DashboardSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
             <div className="flex items-center gap-2">
                <img src="/andr-logo.jpeg" alt="Andrews Holiday" className="h-8 w-auto" />
                 <span className="font-display text-lg text-primary-600">Andrews Holiday</span>
            </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            {/* Sidebar Content (Mobile) */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center gap-2">
                <img src="/andr-logo.jpeg" alt="Andrews Holiday" className="h-8 w-auto" />
                 <div>
                    <p className="font-display text-xl text-primary-600">Andrews Holiday</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    Agency Console
                    </p>
                </div>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navItems.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className={`
                              group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                              ${pathname === item.href 
                                ? 'bg-slate-100 text-primary-600' 
                                : 'text-slate-700 hover:bg-slate-50 hover:text-primary-600'}
                            `}
                            onClick={() => setSidebarOpen(false)}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="mt-auto">
                     <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500 space-y-1">
                        <p className="font-semibold text-slate-700">{user?.name}</p>
                        <p>{user?.email}</p>
                        <p className="uppercase tracking-[0.3em] text-primary-500">
                            {user?.role}
                        </p>
                        <div className="pt-2">
                            <SignOutButton />
                        </div>
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center gap-2 mt-4">
            <img src="/andr-logo.jpeg" alt="Andrews Holiday" className="h-8 w-auto" />
            <div>
                <p className="font-display text-xl text-primary-600">Andrews Holiday</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Agency Console
                </p>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navItems.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={`
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                          ${pathname === item.href 
                            ? 'bg-slate-100 text-primary-600' 
                            : 'text-slate-700 hover:bg-slate-50 hover:text-primary-600'}
                        `}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500 space-y-1">
                    <p className="font-semibold text-slate-700">{user?.name}</p>
                    <p>{user?.email}</p>
                    <p className="uppercase tracking-[0.3em] text-primary-500">
                        {user?.role}
                    </p>
                    <div className="pt-2">
                        <SignOutButton />
                    </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
