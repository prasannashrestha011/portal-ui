"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LayoutDashboard, LucideIcon, Users } from "lucide-react";

interface NavItem {
    label: string;
    href: string;
    icon?: LucideIcon;
    children?: NavItem[];
}

const navItems: NavItem[] = [
    {
        label: "Org's Verification", href: "/admin/organization-verifications", icon: LayoutDashboard,
        children: [
            { label: "Pending", href: "/admin/organization-verifications?status=pending" },
            { label: "Reviewed", href: "/admin/organization-verifications?status=reviewed" },
            { label: "Approved", href: "/admin/organization-verifications?status=approved" },
            { label: "Rejected", href: "/admin/organization-verifications?status=rejected" }
        ]
    },
    {
        label: "Users",
        href: "/admin/users",
        icon: Users,
        children: [
            { label: "All users", href: "/admin/users" },
            { label: "Admins", href: "/admin/users?role=admin" },
            { label: "Recruiters", href: "/admin/users?role=recruiter" },
        ],
    },
];

function isActivePath(pathname: string | null, href: string) {
    return pathname === href || (pathname?.startsWith(`${href}/`) ?? false);
}

function hasActiveChild(pathname: string | null, item: NavItem): boolean {
    if (!item.children) return false;
    return item.children.some(
        (c) => isActivePath(pathname, c.href) || hasActiveChild(pathname, c)
    );
}

function NavLink({
    item,
    pathname,
    depth,
}: {
    item: NavItem;
    pathname: string | null;
    depth: number;
}) {
    const active = isActivePath(pathname, item.href);
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            className={`flex items-center gap-3 rounded-md py-2 text-sm font-medium transition-colors ${active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
            style={{ paddingLeft: 12 + depth * 20, paddingRight: 12 }}
        >
            {Icon && <Icon className="h-4 w-4 shrink-0" />}
            {item.label}
        </Link>
    );
}

function NavGroup({
    item,
    pathname,
    depth,
}: {
    item: NavItem;
    pathname: string | null;
    depth: number;
}) {
    const [open, setOpen] = useState(() => hasActiveChild(pathname, item));
    const Icon = item.icon;
    const parentActive = isActivePath(pathname, item.href) && !hasActiveChild(pathname, item);

    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`flex w-full items-center gap-3 rounded-md py-2 text-sm font-medium transition-colors ${parentActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                style={{ paddingLeft: 12 + depth * 20, paddingRight: 12 }}
            >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && (
                <div className="mt-1 space-y-1">
                    {item.children!.map((child) => (
                        <NavEntry key={child.href} item={child} pathname={pathname} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

function NavEntry({
    item,
    pathname,
    depth,
}: {
    item: NavItem;
    pathname: string | null;
    depth: number;
}) {
    if (item.children && item.children.length > 0) {
        return <NavGroup item={item} pathname={pathname} depth={depth} />;
    }
    return <NavLink item={item} pathname={pathname} depth={depth} />;
}

const SideBar = () => {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
            <div className="flex h-16 items-center border-b border-sidebar-border px-6">
                <span className="text-lg font-semibold">Intern Hub</span>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                {navItems.map((item) => (
                    <NavEntry key={item.href} item={item} pathname={pathname} depth={0} />
                ))}
            </nav>
        </aside>
    );
};

export default SideBar;