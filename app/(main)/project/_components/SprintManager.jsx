'use client'
import { format, formatDistanceToNow, isAfter, isBefore } from 'date-fns'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BadgeAlert, Loader } from 'lucide-react'
import useFetch from '@/hooks/use-fetch'
import { updateSprintStatus } from '@/actions/sprints'
import { useRouter, useSearchParams } from 'next/navigation'

const SprintManager = ({ sprint, setCurrentSprint, sprints, projectId }) => {

    const [status, setStatus] = useState(sprint.status)

    const startDate = new Date(sprint.startDate)
    const endDate = new Date(sprint.endDate)
    const now = new Date()
    const searchParams = useSearchParams()
    const router = useRouter()

    const canStart = isBefore(now, endDate) && isAfter(now, startDate) && status === 'PLANNED'

    const canEnd = status === 'ACTIVE'

    const { fn: updateStatus, loading, error, data: updatedStatus } = useFetch(updateSprintStatus)

    const handleStatusChange =async (newStatus) => {
        updateStatus(sprint.id, newStatus)
    }

    useEffect(() => {
        if(updatedStatus && updatedStatus.success) {
            setStatus(updatedStatus.sprint.status)
            setCurrentSprint({
                ...sprint,
                status: updatedStatus.sprint.status,
            })
        }
    },[updatedStatus, loading])

    useEffect(()=>{
        const sprintId = searchParams.get('sprint')
        if(sprintId && sprintId !== sprint.id) {
            const selectedSprint = sprints.find((s) => s.id === sprintId)
            if(selectedSprint) {
                setCurrentSprint(selectedSprint)
                setStatus(selectedSprint.status)
            }
        }
    },[searchParams, sprints])

    const handleSprintChange = (value) => {
        const selectedSprint = sprints.find((sprint) => sprint.id === value)
        setCurrentSprint(selectedSprint)
        setStatus(selectedSprint.status)
        router.replace(`/project/${projectId}`, undefined, {shallow: true})
    }

    const getSprintStatus = () => {
        if (status === 'COMPLETED') {
            return 'Sprint Ended'
        }

        if (status === 'ACTIVE' && isAfter(now, endDate)) {
            return `Overdue by ${formatDistanceToNow(endDate)}`
        }

        if (status === 'ACTIVE') {
            return `Active`
        }

        if (status === 'PLANNED' && isBefore(now, startDate)) {
            return `Starts in ${formatDistanceToNow(startDate)}`
        }

        return null;
    }

    return (
        <>
            <div className='flex justify-between items-center gap-4'>
                <Select value={sprint.id} onValueChange={handleSprintChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Sprint" />
                    </SelectTrigger>
                    <SelectContent>
                        {sprints.map((sprint) => (
                            <SelectItem key={sprint.id} value={sprint.id}>
                                {sprint.name} ({format(sprint.startDate, "MMM d, yyyy")}) - ({format(sprint.endDate, "MMM d, yyyy")})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {canStart && (
                    <Button disabled={loading} onClick={() => handleStatusChange("ACTIVE")} variant='secondary' className='bg-green-500 text-white'>
                        {loading ? (
                            <>
                                <Loader className='size-4 animate-spin'/>
                                Sprint starting...
                            </>
                        ) : (
                            'Start Sprint'
                        )}
                    </Button>
                )}

                {canEnd && (
                    <Button disabled={loading} onClick={() => handleStatusChange("COMPLETED")} variant='ghost' className='bg-red-500 text-white'>
                        {loading ? (
                            <>
                                <Loader className='size-4 animate-spin' />
                                Sprint ending...
                            </>
                        ) : (
                            'End Sprint'
                        )}
                    </Button>
                )}

                {getSprintStatus() && (
                    <>
                        <Badge className='mt-3 ml-1 self-start h-10'>
                            <BadgeAlert className='size-20 text-green-500' />
                            {getSprintStatus()}
                        </Badge>
                    </>
                )}
            </div>
        </>
    )
}

export default SprintManager
