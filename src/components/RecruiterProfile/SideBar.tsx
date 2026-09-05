"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Briefcase,
    Users,
    FileText,
    Settings,
    LucideIcon,
} from "lucide-react";
import SidebarLogoutButton from "@/src/components/Auth/SidebarLogoutButton";
import { cn } from "@/lib/utils";

interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

const navItems: NavItem[] = [
    { label: "Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard },
    { label: "Internships", href: "/recruiter/internships/list", icon: Briefcase },
    { label: "Candidates", href: "/recruiter/candidates", icon: Users },
    { label: "Verification", href: "/recruiter/profile/verification", icon: FileText },
    { label: "Settings", href: "/recruiter/settings", icon: Settings },
];

const SideBar = () => {
    const pathname = usePathname();

    return (
        <aside className="flex h-dvh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
            <div className="flex h-20 items-center border-b border-sidebar-border px-5">
                <Link href="/recruiter/dashboard" className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sm font-extrabold tracking-tight text-sidebar-primary-foreground shadow-sm">
                        IH
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate text-base font-bold tracking-tight">
                            Intern<span className="text-primary">Hub</span>
                        </span>
                        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-text-muted">
                            Recruiter workspace
                        </span>
                    </span>
                </Link>
            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-5">
                <p className="mb-2 px-3 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-text-muted">
                    Workspace
                </p>
                {navItems.map(({ label, href, icon: Icon }) => {
                    const isActive =
                        pathname === href || pathname?.startsWith(`${href}/`);

                    return (
                        <Link
                            key={href}
                            href={href}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm ring-1 ring-sidebar-border"
                                    : "text-text-secondary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            )}
                        >
                            <Icon className={cn(
                                "size-4.5 shrink-0 transition-colors",
                                isActive ? "text-primary" : "text-text-muted group-hover:text-sidebar-accent-foreground"
                            )} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-sidebar-border p-3">
                <SidebarLogoutButton />
            </div>
        </aside>
    );
};

export default SideBar;
