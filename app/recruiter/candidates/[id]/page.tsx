import RecruiterApplicationDetailView from "@/src/components/Applications/RecruiterApplicationDetailView";

export default async function Page({
    params,
}: PageProps<"/recruiter/candidates/[id]">) {
    const { id } = await params;

    return <RecruiterApplicationDetailView id={id} />;
}
