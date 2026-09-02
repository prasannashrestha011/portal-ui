"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    RefreshCw,
    Search,
    SearchX,
    ShieldCheck,
    User as UserIcon,
    Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { User } from "@/src/types/auth";
import { adminService } from "@/src/services/admin";
import { PaginationBar } from "../shared/PaginationBar";
import { AdminPageHeader } from "./AdminPageHeader";

const PAGE_SIZE = 10;

function initials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

function RoleBadge({ role }: { role: string }) {
    const normalizedRole = role.toLowerCase();
    const isAdmin = normalizedRole === "admin";
    const isRecruiter = normalizedRole === "recruiter" || normalizedRole === "employer";

    const styles = isAdmin
        ? "border-primary/20 bg-primary-subtle text-primary-hover"
        : isRecruiter
          ? "border-accent/20 bg-accent-subtle text-accent-hover"
          : "border-border bg-surface-muted text-secondary-foreground";

    return (
        <Badge variant="outline" className={`gap-1.5 font-semibold capitalize ${styles}`}>
            {isAdmin ? <ShieldCheck className="size-3" /> : <UserIcon className="size-3" />}
            {role}
        </Badge>
    );
}

function UserTableSkeleton() {
    return Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index} className="border-border hover:bg-transparent">
            <TableCell>
                <div className="flex items-center gap-3">
                    <Skeleton className="size-9 rounded-full bg-surface-muted" />
                    <Skeleton className="h-4 w-32 bg-surface-muted" />
                </div>
            </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-44 bg-surface-muted" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-5 w-20 rounded-full bg-surface-muted" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-24 bg-surface-muted" />
            </TableCell>
        </TableRow>
    ));
}

export default function AdminListUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async (page: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await adminService.listUsers(page, PAGE_SIZE);
            setUsers(response.data ?? []);
            setTotalRecords(response.pagination?.total_size ?? response.data?.length ?? 0);
            setTotalPages(response.pagination?.total_pages ?? 1);
        } catch (fetchError) {
            setError(fetchError instanceof Error ? fetchError.message : "Failed to load users");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUsers(currentPage);
    }, [currentPage, fetchUsers]);

    const filteredUsers = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return users;

        return users.filter(
            (user) =>
                user.full_name.toLowerCase().includes(normalizedQuery) ||
                user.email.toLowerCase().includes(normalizedQuery) ||
                user.role.toLowerCase().includes(normalizedQuery)
        );
    }, [query, users]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <AdminPageHeader
                title="User directory"
                description="Browse registered accounts and identify the people who can access each part of Intern Hub."
                icon={Users}
                action={
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => fetchUsers(currentPage)}
                        disabled={loading}
                        className="border-border bg-surface text-text-primary hover:bg-surface-hover"
                    >
                        <RefreshCw className={loading ? "animate-spin" : ""} />
                        Refresh
                    </Button>
                }
            />

            <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" />
                        <Input
                            aria-label="Search users"
                            placeholder="Search by name, email, or role"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            className="h-10 border-border bg-background pl-9 text-text-primary"
                        />
                    </div>
                    <p className="workspace-meta shrink-0 text-text-muted" aria-live="polite">
                        {loading
                            ? "Loading users…"
                            : query
                              ? `${filteredUsers.length} shown on this page`
                              : `${totalRecords} total ${totalRecords === 1 ? "user" : "users"}`}
                    </p>
                </div>

                {error ? (
                    <div className="m-4 flex flex-col items-center rounded-xl border border-error/20 bg-error-subtle px-5 py-10 text-center sm:m-5">
                        <span className="flex size-11 items-center justify-center rounded-full bg-surface text-error">
                            <AlertCircle className="size-5" />
                        </span>
                        <h2 className="mt-3 font-semibold text-text-primary">Unable to load users</h2>
                        <p className="workspace-body mt-1 max-w-md text-text-secondary">{error}</p>
                        <Button
                            variant="outline"
                            className="mt-4 border-error/20 bg-surface text-error hover:bg-error-subtle"
                            onClick={() => fetchUsers(currentPage)}
                        >
                            Try again
                        </Button>
                    </div>
                ) : (
                    <Table className="min-w-180">
                        <TableHeader>
                            <TableRow className="border-border bg-surface-muted/60 hover:bg-surface-muted/60">
                                <TableHead className="px-5 text-text-secondary">User</TableHead>
                                <TableHead className="text-text-secondary">Email</TableHead>
                                <TableHead className="text-text-secondary">Role</TableHead>
                                <TableHead className="pr-5 text-text-secondary">Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <UserTableSkeleton />
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className="border-border hover:bg-surface-hover"
                                    >
                                        <TableCell className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-xs font-bold text-primary-hover ring-1 ring-primary/10">
                                                    {initials(user.full_name) || "U"}
                                                </div>
                                                <span className="font-semibold text-text-primary">
                                                    {user.full_name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-text-secondary">
                                            {user.email}
                                        </TableCell>
                                        <TableCell>
                                            <RoleBadge role={user.role} />
                                        </TableCell>
                                        <TableCell className="pr-5 text-text-muted">
                                            {new Date(user.created_at).toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={4} className="h-64 text-center">
                                        <SearchX className="mx-auto size-8 text-text-disabled" />
                                        <p className="mt-3 font-semibold text-text-primary">
                                            No users found
                                        </p>
                                        <p className="workspace-body mt-1 text-text-muted">
                                            Try a different name, email address, or role.
                                        </p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </section>

            {!error && !loading && (
                <PaginationBar
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    totalPages={totalPages}
                />
            )}
        </div>
    );
}
