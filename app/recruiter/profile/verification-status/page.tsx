import VerificationStatus from "@/src/components/RecruiterProfile/VerificationStatus";
import { ShieldCheck } from "lucide-react";

const Page = () => {
    return (
        <main className="min-h-screen bg-muted/20">
            <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Employer</span>
                        <span>/</span>
                        <span>Verification</span>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-background shadow-sm">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                Organization verification
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                View the current status of your organization
                                verification request.
                            </p>
                        </div>
                    </div>
                </div>

                <VerificationStatus />
            </div>
        </main>
    );
};

export default Page;