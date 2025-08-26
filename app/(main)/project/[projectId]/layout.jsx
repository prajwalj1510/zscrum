import { Suspense } from "react"
import { BarLoader } from "react-spinners"

const ProjectLayout = async ({ children }) => {
    return (
        <div className="mx-auto">
            <Suspense fallback={<BarLoader color="#36d7b7" width="100%"/>}>
                {children}
            </Suspense>
        </div>
    )
}

export default ProjectLayout