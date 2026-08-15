import SideBar from "@/src/components/Admin/SideBar";
import QueryProvider from "@/src/components/providers/QueryProvider";

export default function AdminLayout({ children }: LayoutProps<"/">) {
    return (
        <QueryProvider>
            <div className="flex h-screen">
                <SideBar />

                <main className="flex-1 overflow-y-auto bg-white">
                    {children}
                </main>
            </div>
        </QueryProvider>
    );
}