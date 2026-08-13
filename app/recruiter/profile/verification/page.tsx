"use client";

import VerificationForm from "@/src/components/RecruiterProfile/VerificationForm";
import { useEmployerProfileStore } from "@/src/context/useRecruiterProfile";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
    const router = useRouter();
    const profile = useEmployerProfileStore((state) => state.profile);

    useEffect(() => {
        if (
            profile &&
            profile.verification_status !== "draft"
        ) {
            router.replace("/employer/profile");
        }
    }, [profile, router]);

    if (!profile || profile.verification_status !== "draft") {
        return null;
    }

    return (
        <main className="min-h-screen bg-muted/20">
            <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Employer</span>
                        <span>/</span>
                        <span>Organization verification</span>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-background shadow-sm">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                Organization verification
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                                Verify your organization to complete your
                                employer profile.
                            </p>
                        </div>
                    </div>
                </div>

                <VerificationForm />
            </div>
        </main>
    );
};

export default Page;