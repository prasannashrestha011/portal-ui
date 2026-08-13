import SideBar from "@/src/components/RecruiterProfile/SideBar";
import { EmployerInitializer } from "@/src/components/providers/EmployerInitializer";

export default function EmployerLayout({ children }: LayoutProps<"/">) {
    return (
        <EmployerInitializer>
            <div className="flex h-screen">
                <SideBar />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </EmployerInitializer>
    );
}