import InternshipDetail from "@/src/components/Internships/InternshipDetail"

type Props = {
    params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
    const { id } = await params

    return <InternshipDetail id={id} />
}