import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"]

const BoardFilters = ({
    issues,
    onFilterChange
}) => {

    const [searchItem, setSearchItem] = useState('')
    const [selectedAssignee, setSelectedAssignee] = useState([])
    const [selectedPriority, setSelectedPriority] = useState('')

    const assignees = issues?.map((issue) => issue.assignee).filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    )

    const isFilteredApplied = searchItem !== '' || selectedAssignee.length > 0 || selectedPriority !== ''

    const clearFilters = () => {
        setSearchItem('')
        setSelectedAssignee([])
        setSelectedPriority('')
    }

    useEffect(() => {
        const filteredIssues = issues.filter((issue) =>
            issue.title.toLowerCase().includes(searchItem.toLowerCase()) &&
            (selectedAssignee.length === 0 || selectedAssignee.includes(issue.assignee?.id)) &&
            (selectedPriority === '' || issue.priority === selectedPriority)
        )

        onFilterChange(filteredIssues)
    }, [searchItem, selectedAssignee, selectedPriority, issues])

    const toggleAssigne = (assigneeId) => {
        setSelectedAssignee((prev) => 
            prev.includes(assigneeId)
                ? prev.filter((id) => id !== assigneeId)
                : [...prev, assigneeId]
        )
    }

    return (
        <div>
            <div className='flex flex-col pr-2 sm:flex-row gap-4 sm:gap-6 mt-6'>
                <Input
                    className='w-full sm:w-72'
                    placeholder='Search issues...'
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                />

                <div className='flex shrink-0'>
                    <div className='flex gap-2 flex-wrap'>
                        {assignees?.map((assignee, index) => {

                            const selected = selectedAssignee.includes(assignee.id)

                            return (
                                <div
                                    key={assignee.id}
                                    className={`rounded-full ring ${selected ? 'ring-blue-600' : 'ring-black'} ${index > 0 ? '-ml-6' : ''} `}
                                    style={{
                                        zIndex: index,
                                    }}
                                    onClick={() => toggleAssigne(assignee.id)}
                                >
                                    <Avatar className='size-10'>
                                        <AvatarImage src={assignee.imageUrl} />
                                        <AvatarFallback>{assignee.name[0]}</AvatarFallback>
                                    </Avatar>
                                </div>)
                        })}
                    </div>
                </div>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger className='w-full sm:w-52'>
                        <SelectValue placeholder='Select Priority' />
                    </SelectTrigger>
                    <SelectContent>
                        {priorities.map((priority) => (
                            <SelectItem key={priority} value={priority}>
                                {priority}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {isFilteredApplied && (
                    <Button
                        className='flex items-center'
                        onClick={clearFilters}
                    >
                        <X className='mr-2 size-5' />
                        Clear Filters
                    </Button>
                )}
            </div>
        </div>
    )
}

export default BoardFilters
