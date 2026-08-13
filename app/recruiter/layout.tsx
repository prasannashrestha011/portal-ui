import SideBar from "@/src/components/RecruiterProfile/SideBar";
import { RecruiterInitializer } from "@/src/components/providers/RecruiterInitializer";

export default function RecruiterLayout({ children }: LayoutProps<"/">) {
    return (
        <RecruiterInitializer>
            <div className="flex h-screen">
                <SideBar />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </RecruiterInitializer>
    );
}