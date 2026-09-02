"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, User, Menu, X, ClipboardList, Search } from "lucide-react";
import { useStudentProfileStore } from "@/src/context/useStudentProfile";
import SidebarLogoutButton from "@/src/components/Auth/SidebarLogoutButton";

interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
    {
        label: "Browse Internship",
        "href": "/internships",
        "icon": Search,
    },
    {
        label: "Dashboard",
        href: "/student/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Applications",
        href: "/student/applications",
        icon: ClipboardList,
    },
    {
        label: "Documents",
        href: "/student/profile/documents",
        icon: FileText,
    },
    {
        label: "My Profile",
        href: "/student/profile",
        icon: User,
    },
];

export default function SideBar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { profile, fetchProfile } = useStudentProfileStore();

    useEffect(() => {
        if (!profile) {
            fetchProfile();
        }
    }, [profile, fetchProfile]);

    // Fallback user initials for the avatar
    const initials = profile?.full_name
        ? profile.full_name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "ST";

    const renderNavLinks = () => (
        <nav className="flex-1 space-y-1.5 px-3 py-4">
            {navItems.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href;

                return (
                    <Link
                        key={href}
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                    >
                        <Icon
                            className={`h-5 w-5 shrink-0 ${isActive
                                ? "text-blue-700"
                                : "text-slate-500 group-hover:text-slate-900"
                                }`}
                        />
                        {label}
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <>
            {/* Mobile Top Header (only visible on mobile screens) */}
            <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden sticky top-0 z-30">
                <Link href="/student/dashboard" className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-sm">
                        in
                    </div>
                    <span className="text-base font-bold tracking-tight text-slate-900">
                        Student Portal
                    </span>
                </Link>
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:outline-none"
                    aria-label="Open navigation sidebar"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Drawer (Backdrop Overlay) */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Panel (Responsive: drawer on mobile, static on desktop) */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out md:sticky md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Sidebar Header */}
                <div className="flex h-16 items-center justify-between border-b border-slate-200/80 px-6">
                    <Link href="/student/dashboard" className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-sm">
                            in
                        </div>
                        <span className="text-base font-bold tracking-tight text-slate-900">
                            Student Portal
                        </span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden"
                        aria-label="Close navigation sidebar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation Items */}
                {renderNavLinks()}

                {/* Sidebar Footer (User Profile Section) */}
                <div className="border-t border-slate-200/80 bg-white p-4">
                    {profile && (
                        <Link
                            href="/student/profile"
                            onClick={() => setIsOpen(false)}
                            className="mb-2 flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 text-sm border border-blue-200">
                                {initials}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                    {profile.full_name}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                    {profile.degree || "Student"}
                                </p>
                            </div>
                        </Link>
                    )}
                    <SidebarLogoutButton onNavigate={() => setIsOpen(false)} />
                </div>
            </aside>
        </>
    );
}
