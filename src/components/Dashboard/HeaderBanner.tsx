import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const HeaderBanner = () => {
    return (
        <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm sm:flex-row sm:items-center">
            <div>
                <h1 className="workspace-page-title text-text-primary">Recruiter Overview</h1>
                <p className="workspace-body mt-1 text-text-muted">
                    Monitor your active internships openings, track candidate flow, and keep your company profile updated.
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Link
                    href="/recruiter/profile"
                    className={cn(buttonVariants({ variant: "outline" }), "border-border bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary")}
                >
                    Edit Profile
                </Link>
                <Link
                    href="/recruiter/internships/create"
                    className={cn(buttonVariants(), "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover")}
                >
                    <Plus className="mr-1 size-4" />
                    Post New Opening
                </Link>
            </div>
        </div>
    )
}

export default HeaderBanner
