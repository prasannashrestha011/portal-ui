import QueryProvider from "@/src/components/providers/QueryProvider";

export default function InternshipsLayout({ children }: LayoutProps<"/internships">) {
    return <QueryProvider>{children}</QueryProvider>;
}
