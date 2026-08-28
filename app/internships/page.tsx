"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    AlertCircle,
    BriefcaseBusiness,
    ChevronLeft,
    ChevronRight,
    LoaderCircle,
    MapPin,
    Search,
    SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InternshipCard, InternshipCardSkeleton } from "@/src/components/Internships/InternshipCard";
import { InternshipFilters } from "@/src/components/Internships/InternshipsFilters";
import { internshipService } from "@/src/services/internship";
import { INTERNSHIP_STATUS, type InternshipSearchQueryParams } from "@/src/types/internship";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 350;

interface SearchTerms {
    keyword: string;
    location: string;
}

const EMPTY_SEARCH: SearchTerms = { keyword: "", location: "" };

export default function InternshipsPage() {
    const queryClient = useQueryClient();
    const [searchTerms, setSearchTerms] = useState<SearchTerms>(EMPTY_SEARCH);
    const [debouncedSearchTerms, applySearchTerms] = useDebouncedValue(
        searchTerms,
        searchTerms.keyword || searchTerms.location ? SEARCH_DEBOUNCE_MS : 0
    );
    const [filters, setFilters] = useState<InternshipSearchQueryParams>({
        page: 1,
        page_size: PAGE_SIZE,
    });

    const queryParams = useMemo<InternshipSearchQueryParams>(
        () => ({
            ...filters,
            q: debouncedSearchTerms.keyword || undefined,
            location: debouncedSearchTerms.location || undefined,
            status: INTERNSHIP_STATUS.PUBLISHED,
            exclude_expired: true,
        }),
        [debouncedSearchTerms, filters]
    );

    const {
        data: response,
        error,
        isError,
        isFetching,
        isPending,
        isPlaceholderData,
        refetch,
    } = useQuery({
        queryKey: ["internships", "search", queryParams],
        queryFn: async ({ signal }) => {
            const result = await internshipService.searchInternship(queryParams, signal);
            if (!result.success) {
                throw new Error(result.message || "Couldn't load internships.");
            }
            return result;
        },
        placeholderData: keepPreviousData,
        retry: 1,
        staleTime: 30_000,
    });

    const internships = response?.data ?? [];
    const total = response?.pagination?.total_size ?? internships.length;
    const page = queryParams.page ?? 1;
    const pageSize = queryParams.page_size ?? PAGE_SIZE;
    const totalPages = Math.max(
        1,
        response?.pagination?.total_pages ?? Math.ceil(total / pageSize)
    );
    const resultStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const resultEnd = Math.min(page * pageSize, total);
    const errorMessage =
        error instanceof Error && error.message
            ? error.message
            : "Couldn't load internships. Check your connection and try again.";

    const updateSearchTerm = (field: keyof SearchTerms, value: string) => {
        setSearchTerms((current) => ({ ...current, [field]: value }));
        setFilters((current) =>
            current.page === 1 ? current : { ...current, page: 1 }
        );
    };

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFilters((current) =>
            current.page === 1 ? current : { ...current, page: 1 }
        );
        applySearchTerms(searchTerms);
        void queryClient.invalidateQueries({
            queryKey: [
                "internships",
                "search",
                {
                    ...queryParams,
                    page: 1,
                    q: searchTerms.keyword || undefined,
                    location: searchTerms.location || undefined,
                },
            ],
            exact: true,
        });
    };

    const resetDiscovery = () => {
        setSearchTerms(EMPTY_SEARCH);
        applySearchTerms(EMPTY_SEARCH);
        setFilters({ page: 1, page_size: PAGE_SIZE });
    };

    return (
        <div className="min-h-screen bg-[#f6f8fc] text-slate-950 dark:bg-slate-950 dark:text-white">
            <section className="bg-[#071b33] text-white">
                <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pb-11 sm:pt-9 lg:px-8">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Find your next internship</h1>
                    <p className="mt-1.5 text-sm text-slate-300 sm:text-base">
                        Search verified opportunities by role, skill, or location.
                    </p>
                    <form
                        className="mt-5 grid gap-2 rounded-xl bg-white p-2 text-slate-950 shadow-[0_14px_40px_rgba(0,0,0,0.24)] md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_auto]"
                        onSubmit={handleSearch}
                    >
                        <label className="flex min-w-0 items-center gap-2.5 rounded-lg px-3 focus-within:bg-slate-50">
                            <Search className="size-5 shrink-0 text-slate-400" />
                            <Input
                                aria-label="Search internships"
                                placeholder="Search by title, skill, or keyword"
                                className="h-11 border-0 bg-transparent px-0 text-base shadow-none placeholder:text-slate-400 focus-visible:ring-0"
                                value={searchTerms.keyword}
                                onChange={(event) => updateSearchTerm("keyword", event.target.value)}
                            />
                        </label>

                        <label className="flex min-w-0 items-center gap-2.5 rounded-lg border-t border-slate-100 px-3 focus-within:bg-slate-50 md:border-l md:border-t-0">
                            <MapPin className="size-5 shrink-0 text-slate-400" />
                            <Input
                                aria-label="Filter internships by location"
                                placeholder="City or remote"
                                className="h-11 border-0 bg-transparent px-0 text-base shadow-none placeholder:text-slate-400 focus-visible:ring-0"
                                value={searchTerms.location}
                                onChange={(event) => updateSearchTerm("location", event.target.value)}
                            />
                        </label>

                        <Button
                            type="submit"
                            className="h-11 rounded-lg bg-blue-600 px-7 text-sm font-semibold text-white hover:bg-blue-700 md:h-full"
                        >
                            <Search className="size-4" />
                            Search
                        </Button>
                    </form>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="-mt-5 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-[0_12px_35px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 sm:p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex shrink-0 items-center gap-2 px-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                            <SlidersHorizontal className="size-4 text-blue-600" />
                            Refine your search
                        </div>
                        <div className="hidden h-6 w-px bg-slate-200 dark:bg-slate-700 sm:block" />
                        <InternshipFilters filters={filters} onChange={setFilters} />
                    </div>
                </div>

                <div className="flex flex-col gap-3 pb-6 pt-10 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Latest opportunities</p>
                        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                            Internships picked for you
                        </h2>
                        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                            {isPending
                                ? "Finding the best available roles..."
                                : total > 0
                                    ? `Showing ${resultStart}–${resultEnd} of ${total} opportunities`
                                    : "Explore roles from verified employers"}
                        </p>
                    </div>

                    {isFetching && !isPending && (
                        <div className="inline-flex items-center gap-2 text-sm font-medium text-blue-600" role="status">
                            <LoaderCircle className="size-4 animate-spin" />
                            Updating results
                        </div>
                    )}
                </div>

                <div
                    className={`transition-opacity duration-200 ${isFetching && !isPending ? "opacity-65" : "opacity-100"}`}
                    aria-busy={isFetching}
                >
                    {isPending && (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <InternshipCardSkeleton key={index} />
                            ))}
                        </div>
                    )}

                    {!isPending && isError && (
                        <div className="overflow-hidden rounded-2xl border border-red-100 bg-white text-center shadow-sm dark:border-red-950 dark:bg-slate-900">
                            <div className="h-1 bg-linear-to-r from-red-500 to-orange-400" />
                            <div className="px-6 py-14">
                                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                                    <AlertCircle className="size-7" />
                                </span>
                                <h3 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">We couldn&apos;t load the opportunities</h3>
                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{errorMessage}</p>
                                <Button
                                    className="mt-5 bg-blue-600 text-white hover:bg-blue-700"
                                    onClick={() => void refetch()}
                                >
                                    Try again
                                </Button>
                            </div>
                        </div>
                    )}

                    {!isPending && !isError && internships.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                <BriefcaseBusiness className="size-8" />
                            </span>
                            <h3 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">No exact matches yet</h3>
                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Try a broader keyword, another location, or clear your filters to see every available internship.
                            </p>
                            <Button
                                variant="outline"
                                className="mt-6 border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"
                                onClick={resetDiscovery}
                            >
                                Clear search and filters
                            </Button>
                        </div>
                    )}

                    {!isPending && !isError && internships.length > 0 && (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {internships.map((internship) => (
                                <InternshipCard key={internship.id} internship={internship} />
                            ))}
                        </div>
                    )}
                </div>

                {!isPending && !isError && internships.length > 0 && totalPages > 1 && (
                    <nav
                        className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row"
                        aria-label="Internship results pagination"
                    >
                        <Button
                            variant="ghost"
                            className="w-full justify-center text-slate-600 dark:text-slate-300 sm:w-auto"
                            disabled={page <= 1 || isPlaceholderData}
                            onClick={() => setFilters((current) => ({ ...current, page: page - 1 }))}
                        >
                            <ChevronLeft className="size-4" />
                            Previous
                        </Button>

                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                Page {page} of {totalPages}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">{total} total opportunities</p>
                        </div>

                        <Button
                            variant="ghost"
                            className="w-full justify-center text-slate-600 dark:text-slate-300 sm:w-auto"
                            disabled={page >= totalPages || isPlaceholderData}
                            onClick={() => setFilters((current) => ({ ...current, page: page + 1 }))}
                        >
                            Next
                            <ChevronRight className="size-4" />
                        </Button>
                    </nav>
                )}
            </main>
        </div>
    );
}

function useDebouncedValue<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
        return () => window.clearTimeout(timeout);
    }, [delay, value]);

    return [debouncedValue, setDebouncedValue] as const;
}
