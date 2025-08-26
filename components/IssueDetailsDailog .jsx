'use client'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { ExternalLink, Loader } from 'lucide-react'
import { useOrganization, useUser } from '@clerk/nextjs'
import useFetch from '@/hooks/use-fetch'
import { deleteIssue, updateIssue } from '@/actions/issues'
import { BarLoader } from 'react-spinners'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import statuses from '@/data/status'
import MDEditor from '@uiw/react-md-editor'
import { UserAvatar } from './user-avatar'

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"]

const IssueDetailsDailog = ({
    isOpen,
    onClose,
    issue,
    onDelete = () => { },
    onUpdate = () => { },
    borderCol = ''
}) => {

    const [status, setStatus] = useState(issue.status)
    const [priority, setPriority] = useState(issue.priority)

    const { user } = useUser()
    const { membership } = useOrganization()

    const pathname = usePathname()
    const router = useRouter()

    const {
        loading: deleteLoading,
        error: deleteError,
        fn: deleteIssueFn,
        data: deleted,
    } = useFetch(deleteIssue)

    const {
        loading: updateLoading,
        error: updateError,
        fn: updateIssueFn,
        data: updated
    } = useFetch(updateIssue)

    const handleStatusChange = async (newStatus) => {
        setStatus(newStatus)
        updateIssueFn(issue.id, { status: newStatus, priority })
    }

    const handlePriorityChange = async (newPriority) => {
        setPriority(newPriority)
        updateIssueFn(issue.id, { status, priority: newPriority })
    }

    useEffect(() => {
        if (deleted) {
            onClose()
            onDelete()
        }

        if (updated) {
            onUpdate(updated)
        }
    }, [deleted, updated, deleteLoading, updateLoading])

    const canChange = user.id === issue.reporter.clerkUserId || membership.role === 'org:admin'

    const handleGoToProject = () => {
        router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}`)
    }

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this issue?')) {
            deleteIssueFn(issue.id)
        }
    }

    const isProjectPage = pathname.startsWith('/project/')

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent>
                    <DialogHeader className='flex justify-between items-center'>
                        <div>
                            <DialogTitle className='text-3xl'>{issue.title}</DialogTitle>
                        </div>
                        {!isProjectPage && (
                            <Button
                                size='icon'
                                onClick={handleGoToProject}
                                title='Go to Project'
                            >
                                <ExternalLink className='size-4' />
                            </Button>
                        )}
                    </DialogHeader>
                    {(updateLoading || deleteLoading) && (
                        <BarLoader width={"100%"} color='#36d7b7' />
                    )}

                    <div className='space-y-4'>
                        <div className='flex items-center space-x-3'>
                            <Select value={status} onValueChange={handleStatusChange}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select Status' />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((option) => (
                                        <SelectItem key={option.key} value={option.key}>
                                            {option.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select disabled={!canChange} value={priority} onValueChange={handlePriorityChange}>
                                <SelectTrigger className={`border ${borderCol} rounded`}>
                                    <SelectValue placeholder='Select Priority' />
                                </SelectTrigger>
                                <SelectContent>
                                    {priorityOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <h4 className='font-semibold'>Description</h4>
                            <MDEditor.Markdown
                                className='rounded-md px-2 py-1 mt-2'
                                source={issue.description ? issue.description : '--'}
                            />
                        </div>

                        <div className='flex justify-between'>
                            <div className='flex flex-col gap-2'>
                                <h4 className='font-semibold'>Assignee</h4>
                                <UserAvatar user={issue.assignee} />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <h4 className='font-semibold'>Reporter</h4>
                                <UserAvatar user={issue.reporter} />
                            </div>
                        </div>

                        {canChange && (
                            <Button
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                variant='destructive'
                            >
                                {deleteLoading ? (
                                    <>
                                        <Loader className='size-4 animate-spin' />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete Issue'
                                )}
                            </Button>
                        )}

                        {(deleteError || updateError) && (
                            <p className='text-red-500 text-sm'>
                                {deleteError?.message || updateError?.message}
                            </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default IssueDetailsDailog 