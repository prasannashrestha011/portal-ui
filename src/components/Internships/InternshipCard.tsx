"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Clock, ExternalLink, Mail } from "lucide-react";
import { Internship } from "@/src/types/internship";
import { workModeLabel, formatStipend, formatDuration, formatRelativeTime } from "@/src/utils/internship";
import { useRouter } from "next/navigation";

export function InternshipCard({ internship }: { internship: Internship }) {
    const router = useRouter()
    return (
        <Card className="border-slate-200 hover:border-blue-600/40 transition-colors" >
            <CardContent className="p-4">
                <h3 className="font-semibold text-slate-900 leading-snug line-clamp-2">{internship.title}</h3>

                <div className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{internship.issuer.organization_name}</span>
                </div>

                <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                        {internship.location} · {workModeLabel(internship.work_mode)}
                    </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{formatStipend(internship)}</Badge>
                    {formatDuration(internship.duration, internship.duration_unit) && (
                        <Badge variant="outline" className="border-slate-200 text-slate-500 font-normal">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDuration(internship.duration, internship.duration_unit)}
                        </Badge>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{formatRelativeTime(internship.created_at)}</span>

                    {internship.application_url ? (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700" >
                            <a href={internship.application_url} target="_blank" rel="noopener noreferrer">
                                Apply
                                <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                            </a>
                        </Button>
                    ) : internship.application_email ? (
                        <Button size="sm" variant="default" className="border-slate-200 flex gap-1 items-center justify-center" onClick={() => router.push(`/internships/${internship.id}`)}>
                            <Mail className="mr-1.5 h-3.5 w-3.5" />
                            Apply
                        </Button>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    );
}

export function InternshipCardSkeleton() {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
            <div className="h-4 w-3/4 rounded bg-slate-100 animate-pulse" />
            <div className="h-3 w-1/2 rounded bg-slate-100 animate-pulse" />
            <div className="h-3 w-2/3 rounded bg-slate-100 animate-pulse" />
            <div className="flex gap-2">
                <div className="h-5 w-16 rounded bg-slate-100 animate-pulse" />
                <div className="h-5 w-16 rounded bg-slate-100 animate-pulse" />
            </div>
        </div>
    );
}