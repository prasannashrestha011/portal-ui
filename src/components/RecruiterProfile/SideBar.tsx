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

interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

const navItems: NavItem[] = [
    { label: "Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard },
    { label: "internships", href: "/recruiter/internships/list", icon: Briefcase },
    { label: "Candidates", href: "/recruiter/candidates", icon: Users },
    { label: "Verification", href: "/recruiter/profile/verification", icon: FileText },
    { label: "Settings", href: "/recruiter/settings", icon: Settings },
];

const SideBar = () => {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
            <div className="flex h-16 items-center border-b border-sidebar-border px-6">
                <span className="text-lg font-semibold">Intern Hub</span>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                {navItems.map(({ label, href, icon: Icon }) => {
                    const isActive =
                        pathname === href || pathname?.startsWith(`${href}/`);

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                }`}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
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
