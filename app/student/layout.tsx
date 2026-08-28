import SideBar from "@/src/components/StudentProfile/SideBar";
import QueryProvider from "@/src/components/providers/QueryProvider";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">
            <SideBar />
            <main className="flex-1 overflow-y-auto bg-white">
                <QueryProvider>{children}</QueryProvider>
            </main>
        </div>
    );
}
