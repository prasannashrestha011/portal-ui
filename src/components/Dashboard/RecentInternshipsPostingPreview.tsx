import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ExternalLink, ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { INTERNSHIP_STATUS, Internship } from '@/src/types/internship';
import { internshipService } from '@/src/services/internship';
import moment from "moment";
import { cn } from '@/lib/utils';

const RecentIntershipsPostingPreview = () => {
    const router = useRouter()

    const [recentInternships, setRecentInternships] = useState<Internship[]>([])
    useEffect(() => {

        const fetchRecentInternships = async () => {
            try {

                const data = await internshipService.listRecentInternship()
                setRecentInternships(data.data)

            } catch (error) {
                console.error("Error fetching recent internships:", error);
            }
        }
        fetchRecentInternships()
    }, [])

    return (
        <Card className="lg:col-span-2 border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
                <div>
                    <CardTitle className="workspace-section-title">Recent Internship Postings</CardTitle>
                    <CardDescription className="workspace-meta">Overview of your public and private listings</CardDescription>
                </div>
                <Link
                    href="/recruiter/internships/list"
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-primary hover:bg-primary-subtle hover:text-primary-hover")}
                >
                    View All
                    <ExternalLink className="h-3.5 w-3.5" />
                </Link>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-border">
                    {recentInternships.map((internship) => (
                        <div
                            key={internship.id}
                            onClick={() => router.push(`internships/list/${internship.id}`)}
                            className="p-4 sm:p-5 flex items-center justify-between hover:bg-surface-hover/80 transition-colors cursor-pointer"
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-text-primary text-sm">{internship.title}</p>
                                    <Badge
                                        variant="outline"
                                        className={`border-none capitalize text-xs ${internship.status === INTERNSHIP_STATUS.PUBLISHED
                                            ? 'bg-primary-subtle text-primary-hover font-semibold'
                                            : 'bg-surface-muted text-text-secondary'
                                            }`}
                                    >
                                        {internship.status}
                                    </Badge>
                                </div>
                                <p className="text-xs text-text-muted flex items-center gap-2">
                                    <span>{internship.internship_type}</span>
                                    <span>•</span>
                                    <span>Posted {moment(internship.created_at).fromNow()}</span>
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-text-primary">{internship.applicants}</p>
                                    <p className="text-xs text-text-muted">Applicants</p>
                                </div> */}
                                <Button variant="ghost" size="icon" className="text-text-muted hover:text-primary">
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

    )
}

export default RecentIntershipsPostingPreview
