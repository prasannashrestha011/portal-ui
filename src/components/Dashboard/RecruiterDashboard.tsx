'use client'
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Briefcase,
    Plus,
    Building2,
    Users,
    ArrowRight,
    TrendingUp,
    ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRecruiterProfileStore } from "@/src/context/useRecruiterProfile";

export default function EmployerSystemDashboard() {
    const router = useRouter();
    const { profile } = useRecruiterProfileStore()

    // Mock data reflecting your current scope (Jobs & Profile)
    const stats = [
        { title: "Active Jobs", value: "8", icon: Briefcase, change: "+2 this month", highlight: true },
        { title: "Total Applications", value: "142", icon: Users, change: "+24 new today", highlight: false },
        { title: "Profile Strength", value: "85%", icon: Building2, change: "Complete details for +20% reach", highlight: false },
    ];

    const recentJobs = [
        { id: "job-101", title: "Senior Full Stack Engineer", status: "published", type: "Full-Time", applicants: 34, posted: "3 days ago" },
        { id: "job-102", title: "Backend Go Developer", status: "published", type: "Remote", applicants: 19, posted: "5 days ago" },
        { id: "job-103", title: "UI/UX Product Designer", status: "draft", type: "Contract", applicants: 0, posted: "1 week ago" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans">

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                <div className="p-6 md:p-8 max-w-6xl mx-auto w-full space-y-8">

                    {/* Header Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Recruiter Overview</h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Monitor your active internships openings, track candidate flow, and keep your company profile updated.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="border-slate-200 text-slate-200 hover:bg-slate-50 hover:text-slate-800" >
                                <Link href="/employer/profile">
                                    Edit Profile
                                </Link>
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" >
                                <Link href="internships/create" className="flex items-center">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Post New Opening
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Core Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <Card key={i} className="border-slate-200 shadow-sm">
                                    <CardContent className="p-5">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                                                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                                            </div>
                                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3 text-emerald-600" />
                                            {stat.change}
                                        </p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Quick Access Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card
                            onClick={() => router.push("/jobs/create")}
                            className="border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer bg-linear-to-br from-white to-blue-50/30"
                        >
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="p-3 bg-blue-600 text-white rounded-lg shrink-0">
                                    <Plus className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-1">
                                        Post a New Job
                                        <ArrowRight className="h-4 w-4 text-blue-600 ml-auto" />
                                    </h3>
                                    <p className="text-xs text-slate-500">Create a new job listing with required skills, experience, and salary range.</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            onClick={() => router.push("/jobs")}
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
                            onClick={() => router.push("/profile")}
                            className="border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer bg-linear-to-br from-white to-indigo-50/30"
                        >
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="p-3 bg-indigo-600 text-white rounded-lg shrink-0">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-1">
                                        Company Profile
                                        <ArrowRight className="h-4 w-4 text-indigo-600 ml-auto" />
                                    </h3>
                                    <p className="text-xs text-slate-500">Update logo, company culture details, location, and social links.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Lower Section: Job Listing Overview & Profile Status */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Recent Job Postings Preview */}
                        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
                                <div>
                                    <CardTitle className="text-base font-bold">Recent Job Postings</CardTitle>
                                    <CardDescription>Overview of your active and draft listings</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" >
                                    <Link href="/jobs" className="flex items-center gap-1">
                                        View All
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100">
                                    {recentJobs.map((job) => (
                                        <div
                                            key={job.id}
                                            onClick={() => router.push(`/jobs/${job.id}`)}
                                            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/80 transition-colors cursor-pointer"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-slate-900 text-sm">{job.title}</p>
                                                    <Badge
                                                        variant="outline"
                                                        className={`border-none capitalize text-xs ${job.status === 'published'
                                                            ? 'bg-blue-50 text-blue-700 font-semibold'
                                                            : 'bg-slate-100 text-slate-600'
                                                            }`}
                                                    >
                                                        {job.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-slate-500 flex items-center gap-2">
                                                    <span>{job.type}</span>
                                                    <span>•</span>
                                                    <span>Posted {job.posted}</span>
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-sm font-semibold text-slate-900">{job.applicants}</p>
                                                    <p className="text-xs text-slate-400">Applicants</p>
                                                </div>
                                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600">
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>


                    </div>
                </div>
            </main>
        </div>
    );
}