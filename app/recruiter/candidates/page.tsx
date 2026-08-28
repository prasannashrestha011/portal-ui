import { Suspense } from "react";

import {
    RecruiterApplicationsInbox,
    RecruiterApplicationsInboxSkeleton,
} from "@/src/components/Applications/RecruiterApplicationsInbox";

export default function Page() {
    return (
        <Suspense fallback={<RecruiterApplicationsInboxSkeleton />}>
            <RecruiterApplicationsInbox />
        </Suspense>
    );
}
