import InternshipsLayoutShell from "@/src/components/Internships/InternshipsLayoutShell";
import QueryProvider from "@/src/components/providers/QueryProvider";

export default function InternshipsLayout({ children }: LayoutProps<"/internships">) {
    return (
        <QueryProvider>
            <InternshipsLayoutShell>{children}</InternshipsLayoutShell>
        </QueryProvider>
    );
}
