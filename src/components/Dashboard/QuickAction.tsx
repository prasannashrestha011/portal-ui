import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Briefcase, Building2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const QuickAction = () => {
    const router = useRouter()
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
                onClick={() => router.push("/recruiter/internships/create")}
                className="border-border hover:border-primary/60 hover:shadow-md transition-all cursor-pointer bg-linear-to-br from-surface to-primary-subtle/30"
            >
                <CardContent className="p-6 flex items-start gap-4">
                    <div className="p-3 bg-primary text-primary-foreground rounded-lg shrink-0">
                        <Plus className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="workspace-section-title flex items-center gap-1 text-text-primary">
                            Post a New Internship
                            <ArrowRight className="h-4 w-4 text-primary ml-auto" />
                        </h3>
                        <p className="workspace-meta text-text-muted">Create a new job listing with required skills, experience, and salary range.</p>
                    </div>
                </CardContent>
            </Card>

            <Card
                onClick={() => router.push("/recruiter/internships/list")}
                className="border-border hover:border-primary/60 hover:shadow-md transition-all cursor-pointer bg-linear-to-br from-surface to-surface-hover"
            >
                <CardContent className="p-6 flex items-start gap-4">
                    <div className="shrink-0 rounded-lg bg-text-primary p-3 text-text-inverse">
                        <Briefcase className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="workspace-section-title flex items-center gap-1 text-text-primary">
                            Manage Job Openings
                            <ArrowRight className="h-4 w-4 text-text-secondary ml-auto" />
                        </h3>
                        <p className="workspace-meta text-text-muted">View, publish, edit, or close existing openings across all departments.</p>
                    </div>
                </CardContent>
            </Card>

            <Card
                onClick={() => router.push("/recruiter/profile")}
                className="border-border hover:border-primary/60 hover:shadow-md transition-all cursor-pointer bg-linear-to-br from-surface to-accent-subtle/30"
            >
                <CardContent className="p-6 flex items-start gap-4">
                    <div className="shrink-0 rounded-lg bg-accent p-3 text-accent-foreground">
                        <Building2 className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="workspace-section-title flex items-center gap-1 text-text-primary">
                            Organization Profile
                            <ArrowRight className="h-4 w-4 text-accent ml-auto" />
                        </h3>
                        <p className="workspace-meta text-text-muted">Update logo, company culture details, location, and social links.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default QuickAction
