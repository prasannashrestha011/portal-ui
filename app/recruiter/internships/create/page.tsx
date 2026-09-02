"use client"
import React from "react";
import { Check, Lightbulb, ShieldCheck } from "lucide-react";
import { IntershipForm } from "@/src/components/Internships/CreateInternShipForm";

export default function CreateInternshipForm() {



    return (
        <div className="min-h-screen bg-background pb-16 text-text-primary">

            <section className="bg-linear-to-br from-primary-active via-primary to-accent text-primary-foreground">
                <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-11 lg:px-8">
                    <div className="max-w-2xl">
                        <p className="mb-2 text-sm font-semibold text-primary-foreground/80">Post an internship</p>
                        <h1 className="workspace-page-title">Find your next great intern</h1>
                        <p className="workspace-body mt-3 max-w-xl text-primary-foreground/80">
                            Tell candidates what makes this opportunity stand out, then choose whether to publish it or keep it private.
                        </p>
                    </div>
                </div>
            </section>

            <main className="mx-auto grid max-w-6xl items-start gap-6 px-4 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
                <IntershipForm />

                <aside className="space-y-4 lg:sticky lg:top-6">
                    <div className="rounded-lg border border-border bg-surface p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <Lightbulb className="size-5 text-primary" />
                            <h2 className="workspace-section-title text-text-primary">Tips for a strong post</h2>
                        </div>
                        <ul className="space-y-3 text-sm leading-5 text-text-secondary">
                            {[
                                "Use a clear, searchable job title.",
                                "Describe the impact of the role, not only tasks.",
                                "Be transparent about salary and work mode.",
                                "Keep requirements focused on must-have skills.",
                            ].map((tip) => (
                                <li key={tip} className="flex gap-2.5">
                                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex gap-3 rounded-lg border border-primary/25 bg-primary-subtle p-4 text-sm">
                        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                        <div>
                            <p className="font-semibold text-text-primary">You&apos;re in control</p>
                            <p className="mt-1 leading-5 text-text-secondary">Use the visibility toggle before submitting to publish now or save the internship privately.</p>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}
