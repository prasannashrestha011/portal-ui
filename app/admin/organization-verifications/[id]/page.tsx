import OrganizationVerificationDetail from "@/src/components/Admin/OrganizationVerificationDetail"

type Props = {
    params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
    const { id } = await params

    console.log(id)

    return <OrganizationVerificationDetail id={id} />
}