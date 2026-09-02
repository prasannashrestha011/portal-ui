import SideBar from "@/src/components/RecruiterProfile/SideBar";
import QueryProvider from "@/src/components/providers/QueryProvider";
import { RecruiterInitializer } from "@/src/components/providers/RecruiterInitializer";

export default function RecruiterLayout({ children }: LayoutProps<"/">) {
    return (
        <RecruiterInitializer>
            <div className="flex h-screen bg-background text-text-primary">
                <SideBar />
                <main className="flex-1 overflow-y-auto">
                    <QueryProvider>

                        {children}
                    </QueryProvider>
                </main>
            </div>
        </RecruiterInitializer>
    );
}
