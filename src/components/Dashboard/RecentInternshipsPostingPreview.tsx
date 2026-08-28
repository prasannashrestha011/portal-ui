import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Link, ExternalLink, ArrowRight } from 'lucide-react'

import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { INTERNSHIP_STATUS, Internship } from '@/src/types/internship';
import { internshipService } from '@/src/services/internship';
import moment from "moment";

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
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
                <div>
                    <CardTitle className="text-base font-bold">Recent Internship Postings</CardTitle>
                    <CardDescription>Overview of your public and private listings</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" >
                    <Link href="internships/list" className="flex items-center gap-1">
                        View All
                        <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                    {recentInternships.map((internship) => (
                        <div
                            key={internship.id}
                            onClick={() => router.push(`internships/list/${internship.id}`)}
                            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/80 transition-colors cursor-pointer"
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-slate-900 text-sm">{internship.title}</p>
                                    <Badge
                                        variant="outline"
                                        className={`border-none capitalize text-xs ${internship.status === INTERNSHIP_STATUS.PUBLISHED
                                            ? 'bg-blue-50 text-blue-700 font-semibold'
                                            : 'bg-slate-100 text-slate-600'
                                            }`}
                                    >
                                        {internship.status}
                                    </Badge>
                                </div>
                                <p className="text-xs text-slate-500 flex items-center gap-2">
                                    <span>{internship.internship_type}</span>
                                    <span>•</span>
                                    <span>Posted {moment(internship.created_at).fromNow()}</span>
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-slate-900">{internship.applicants}</p>
                                    <p className="text-xs text-slate-400">Applicants</p>
                                </div> */}
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600">
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
