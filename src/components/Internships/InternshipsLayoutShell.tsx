"use client";

import { useEffect, type ReactNode } from "react";

import AdminSideBar from "@/src/components/Admin/SideBar";
import RecruiterSideBar from "@/src/components/RecruiterProfile/SideBar";
import StudentSideBar from "@/src/components/StudentProfile/SideBar";
import { useAuthStore } from "@/src/context/useAuth";

function SideBarForRole({ role }: { role: string }) {
    switch (role.toLowerCase()) {
        case "student":
            return <StudentSideBar />;
        case "employer":
            return <RecruiterSideBar />;
        case "admin":
            return <AdminSideBar />;
        default:
            return null;
    }
}

export default function InternshipsLayoutShell({ children }: { children: ReactNode }) {
    const user = useAuthStore((state) => state.user);
    const initializeAuth = useAuthStore((state) => state.initializeAuth);

    useEffect(() => {
        void initializeAuth();
    }, [initializeAuth]);

    if (!user) return children;

    const isStudent = user.role.toLowerCase() === "student";

    return (
        <div className={isStudent ? "min-h-screen md:flex md:h-screen" : "flex h-screen"}>
            <SideBarForRole role={user.role} />
            <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
        </div>
    );
}
