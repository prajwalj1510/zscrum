import { getProjects } from '@/actions/projects'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'
import DeleteProject from './DeleteProject'

const ProjectList = async ({ orgId }) => {

    const projects = await getProjects(orgId)

    if(projects.length === 0) {
        return <p className='border border-dashed border-border p-10 hover:border-primary rounded-lg transition-colors flex flex-col gap-2 justify-center items-center'>
            No Projects Found. {" "}
            <Link href={`/project/create`} className='underline underline-offset-2 text-blue-200'>
                Create a New Project
            </Link>
        </p>
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-5 border border-dashed hover:border-green-400 rounded-xl transition-colors'>
            {projects.map((project, index) => (
                <Card key={index} className='border border-b-amber-200 mb-6 hover:-translate-x-2 hover:-translate-y-1 transition-transform'>
                    <CardHeader>
                        <CardTitle className='text-2xl font-semibold flex justify-between gap-2'>
                            {project.name}
                            <DeleteProject projectId={project.id}/>
                        </CardTitle>
                        <CardDescription className='text-sm text-muted-foreground'>
                            {project.key}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='text-lg text-muted-foreground flex justify-between gap-2'>
                        {project.description}
                        <Button asChild type='button' variant='secondary' className='text-orange-400 hover:underline hover:text-primary'>
                            <Link href={`/project/${project.id}`}>
                                Visit Project
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default ProjectList