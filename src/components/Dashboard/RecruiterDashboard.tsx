'use client'
import React from "react";
import {
    Briefcase,
    Building2,
    Users,
    TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import QuickAction from "./QuickAction";
import HeaderBanner from "./HeaderBanner";
import RecentJobPostingPreview from "./RecentInternshipsPostingPreview";

export default function RecruiterSystemDashboard() {

    // Mock data reflecting your current scope (Jobs & Profile)
    const stats = [
        { title: "Active Jobs", value: "8", icon: Briefcase, change: "+2 this month", highlight: true },
        { title: "Total Applications", value: "142", icon: Users, change: "+24 new today", highlight: false },
        { title: "Profile Strength", value: "85%", icon: Building2, change: "Complete details for +20% reach", highlight: false },
    ];


    return (
        <div className="flex min-h-screen bg-background font-sans text-text-primary">

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                <div className="p-6 md:p-8 max-w-6xl mx-auto w-full space-y-8">

                    {/* Header Banner */}
                    <HeaderBanner />

                    {/* Core Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <Card key={i} className="border-border bg-surface shadow-sm">
                                    <CardContent className="p-5">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{stat.title}</p>
                                                <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
                                            </div>
                                            <div className="p-2.5 bg-primary-subtle text-primary rounded-lg">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-text-muted mt-3 flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3 text-success" />
                                            {stat.change}
                                        </p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Quick Access Actions */}
                    <QuickAction />

                    {/* Lower Section: Job Listing Overview & Profile Status */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Recent Job Postings Preview */}

                        <RecentJobPostingPreview />
                    </div>
                </div>
            </main>
        </div>
    );
}
