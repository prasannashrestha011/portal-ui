import { Suspense } from "react";

import {
    StudentApplicationsList,
    StudentApplicationsSkeleton,
} from "@/src/components/Applications/StudentApplicationsList";

export default function StudentApplicationsPage() {
    return (
        <Suspense fallback={<StudentApplicationsPageFallback />}>
            <StudentApplicationsList />
        </Suspense>
    );
}

function StudentApplicationsPageFallback() {
    return (
        <div className="min-h-full bg-slate-50/80 pb-14">
            <div className="h-44 animate-pulse bg-slate-200" />
            <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">
                <div className="h-16 animate-pulse rounded-2xl bg-slate-200" />
                <StudentApplicationsSkeleton />
            </div>
        </div>
    );
}
