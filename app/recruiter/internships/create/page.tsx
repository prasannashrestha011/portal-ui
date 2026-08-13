"use client"
import React from "react";
import { Check, Lightbulb, ShieldCheck } from "lucide-react";
import { JobForm } from "@/src/components/Job/CreateInternShipForm";

export default function CreateJobPage() {



    return (
        <div className="min-h-screen bg-[#f3f2ef] pb-16 dark:bg-slate-950">

            <section className="bg-[#0a66c2] text-white">
                <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-11 lg:px-8">
                    <div className="max-w-2xl">
                        <p className="mb-2 text-sm font-semibold text-blue-100">Post a job</p>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Find your next great hire</h1>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                            Tell candidates what makes this opportunity stand out. You can review every detail before publishing.
                        </p>
                    </div>
                </div>
            </section>

            <main className="mx-auto grid max-w-6xl items-start gap-6 px-4 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
                <JobForm />

                <aside className="space-y-4 lg:sticky lg:top-6">
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.08)] dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-4 flex items-center gap-2">
                            <Lightbulb className="size-5 text-[#0a66c2]" />
                            <h2 className="font-semibold text-slate-900 dark:text-white">Tips for a strong post</h2>
                        </div>
                        <ul className="space-y-3 text-sm leading-5 text-slate-600 dark:text-slate-300">
                            {[
                                "Use a clear, searchable job title.",
                                "Describe the impact of the role, not only tasks.",
                                "Be transparent about salary and work mode.",
                                "Keep requirements focused on must-have skills.",
                            ].map((tip) => (
                                <li key={tip} className="flex gap-2.5">
                                    <Check className="mt-0.5 size-4 shrink-0 text-[#0a66c2]" />
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm dark:border-blue-900 dark:bg-blue-950/40">
                        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#0a66c2] dark:text-blue-400" />
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white">You&apos;re in control</p>
                            <p className="mt-1 leading-5 text-slate-600 dark:text-slate-300">Your job stays private until you choose to publish it.</p>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}
