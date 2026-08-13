// src/components/providers/EmployerInitializer.tsx
"use client";

import { useRecruiterProfileStore } from "@/src/context/useRecruiterProfile";
import { useEffect } from "react";

export function RecruiterInitializer({ children }: { children: React.ReactNode }) {
    const { isInitialized, initialize } = useRecruiterProfileStore();

    useEffect(() => {
        // Prevent refetching if data is already loaded in store
        if (!isInitialized) {
            initialize();
            console.log("RecruiterInitializer: Initializing recruiter profile...");
        }
    }, [isInitialized, initialize]);

    return <>{children}</>;
}