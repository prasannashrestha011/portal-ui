import InternshipView from "@/src/components/Internships/InternshipView"

type Props = {
    params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
    const { id } = await params

    console.log(id)

    return <InternshipView id={id} />
}