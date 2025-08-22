import Navbar from "./CanvasNavbar"

type data = {
    roomId: string
}
export default function Canvas ({
    roomId
}: data) {

    return <div>
        <Navbar />
    </div>
}