"use client";

import { StudentProfileForm } from "@/src/components/StudentProfile/StudentProfileForm";
import Link from "next/link";

export default function StudentProfilePage() {
    return (
        <div className="relative min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
            {/* Background Ambient Glow & Grid Pattern */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-7xl bg-gradient-to-b from-blue-100/70 via-indigo-50/40 to-transparent blur-3xl opacity-80" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>

            {/* Page Header / Top Navigation Context */}
            <header className="relative z-10 border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
                        <Link href="/student/dashboard" className="transition-colors hover:text-slate-900">
                            Dashboard
                        </Link>
                        <svg className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-slate-900 font-semibold">Student Profile</span>
                    </nav>

                    {/* Quick Action / Status Badge */}
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/80">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Account Active
                        </span>
                        <Link
                            href="/student/dashboard"
                            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
                {/* Profile Completion / Recruiter Banner */}
                <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10">
                    <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200 border border-blue-400/20">
                                <svg className="h-3.5 w-3.5 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                                Stand Out to Recruiters
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                                Complete profiles get 3x more recruiter views
                            </h2>
                            <p className="text-sm text-blue-100/80 leading-relaxed">
                                Keep your contact details, academic milestones, and job preferences up to date so top employers can match you with the best roles.
                            </p>
                        </div>

                        {/* Quick Tip Pill */}
                        <div className="shrink-0 rounded-2xl bg-white/10 backdrop-blur-sm p-4 border border-white/10 text-xs text-blue-100 max-w-xs">
                            <p className="font-semibold text-white mb-1">💡 Quick Tip</p>
                            Add links to your GitHub or Portfolio to showcase real projects directly on your card.
                        </div>
                    </div>
                </div>

                {/* Form Wrapper Section */}
                <section className="relative">
                    <StudentProfileForm />
                </section>
            </main>

            {/* Base Footer */}
            <footer className="relative z-10 border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
                <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p>© {new Date().getFullYear()} Student Platform. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-800 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-slate-800 transition-colors">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}