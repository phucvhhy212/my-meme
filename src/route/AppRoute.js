import CreateMeme from "../pages/CreateMeme"
import Submission from "../pages/Submission"

const { useRoutes } = require("react-router-dom")


export default function AppRoute() {
    const elements = useRoutes([
        {
            path: "/create-meme",
            element: <CreateMeme/>
        },
        {
            path: "/submissions/:id",
            element: <Submission/>
        }
    ])
    return elements
}
