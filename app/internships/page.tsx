"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import { InternshipCardSkeleton, InternshipCard } from "@/src/components/Internships/InternshipCard";
import { internshipService } from "@/src/services/internship";
import { InternshipSearchQueryParams, Internship } from "@/src/types/internship";
import { InternshipFilters } from "@/src/components/Internships/InternshipsFilters";

const PAGE_SIZE = 12;

export default function InternshipsPage() {
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");
    const [filters, setFilters] = useState<InternshipSearchQueryParams>({ page: 1, page_size: PAGE_SIZE });
    const [internships, setInternships] = useState<Internship[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const queryParams = useMemo<InternshipSearchQueryParams>(
        () => ({
            ...filters,
            q: keyword || undefined,
            location: location || undefined,
            status: "published",
            exclude_expired: true,
        }),
        [filters, keyword, location]
    );

    useEffect(() => {
        const timeout = setTimeout(fetchInternships, keyword || location ? 350 : 0);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryParams]);

    async function fetchInternships() {
        setLoading(true);
        setError(null);
        try {
            const res = await internshipService.searchInternship(queryParams);
            if (res.success) {
                console.log("Fetched internships:", res.data);
                setInternships(res.data);
                setTotal(res.pagination?.total_size ?? res.data.length);
            } else {
                setError(res.message || "Couldn't load internships.");
            }
        } catch {
            setError("Couldn't load internships. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const page = filters.page ?? 1;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-linear-to-r from-blue-700 to-blue-600 px-4 py-8 sm:px-8">
                <div className="mx-auto max-w-6xl">
                    <h1 className="text-2xl font-bold text-white sm:text-3xl">Find your next internship</h1>
                    <p className="mt-1 text-blue-100">{total > 0 ? `${total} internships open right now` : "Search roles from verified employers"}</p>

                    <div className="mt-5 flex flex-col gap-2 rounded-lg bg-white text-black p-2 shadow-sm sm:flex-row">
                        <div className="flex flex-1 items-center gap-2 px-2">
                            <Search className="h-4 w-4 shrink-0 text-slate-400" />
                            <Input
                                placeholder="Job title, skill, or company"
                                className="border-0 shadow-none focus-visible:ring-0 px-0"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>
                        <div className="hidden w-px bg-slate-200 sm:block" />
                        <div className="flex flex-1 items-center gap-2 px-2">
                            <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                            <Input
                                placeholder="Location"
                                className="border-0 shadow-none focus-visible:ring-0 px-0"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700 sm:px-6" onClick={fetchInternships}>
                            Search
                        </Button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-8">
                <div className="mx-auto max-w-6xl">
                    <InternshipFilters filters={filters} onChange={setFilters} />
                </div>
            </div>

            {/* Grid */}
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8">
                {loading && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <InternshipCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
                        <p className="font-medium text-slate-900">Something went wrong</p>
                        <p className="mt-1 text-sm text-slate-500">{error}</p>
                        <Button variant="outline" size="sm" className="mt-3 border-slate-200" onClick={fetchInternships}>
                            Try again
                        </Button>
                    </div>
                )}

                {!loading && !error && internships.length === 0 && (
                    <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
                        <Briefcase className="mx-auto h-8 w-8 text-slate-300" />
                        <p className="mt-2 font-medium text-slate-900">No internships match your search</p>
                        <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search terms.</p>
                    </div>
                )}

                {!loading && !error && internships.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {internships.map((internship) => (
                            <InternshipCard key={internship.id} internship={internship} />
                        ))}
                    </div>
                )}

                {!loading && !error && internships.length > 0 && totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-200"
                            disabled={page <= 1}
                            onClick={() => setFilters((f) => ({ ...f, page: page - 1 }))}
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Prev
                        </Button>
                        <span className="text-sm text-slate-400">
                            Page {page} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-200"
                            disabled={page >= totalPages}
                            onClick={() => setFilters((f) => ({ ...f, page: page + 1 }))}
                        >
                            Next
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}