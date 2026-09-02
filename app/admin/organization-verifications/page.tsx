import { OrganizationVerificationsListPage } from "@/src/components/Admin/OrganizationVerificationsList";

type Props = {
    searchParams: Promise<{
        status?: string;
    }>;
};

export default async function Page({ searchParams }: Props) {
    const params = await searchParams;

    return (
        <OrganizationVerificationsListPage
            key={params.status ?? "all"}
            status={params.status}
        />
    );
}
