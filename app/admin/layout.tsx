
import QueryProvider from "@/src/components/providers/QueryProvider";
import { RecruiterInitializer } from "@/src/components/providers/RecruiterInitializer";

export default function AdminLayout({ children }: LayoutProps<"/">) {
    return (
        <RecruiterInitializer>
            <div className="flex h-screen">
                <main className="flex-1 overflow-y-auto">
                    <QueryProvider>

                        {children}
                    </QueryProvider>
                </main>
            </div>
        </RecruiterInitializer>
    );
}