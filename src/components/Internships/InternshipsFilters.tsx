"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, SlidersHorizontal } from "lucide-react";
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

    const activeCount = [
        filters.work_mode,
        filters.internship_type,
        filters.min_stipend,
        filters.duration_unit,
        filters.eligible_semester,
        filters.eligible_programs,
    ].filter(Boolean).length;

    return (
        <div className="flex flex-wrap items-center gap-2">
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
                <PopoverTrigger className="inline-flex h-8 items-center rounded-full border border-slate-200 bg-white px-3 text-sm font-normal text-slate-600 hover:bg-slate-50">
                    <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
                    More filters
                    {activeCount > 0 && (
                        <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                            {activeCount}
                        </span>
                    )}
                </PopoverTrigger>
                <PopoverContent className="w-72 space-y-4" align="start">
                    <div>
                        <label className="text-xs font-medium text-slate-500">Minimum stipend</label>
                        <Input
                            type="number"
                            placeholder="e.g. 5000"
                            className="mt-1 border-slate-200"
                            value={filters.min_stipend ?? ""}
                            onChange={(e) => set({ min_stipend: e.target.value ? Number(e.target.value) : undefined })}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-500">Duration unit</label>
                        <Select
                            value={filters.duration_unit ?? "any"}
                            onValueChange={(v) => set({ duration_unit: v === "any" ? undefined : (v as DurationUnit) })}
                        >
                            <SelectTrigger className="mt-1 border-slate-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any</SelectItem>
                                {DURATION_UNITS.map((u) => (
                                    <SelectItem key={u} value={u}>
                                        {capitalize(u)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-500">Eligible program</label>
                        <Input
                            placeholder="e.g. Computer Science"
                            className="mt-1 border-slate-200"
                            value={filters.eligible_programs ?? ""}
                            onChange={(e) => set({ eligible_programs: e.target.value || undefined })}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-500">Eligible semester</label>
                        <Input
                            placeholder="e.g. 6"
                            className="mt-1 border-slate-200"
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
                    className="h-8 text-slate-500 hover:text-slate-900"
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
                    <X className="mr-1 h-3.5 w-3.5" />
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

    return (
        <Select
            value={currentValue}
            onValueChange={(v) => onChange(v === "all" ? undefined : v)}
        >
            <SelectTrigger className="h-8 w-auto min-w-27.5 rounded-full border-slate-200 text-sm font-normal text-slate-600 data-[state=open]:border-blue-600">
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