import { useState } from "react";
import Link from "next/link";
import { StudentProfile } from "@/src/types/studentProfile";
import { FaFile } from "react-icons/fa";

// 1. Updated Top Navigation Header
export function DashboardHeader({ user, onLogout }: { user: StudentProfile; onLogout: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  // Fallback user initials for the avatar
  const initials = user?.full_name
    ? user.full_name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "ST";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">

        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-xs">
            in
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900">
              Student Workspace
            </h1>
          </div>
        </div>

        {/* Right Action Menu & User Avatar */}
        <div className="flex items-center gap-3">
          <Link
            href="/internships"
            className="workspace-action hidden h-9 items-center justify-center rounded-lg bg-blue-600 px-3.5 text-white shadow-2xs transition-all hover:bg-blue-700 sm:inline-flex"
          >
            Find Opportunities
          </Link>
          <Link
            href="/student/profile/documents"
            className="workspace-action hidden h-9 items-center justify-center rounded-lg bg-slate-100 px-3.5 text-slate-700 shadow-2xs transition-all hover:bg-slate-200 sm:inline-flex"
          >
            <FaFile className="mr-1.5 h-3.5 w-3.5" />
            My Documents
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 hover:ring-2 hover:ring-blue-600 hover:ring-offset-1 transition-all focus:outline-none"
            >
              {initials}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <>
                {/* Backdrop overlay to close menu when clicking outside */}
                <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

                <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg animate-in fade-in-50 zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {user?.full_name || "Student"}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/student/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600"
                    >
                      View & Edit Profile
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsOpen(false)}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600"
                    >
                      Account Settings
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onLogout();
                      }}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      <svg
                        className="mr-2 h-3.5 w-3.5 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.75"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25"
                        />
                      </svg>
                      Log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
