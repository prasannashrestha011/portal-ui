import { Button } from '@/components/ui/button'
import { Link, Plus } from 'lucide-react'
import React from 'react'

const HeaderBanner = () => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Recruiter Overview</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Monitor your active internships openings, track candidate flow, and keep your company profile updated.
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="outline" className="border-slate-200 text-slate-200 hover:bg-slate-50 hover:text-slate-800" >
                    <Link href="/recruiter/profile">
                        Edit Profile
                    </Link>
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" >
                    <Link href="recruiter/internships/create" className="flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Post New Opening
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default HeaderBanner