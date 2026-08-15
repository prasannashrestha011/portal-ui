"use client"
import { useEffect, useState, useCallback } from "react";
import { Loader2, ChevronLeft, ChevronRight, Search, ShieldCheck, User as UserIcon, RefreshCw, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { User } from "@/src/types/auth";
import { adminService } from "@/src/services/admin";
import { PaginationBar } from "../shared/PaginationBar";

const PAGE_SIZE = 10;

function initials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("");
}

function RoleBadge({ role }: { role: string }) {
    const isAdmin = role.toLowerCase() === "admin";
    return (
        <Badge
            variant="outline"
            className="gap-1 border-[#E2E8F0] font-normal"
            style={{
                background: isAdmin ? "#EEF2FF" : "#F1F5F9",
                color: isAdmin ? "#3730A3" : "#0F172A",
            }}
        >
            {isAdmin ? <ShieldCheck className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
            {role}
        </Badge>
    );
}

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { bg: string; fg: string }> = {
        active: { bg: "#DCFCE7", fg: "#16A34A" },
        inactive: { bg: "#F1F5F9", fg: "#64748B" },
        suspended: { bg: "#FEE2E2", fg: "#DC2626" },
    };
    const c = map[status.toLowerCase()] ?? map.inactive;
    return (
        <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize"
            style={{ background: c.bg, color: c.fg }}
        >
            {status}
        </span>
    );
}

export default function AdminListUsers() {
    const [users, setUsers] = useState<User[]>([]);

    /* Pagination states*/
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [total, setTotal] = useState(0);

    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async (p: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminService.listUsers(p, PAGE_SIZE);
            setUsers(res.data ?? []);
            setTotal(res.pagination?.total_pages ?? res.data?.length ?? 0);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load users");
        } finally {
            setLoading(false);
        }
    }, []);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUsers(currentPage);
    }, [currentPage, fetchUsers]);

    const filtered = query
        ? users.filter(
            (u) =>
                u.full_name.toLowerCase().includes(query.toLowerCase()) ||
                u.email.toLowerCase().includes(query.toLowerCase())
        )
        : users;

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    return (
        <div className="mx-auto max-w-5xl p-6 text-slate-900">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Users</h1>
                    <p className="text-sm text-slate-500">{total} total</p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchUsers(page)}
                    disabled={loading}
                    className="border-slate-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                    <RefreshCw
                        className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                </Button>
            </div>

            <div className="relative mb-4 w-full max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />

                <Input
                    placeholder="Search name or email"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border-slate-200 pl-8 focus-visible:ring-indigo-500"
                />
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-100 hover:bg-slate-100">
                            <TableHead className="text-slate-700">
                                User
                            </TableHead>
                            <TableHead className="text-slate-700">
                                Email
                            </TableHead>
                            <TableHead className="text-slate-700">
                                Role
                            </TableHead>
                            <TableHead className="text-slate-700">
                                Status
                            </TableHead>
                            <TableHead className="text-slate-700">
                                Joined
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filtered.map((u) => (
                            <TableRow
                                key={u.id}
                                className="border-slate-200 hover:bg-slate-50"
                            >
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-medium text-indigo-800">
                                            {initials(u.full_name)}
                                        </div>

                                        <span className="font-medium text-slate-900">
                                            {u.full_name}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell className="text-slate-600">
                                    {u.email}
                                </TableCell>

                                <TableCell>
                                    <RoleBadge role={u.role} />
                                </TableCell>

                                <TableCell>
                                    <StatusBadge status={u.role} />
                                </TableCell>

                                <TableCell className="text-slate-500">
                                    {new Date(u.created_at).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <PaginationBar currentPage={currentPage} onPageChange={handlePageChange} totalPages={total} />
        </div>
    );
}