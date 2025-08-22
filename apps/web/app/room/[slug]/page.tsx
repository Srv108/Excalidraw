export default async function Room ({params} : {
    params: {
        slug: string
    }
}) {

    const id = (await params).slug;

    return <div className="text-white">
            {id} hi there
        </div>
    ;
}