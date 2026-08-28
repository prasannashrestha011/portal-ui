"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Banknote, GraduationCap, SlidersHorizontal, Timer, X } from "lucide-react";
import { InternshipSearchQueryParams, WorkMode, InternshipType, DurationUnit } from "../../types/internship";

interface InternshipFiltersProps {
    filters: InternshipSearchQueryParams;
    onChange: (filters: InternshipSearchQueryParams) => void;
}

const WORK_MODES: WorkMode[] = ["onsite", "remote", "hybrid"];
const TYPES: InternshipType[] = ["paid", "unpaid"];
const DURATION_UNITS: DurationUnit[] = ["weeks", "months"];

export function InternshipFilters({ filters, onChange }: InternshipFiltersProps) {
    const set = (patch: Partial<InternshipSearchQueryParams>) => onChange({ ...filters, ...patch, page: 1 });

    const advancedCount = [
        filters.min_stipend,
        filters.duration_unit,
        filters.eligible_semester,
        filters.eligible_programs,
    ].filter(Boolean).length;
    const activeCount = advancedCount + [filters.work_mode, filters.internship_type].filter(Boolean).length;

    return (
        <div className="flex flex-1 flex-wrap items-center gap-2">
            <PillSelect
                placeholder="Work mode"
                value={filters.work_mode}
                options={WORK_MODES.map((m) => ({ value: m, label: capitalize(m) }))}
                onChange={(v) => set({ work_mode: v as WorkMode | undefined })}
            />
            <PillSelect
                placeholder="Type"
                value={filters.internship_type}
                options={TYPES.map((t) => ({ value: t, label: capitalize(t) }))}
                onChange={(v) => set({ internship_type: v as InternshipType | undefined })}
            />

            <Popover>
                <PopoverTrigger className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-medium text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/50">
                    <SlidersHorizontal className="mr-1.5 size-3.5" />
                    More filters
                    {advancedCount > 0 && (
                        <span className="ml-1.5 flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                            {advancedCount}
                        </span>
                    )}
                </PopoverTrigger>
                <PopoverContent className="w-80 space-y-5 rounded-2xl border-slate-200 p-5 shadow-xl dark:border-slate-700" align="start">
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">More filters</p>
                        <p className="mt-0.5 text-xs text-slate-500">Narrow roles around your preferences.</p>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Minimum stipend</label>
                        <div className="relative mt-1.5">
                            <Banknote className="absolute left-3 top-3 size-4 text-slate-400" />
                            <Input
                                type="number"
                                placeholder="e.g. 5000"
                                className="h-10 border-slate-200 pl-9 dark:border-slate-700"
                                value={filters.min_stipend ?? ""}
                                onChange={(e) => set({ min_stipend: e.target.value ? Number(e.target.value) : undefined })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Duration unit</label>
                        <div className="relative mt-1.5">
                            <Timer className="pointer-events-none absolute left-3 top-3 z-10 size-4 text-slate-400" />
                            <Select
                                value={filters.duration_unit ?? "any"}
                                onValueChange={(v) => set({ duration_unit: v === "any" ? undefined : (v as DurationUnit) })}
                            >
                                <SelectTrigger className="h-10 border-slate-200 pl-9 dark:border-slate-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="any">Any duration</SelectItem>
                                    {DURATION_UNITS.map((u) => (
                                        <SelectItem key={u} value={u}>
                                            {capitalize(u)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Eligible program</label>
                        <div className="relative mt-1.5">
                            <GraduationCap className="absolute left-3 top-3 size-4 text-slate-400" />
                            <Input
                                placeholder="e.g. Computer Science"
                                className="h-10 border-slate-200 pl-9 dark:border-slate-700"
                                value={filters.eligible_programs ?? ""}
                                onChange={(e) => set({ eligible_programs: e.target.value || undefined })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Eligible semester</label>
                        <Input
                            placeholder="e.g. 6"
                            className="mt-1.5 h-10 border-slate-200 dark:border-slate-700"
                            value={filters.eligible_semester ?? ""}
                            onChange={(e) => set({ eligible_semester: e.target.value || undefined })}
                        />
                    </div>
                </PopoverContent>
            </Popover>

            {activeCount > 0 && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 rounded-xl px-3 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                    onClick={() =>
                        onChange({
                            ...filters,
                            work_mode: undefined,
                            internship_type: undefined,
                            min_stipend: undefined,
                            duration_unit: undefined,
                            eligible_programs: undefined,
                            eligible_semester: undefined,
                            page: 1,
                        })
                    }
                >
                    <X className="mr-1 size-3.5" />
                    Clear all
                </Button>
            )}
        </div>
    );
}

function PillSelect({
    placeholder,
    value,
    options,
    onChange,
}: {
    placeholder: string;
    value?: string;
    options: { value: string; label: string }[];
    onChange: (v: string | undefined) => void;
}) {
    // Always supply a string so the component stays strictly controlled
    const currentValue = value ?? "all";
    const isActive = Boolean(value);

    return (
        <Select
            value={currentValue}
            onValueChange={(v) => onChange(v == null || v === "all" ? undefined : v)}
        >
            <SelectTrigger className={`h-10 w-auto min-w-31 rounded-xl px-3.5 text-sm font-medium transition-colors data-[state=open]:border-blue-500 ${isActive
                ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
                : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-200 hover:bg-blue-50/60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                }`}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All {placeholder.toLowerCase()}s</SelectItem>
                {options.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                        {o.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
