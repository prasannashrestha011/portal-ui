import SideBar from "@/src/components/Admin/SideBar";
import QueryProvider from "@/src/components/providers/QueryProvider";

export default function AdminLayout({ children }: LayoutProps<"/">) {
    return (
        <QueryProvider>
            <div className="flex min-h-dvh flex-col bg-background text-text-primary md:h-dvh md:flex-row">
                <SideBar />

                <main className="min-h-0 flex-1 overflow-y-auto bg-background">
                    {children}
                </main>
            </div>
        </QueryProvider>
    );
}
