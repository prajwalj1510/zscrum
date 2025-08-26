'use client';

import { sprintSchema } from '@/app/lib/validator';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { addDays, format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Loader } from 'lucide-react';
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import useFetch from '@/hooks/use-fetch';
import { createSprint } from '../../../../actions/sprints'
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


export const SprintCreationForm = ({
    projectTitle,
    projectKey,
    projectId,
    sprintKey,
}) => {

    const [showForm, setShowForm] = useState(false)
    const router = useRouter()

    const [dateRange, setDateRange] = useState({
        from: new Date(),
        to: addDays(new Date(), 14)
    })

    const { register, handleSubmit, formState: { errors }, control } = useForm({
        resolver: zodResolver(sprintSchema),
        defaultValues: {
            name: `${projectKey}-${sprintKey}`,
            startDate: dateRange.from,
            endDate: dateRange.to,
        }
    })

    const { loading, fn: createSprintFn } = useFetch(createSprint)

    const onSubmit = async (data) => {
        await createSprintFn(projectId, {
            ...data,
            startDate: dateRange.from,
            endDate: dateRange.to,
        })
        setShowForm(false)
        toast.success('Sprint created successfully')
        router.refresh()
    }

    return (
        <>
            <div className='flex justify-between'>
                <h1 className='text-5xl font-bold mb-8 gradient-title'>{projectTitle}</h1>
                <Button variant={showForm ? "destructive" : ""} className='mt-2' onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancel" : "Create a New Sprint"}
                </Button>
            </div>

            {/* Show Form */}
            {showForm && (
                <Card className='pt-4 mb-4'>
                    <CardContent>
                        <form className='flex gap-4 items-end' onSubmit={handleSubmit(onSubmit)}>
                            <div className='flex-1'>
                                <label className='block text-sm font-medium mb-1' htmlFor="name">Sprint Name</label>
                                <Input
                                    id='name'
                                    readOnly
                                    className='bg-slate-900'
                                    {...register('name')}
                                />
                                {errors.name && <p className='text-destructive text-sm'>{errors.name.message}</p>}
                            </div>

                            <div className='flex-1'>
                                <label className='block text-sm font-medium mb-2'>Sprint Duration</label>

                                <Controller
                                    control={control}
                                    name='dateRange'
                                    render={({ field }) => {
                                        return <Popover>
                                            <PopoverTrigger aschild>
                                                <Button type='button' variant={'outline'} className={`w-full justify-start text-left font-normal bg-slate-900 ${!dateRange && 'text-muted-foreground'}`}>
                                                    <CalendarIcon className='size-4 mr-2' />
                                                    {dateRange.from && dateRange.to ? (
                                                        format(dateRange.from, "LLL dd, y") + ' - ' + format(dateRange.to, "LLL dd, y")
                                                    ) : (
                                                        <span>Pick a Date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className='w-auto bg-slate-900' align='start'>
                                                <DayPicker
                                                    mode='range'
                                                    selected={dateRange}
                                                    onSelect={(range) => {
                                                        if (range.from && range?.to) {
                                                            setDateRange(range)
                                                            field.onChange(range)
                                                        }
                                                    }}
                                                    className={{
                                                        chevron: 'fill-blue-500',
                                                        range_start: 'bg-blue-700',
                                                        range_end: 'bg-blue-700',
                                                        range_middle: 'bg-blue-400',
                                                        day_button: 'border-none',
                                                        today: 'border-2 border-blue-700'
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    }}
                                />
                            </div>

                            <Button type='submit' disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader className='size-4 animate-spin' />
                                        Sprint creating...
                                    </>
                                ) : (
                                    'Create Sprint'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

        </>
    )
}