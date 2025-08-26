import { getProject } from "@/actions/projects"
import { notFound } from "next/navigation"
import React from "react"
import { SprintCreationForm } from '../_components/create-sprint'
import SprintBoard from '../_components/SprintBoard'

const ProjectPage = async ({ params }) => {

    const { projectId } = await params

    const project = await getProject(projectId)

    if (!project) {
        return notFound()
    }

    return (
        <div className="container mx-auto">
            {/* Sprint Creation Component */}
            <SprintCreationForm
                projectTitle={project.name}
                projectId={project.id}
                projectKey={project.key}
                sprintKey={project.sprints?.length + 1}
            />

            {/* Sprint Board */}
            {project.sprints.length > 0 ? (
                <>
                    <SprintBoard
                        sprints={project.sprints}
                        projectId={projectId}
                        orgId={project.organizationId}
                    />
                </>
            ) : (
                <div>
                    Create a Sprint from button above
                </div>
            )}
        </div>
    )
}

export default ProjectPage