"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Clock, ExternalLink, Mail } from "lucide-react";
import { internshipService } from "@/src/services/internship";
import { Internship } from "@/src/types/internship";
import { workModeLabel, formatStipend, formatDuration } from "@/src/utils/internship";

const InternshipDetail = ({ id }: { id: string }) => {
    const [internship, setInternship] = useState<Internship | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        internshipService
            .getInternshipById(id)
            .then((res) => (res.success ? setInternship(res.data) : setError(true)))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-3xl px-4 py-10 text-slate-500">Loading...</div>
            </div>
        );
    }

    if (error || !internship) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-3xl px-4 py-10 text-slate-500">Internship not found.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-3xl px-4 py-10">
                <h1 className="text-2xl font-bold text-slate-900">{internship.title}</h1>

                <div className="mt-2 flex items-center gap-1.5 text-slate-600">
                    <Building2 className="h-4 w-4" />
                    {internship.issued_by}
                </div>

                <div className="mt-1 flex items-center gap-1.5 text-slate-500">
                    <MapPin className="h-4 w-4" />
                    {internship.location} · {workModeLabel(internship.work_mode)}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{formatStipend(internship)}</Badge>
                    {formatDuration(internship.duration, internship.duration_unit) && (
                        <Badge variant="outline" className="border-slate-200 text-slate-500 font-normal">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDuration(internship.duration, internship.duration_unit)}
                        </Badge>
                    )}
                </div>

                <div className="mt-6 flex gap-2">
                    {internship.application_url && (
                        <Button className="bg-blue-600 hover:bg-blue-700" >
                            <a href={internship.application_url} target="_blank" rel="noopener noreferrer">
                                Apply now
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    )}
                    {internship.application_email && (
                        <Button variant="default" className="border-slate-200" >
                            <a href={`mailto:${internship.application_email}`} className="flex gap-1 items-center">
                                <Mail className="mr-2 h-4 w-4" />
                                Email application
                            </a>
                        </Button>
                    )}
                </div>

                <div className="mt-8 space-y-6">
                    <div>
                        <h2 className="font-semibold text-slate-900">About</h2>
                        <p className="mt-1 whitespace-pre-line text-slate-600">{internship.description}</p>
                    </div>

                    {internship.responsibilities && (
                        <div>
                            <h2 className="font-semibold text-slate-900">Responsibilities</h2>
                            <p className="mt-1 whitespace-pre-line text-slate-600">{internship.responsibilities}</p>
                        </div>
                    )}

                    {internship.required_skills && (
                        <div>
                            <h2 className="font-semibold text-slate-900">Required skills</h2>
                            <p className="mt-1 text-slate-600">{internship.required_skills}</p>
                        </div>
                    )}

                    {internship.eligible_programs && (
                        <div>
                            <h2 className="font-semibold text-slate-900">Eligibility</h2>
                            <p className="mt-1 text-slate-600">{internship.eligible_programs}</p>
                        </div>
                    )}

                    {internship.benefits && (
                        <div>
                            <h2 className="font-semibold text-slate-900">Benefits</h2>
                            <p className="mt-1 whitespace-pre-line text-slate-600">{internship.benefits}</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex gap-2">
                    <Button variant="default" size={"lg"} className="border-slate-200" >
                        Apply now
                    </Button>

                </div>
            </div>
        </div>
    );
};

export default InternshipDetail;