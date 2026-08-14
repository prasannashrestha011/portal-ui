import InternshipEditForm from "@/src/components/Internships/InternshipEditForm"

type Props = {
    params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
    const { id } = await params

    console.log(id)

    return <InternshipEditForm id={id} />
}