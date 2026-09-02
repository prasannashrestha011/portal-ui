"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/src/context/useAuth";
import { authService } from "@/src/services/auth";

interface SidebarLogoutButtonProps {
    onNavigate?: () => void;
}

export default function SidebarLogoutButton({
    onNavigate,
}: SidebarLogoutButtonProps) {
    const router = useRouter();
    const clearUser = useAuthStore((state) => state.clearUser);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogout = async () => {
        if (isLoggingOut) return;

        setError(null);
        setIsLoggingOut(true);

        try {
            await authService.logout();
            clearUser();
            onNavigate?.();
            router.replace("/login");
            router.refresh();
        } catch {
            setError("Unable to sign out. Please try again.");
            setIsLoggingOut(false);
        }
    };

    return (
        <div>
            <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:bg-error-subtle hover:text-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring disabled:cursor-wait disabled:opacity-60"
            >
                {isLoggingOut ? (
                    <LoaderCircle className="size-4.5 shrink-0 animate-spin" />
                ) : (
                    <LogOut className="size-4.5 shrink-0 text-text-muted transition-colors group-hover:text-error" />
                )}
                <span>{isLoggingOut ? "Signing out..." : "Log out"}</span>
            </button>

            {error && (
                <p className="mt-2 px-3 text-xs font-medium text-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
