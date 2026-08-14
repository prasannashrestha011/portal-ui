import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Briefcase, Building2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const QuickAction = () => {
    const router = useRouter()
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
                onClick={() => router.push("internships/create")}
                className="border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer bg-linear-to-br from-white to-blue-50/30"
            >
                <CardContent className="p-6 flex items-start gap-4">
                    <div className="p-3 bg-blue-600 text-white rounded-lg shrink-0">
                        <Plus className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-1">
                            Post a New Internship
                            <ArrowRight className="h-4 w-4 text-blue-600 ml-auto" />
                        </h3>
                        <p className="text-xs text-slate-500">Create a new job listing with required skills, experience, and salary range.</p>
                    </div>
                </CardContent>
            </Card>

            <Card
                onClick={() => router.push("internships/list")}
                className="border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer bg-linear-to-br from-white to-slate-50"
            >
                <CardContent className="p-6 flex items-start gap-4">
                    <div className="p-3 bg-slate-900 text-white rounded-lg shrink-0">
                        <Briefcase className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-1">
                            Manage Job Openings
                            <ArrowRight className="h-4 w-4 text-slate-600 ml-auto" />
                        </h3>
                        <p className="text-xs text-slate-500">View, publish, edit, or close existing openings across all departments.</p>
                    </div>
                </CardContent>
            </Card>

            <Card
                onClick={() => router.push("profile")}
                className="border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer bg-linear-to-br from-white to-indigo-50/30"
            >
                <CardContent className="p-6 flex items-start gap-4">
                    <div className="p-3 bg-indigo-600 text-white rounded-lg shrink-0">
                        <Building2 className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-1">
                            Organization Profile
                            <ArrowRight className="h-4 w-4 text-indigo-600 ml-auto" />
                        </h3>
                        <p className="text-xs text-slate-500">Update logo, company culture details, location, and social links.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default QuickAction