"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
    Building2,
    ChevronDown,
    CircleDot,
    LayoutDashboard,
    Menu,
    ShieldCheck,
    Users,
    X,
    type LucideIcon,
} from "lucide-react";
import SidebarLogoutButton from "@/src/components/Auth/SidebarLogoutButton";

interface NavItem {
    label: string;
    href: string;
    icon?: LucideIcon;
    children?: NavItem[];
}

const navItems: NavItem[] = [
    {
        label: "Overview",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Verifications",
        href: "/admin/organization-verifications",
        icon: Building2,
        children: [
            { label: "All requests", href: "/admin/organization-verifications" },
            {
                label: "Pending review",
                href: "/admin/organization-verifications?status=pending",
            },
            {
                label: "Verified",
                href: "/admin/organization-verifications?status=approved",
            },
            {
                label: "Rejected",
                href: "/admin/organization-verifications?status=rejected",
            },
        ],
    },
    {
        label: "User directory",
        href: "/admin/users",
        icon: Users,
    },
];

function pathFromHref(href: string) {
    return href.split("?")[0];
}

function isPathActive(pathname: string, href: string) {
    const hrefPath = pathFromHref(href);
    return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
}

function AdminSideBarContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(
            navItems
                .filter((item) => item.children && isPathActive(pathname, item.href))
                .map((item) => [item.href, true])
        )
    );

    const isLinkActive = (href: string) => {
        const [hrefPath, queryString] = href.split("?");

        if (pathname !== hrefPath) {
            return !queryString && pathname.startsWith(`${hrefPath}/`);
        }

        if (!queryString) {
            if (hrefPath === "/admin/organization-verifications") {
                const status = searchParams.get("status");
                return !status || !["pending", "approved", "rejected"].includes(status);
            }

            return true;
        }

        const expected = new URLSearchParams(queryString);
        return Array.from(expected.entries()).every(
            ([key, value]) => searchParams.get(key) === value
        );
    };

    const closeMobileNavigation = () => setIsMobileOpen(false);

    return (
        <>
            <div className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-sidebar-border bg-sidebar px-4 md:hidden">
                <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-3"
                    onClick={closeMobileNavigation}
                >
                    <span className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                        <ShieldCheck className="size-5" />
                    </span>
                    <span>
                        <span className="block text-sm font-bold tracking-tight text-sidebar-foreground">
                            Intern Hub
                        </span>
                        <span className="block text-[0.65rem] font-semibold tracking-[0.14em] text-text-muted uppercase">
                            Admin workspace
                        </span>
                    </span>
                </Link>
                <button
                    type="button"
                    onClick={() => setIsMobileOpen(true)}
                    className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring"
                    aria-label="Open admin navigation"
                    aria-expanded={isMobileOpen}
                >
                    <Menu className="size-5" />
                </button>
            </div>

            {isMobileOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-overlay backdrop-blur-xs md:hidden"
                    onClick={closeMobileNavigation}
                    aria-label="Close admin navigation"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-200 ease-out md:sticky md:top-0 md:h-dvh md:w-64 md:translate-x-0 md:shadow-none ${
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-5">
                    <Link
                        href="/admin/dashboard"
                        className="flex min-w-0 items-center gap-3"
                        onClick={closeMobileNavigation}
                    >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                            <ShieldCheck className="size-5" />
                        </span>
                        <span className="min-w-0">
                            <span className="block truncate text-base font-bold tracking-tight">
                                Intern Hub
                            </span>
                            <span className="block text-[0.65rem] font-semibold tracking-[0.14em] text-text-muted uppercase">
                                Admin workspace
                            </span>
                        </span>
                    </Link>
                    <button
                        type="button"
                        onClick={closeMobileNavigation}
                        className="rounded-lg p-2 text-text-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:hidden"
                        aria-label="Close admin navigation"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-5">
                    <p className="mb-2 px-3 text-[0.65rem] font-bold tracking-[0.16em] text-text-muted uppercase">
                        Management
                    </p>
                    <nav className="space-y-1" aria-label="Admin navigation">
                        {navItems.map((item) => {
                            const Icon = item.icon;

                            if (!item.children) {
                                const active = isLinkActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={closeMobileNavigation}
                                        aria-current={active ? "page" : undefined}
                                        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                                            active
                                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                                : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                                        }`}
                                    >
                                        {Icon && (
                                            <Icon
                                                className={`size-4.5 shrink-0 ${
                                                    active
                                                        ? "text-sidebar-primary"
                                                        : "text-text-muted group-hover:text-text-primary"
                                                }`}
                                            />
                                        )}
                                        <span className="flex-1">{item.label}</span>
                                        {active && (
                                            <span
                                                className="size-1.5 rounded-full bg-sidebar-primary"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </Link>
                                );
                            }

                            const groupActive = isPathActive(pathname, item.href);
                            const isOpen = openGroups[item.href] ?? groupActive;

                            return (
                                <div key={item.href}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenGroups((groups) => ({
                                                ...groups,
                                                [item.href]: !isOpen,
                                            }))
                                        }
                                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                                            groupActive
                                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                                : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                                        }`}
                                        aria-expanded={isOpen}
                                    >
                                        {Icon && (
                                            <Icon
                                                className={`size-4.5 shrink-0 ${
                                                    groupActive
                                                        ? "text-sidebar-primary"
                                                        : "text-text-muted group-hover:text-text-primary"
                                                }`}
                                            />
                                        )}
                                        <span className="flex-1 text-left">{item.label}</span>
                                        <ChevronDown
                                            className={`size-4 text-text-muted transition-transform ${
                                                isOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {isOpen && (
                                        <div className="relative ml-5 mt-1 space-y-0.5 border-l border-sidebar-border pl-4">
                                            {item.children.map((child) => {
                                                const active = isLinkActive(child.href);
                                                return (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        onClick={closeMobileNavigation}
                                                        aria-current={active ? "page" : undefined}
                                                        className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                                                            active
                                                                ? "font-semibold text-sidebar-primary"
                                                                : "font-medium text-text-muted hover:bg-surface-hover hover:text-text-primary"
                                                        }`}
                                                    >
                                                        <CircleDot
                                                            className={`size-3.5 ${
                                                                active
                                                                    ? "text-sidebar-primary"
                                                                    : "text-text-disabled"
                                                            }`}
                                                        />
                                                        {child.label}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </div>

                <div className="border-t border-sidebar-border p-4">
                    <div className="rounded-xl bg-surface-muted/60 p-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                            <ShieldCheck className="size-4 text-primary" />
                            Administrator
                        </div>
                        <p className="mt-1 text-xs leading-5 text-text-muted">
                            Management access enabled
                        </p>
                    </div>
                    <div className="mt-2">
                        <SidebarLogoutButton onNavigate={closeMobileNavigation} />
                    </div>
                </div>
            </aside>
        </>
    );
}

function SideBarFallback() {
    return (
        <aside className="hidden h-dvh w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:block" />
    );
}

export default function SideBar() {
    return (
        <Suspense fallback={<SideBarFallback />}>
            <AdminSideBarContent />
        </Suspense>
    );
}
