'use client';

import React, { useEffect } from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { issueSchema } from '@/app/lib/validator';
import useFetch from '@/hooks/use-fetch';
import { CreateIssue } from '@/actions/issues'
import { GetOrganizationUsers } from '@/actions/organization'
import { Loader } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import MDEditor from '@uiw/react-md-editor'
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CreateIssueDrawer = ({
    isOpen,
    onClose,
    sprintId,
    status,
    projectId,
    onIssueCreated,
    orgId
}) => {

    const { control, register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(issueSchema),
        defaultValues: {
            prioity: 'MEDIUM',
            description: '-',
            assigneeId: '',
        }
    })

    const {
        loading: createIssueLoading,
        fn: createIssueFn,
        error,
        data: newIssue
    } = useFetch(CreateIssue)

    useEffect(() => {
        if (newIssue) {
            reset()
            onClose()
            onIssueCreated()
            toast.success('Issue added successfully')
        }
    }, [newIssue, createIssueLoading])

    const {
        loading: usersLoading,
        fn: fetchUsers,
        data: users,
    } = useFetch(GetOrganizationUsers)

    useEffect(() => {
        if (isOpen && orgId) {
            fetchUsers(orgId)
        }
    }, [isOpen, orgId])

    const onSubmit = async (data) => {
        // console.log(data);
        
        await createIssueFn(projectId, {
            ...data,
            status,
            sprintId,
            priority: data.prioity,
        })


    }

    return (
        <>
            <Drawer open={isOpen} onClose={onClose} >
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle className='text-xl font-semibold mb-2'>Create New Issue</DrawerTitle>
                    </DrawerHeader>
                    {usersLoading && (
                        <div className='flex self-center mb-5'>
                            <Loader className='size-10 animate-spin' />
                        </div>
                    )}

                    <form className='p-4 space-y-4' onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="title" className='block text-sm font-medium mb-1'>Title</label>
                            <Input
                                id='title'
                                {...register('title')}
                            />
                            {errors.title && (
                                <p className='text-destructive text-sm mt-1'>{errors.title.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="assigneeId" className='block text-sm font-medium mb-1'>Assignee</label>

                            <Controller
                                control={control}
                                name='assigneeId'
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Assignee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users?.map((user) => {
                                                return <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                                            })}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.assigneeId && (
                                <p className='text-destructive text-sm mt-1'>{errors.assigneeId.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="description" className='block text-sm font-medium mb-1'>Description</label>

                            <Controller
                                name='description'
                                control={control}
                                render={({ field }) => (
                                    <MDEditor value={field.value} onChange={field.onChange} />
                                )}
                            />

                            {errors.description && (
                                <p className='text-destructive text-sm mt-1'>{errors.description.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="priority" className='block text-sm font-medium mb-1'>Priority</label>

                            <Controller
                                control={control}
                                name='prioity'
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LOW">Low</SelectItem>
                                            <SelectItem value="MEDIUM">Medium</SelectItem>
                                            <SelectItem value="HIGH">High</SelectItem>
                                            <SelectItem value="URGENT">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.prioity && (
                                <p className='text-destructive text-sm mt-1'>{errors.prioity.message}</p>
                            )}
                        </div>

                        {error && <p className='text-destructive text-sm mt-2'>{error.message}</p>}

                        <Button type='submit' disabled={createIssueLoading} className='w-full'>
                            {createIssueLoading ? <>
                                <Loader className='size-4 animate-spin' />
                                Creating Issue...
                            </> : ('Create Issue')}
                        </Button>
                    </form>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default CreateIssueDrawer
