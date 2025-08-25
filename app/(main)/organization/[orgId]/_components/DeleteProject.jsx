'use client'
import { deleteProject } from '@/actions/projects'
import { Button } from '@/components/ui/button'
import useFetch from '@/hooks/use-fetch'
import { useOrganization } from '@clerk/nextjs'
import { Loader, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

const DeleteProject = ({ projectId }) => {
    const { membership } = useOrganization()
    const router = useRouter()

    const isAdmin = membership?.role === 'org:admin'

    const {
        data: project,
        loading: isDeleting,
        error,
        fn: deleteProjectFn
    } = useFetch(deleteProject)

    const handleDelete = () => {
        if(window.confirm('Are you sure you want to delete this project?')) {
            deleteProjectFn(projectId)
        }
    }

    useEffect(() => {
        if(project?.success) {
            router.refresh()
            toast.success('Project Deleted!')
        }
    }, [project])

    if (!isAdmin) return null;

    return (
        <Button size='sm' onClick={handleDelete} disabled={isDeleting} variant={'destructive'} className='hover:text-pink-200'>
            {isDeleting ? (
                <>
                    <Loader className='size-5 animate-spin'/>
                    Deleting...
                </>
            ) : (
                <>
                    <Trash2 className='size-5 ml-2' />
                    Delete
                </>
            )
            }
            {error && <p className='text-destructive text-sm'>{error.message}</p>}
        </Button >
    )
}

export default DeleteProject
