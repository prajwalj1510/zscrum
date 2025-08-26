'use client'
import React, { useEffect, useState } from 'react'
import SprintManager from './SprintManager'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import statuses from '../../../../data/status'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import CreateIssueDrawer from './create-issue'
import useFetch from '@/hooks/use-fetch'
import { GetIssuesForSprint, updateIssueOrder } from '@/actions/issues'
import { BarLoader } from 'react-spinners'
import { IssueCard } from '../../../../components/issue-card'
import { toast } from 'sonner'
import BoardFilters from '../_components/board-filters'

const reorder = (list, startIndex, endIndex) => {

    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result;

}

const SprintBoard = ({ sprints, projectId, orgId }) => {

    const [currentSprint, setCurrentSprint] = useState(
        sprints.find((sprint) => sprint.status === 'ACTIVE') || sprints[0]
    )

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState(null)

    const handleAddIssue = (status) => {
        setSelectedStatus(status)
        setIsDrawerOpen(true)
    }

    const {
        loading: issueLoading,
        error: issueError,
        fn: fetchIssues,
        data: issues,
        setData: setIssues
    } = useFetch(GetIssuesForSprint)

    useEffect(() => {
        if (currentSprint.id) {
            fetchIssues(currentSprint.id)
        }
    }, [currentSprint.id])

    // console.log(issues);

    const [filteredIssues, setFilteredIssues] = useState(issues)

    const handleFilterChange = (newFilteredIssues) => {
        setFilteredIssues(newFilteredIssues)

    }

    const handleIssueCreated = () => {
        // fetch issues on board
        fetchIssues(currentSprint.id)
    }

    const {
        fn: updateIssueOrderFn,
        loading: updateIssueLoading,
        error: updateIssueError,
    } = useFetch(updateIssueOrder)

    const onDragEnd = async (result) => {
        if (currentSprint.status === 'PLANNED') {
            toast.warning('Start the sprint to update board')
            return;
        }

        if (currentSprint.status === 'COMPLETED') {
            toast.warning('Cannot update board after sprint end')
        }

        const { destination, source } = result

        if(!destination) {
            return;
        }

        if(destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const newOrderedData = [...issues] 

        const sourceList = newOrderedData.filter(
            (list) => list.status === source.droppableId
        )

        const destinationList = newOrderedData.filter(
            (list) => list.status === destination.droppableId
        )

        // if source and dest are same
        if(source.droppableId === destination.droppableId) {
            const reorderedCards = reorder(sourceList, source.index, destination.index)

            reorderedCards.forEach(
                (card, index) => {card.order = index}
            )
        } else {
            // remove card from the source list
            const [movedCard] = sourceList.splice(source.index,1) 

            // assign the new list id to the moved card
            movedCard.status = destination.droppableId

            // add new card to the destination list
            destinationList.splice(destination.index,0, movedCard)

            sourceList.forEach(
                (card, index) => card.order = index
            )

            destinationList.forEach(
                (card, index) => card.order = index
            )
        }

        const sortedIssues = newOrderedData.sort((a,b) => a.order - b.order)
        setIssues(newOrderedData, sortedIssues)

        //api call 
        updateIssueOrderFn(sortedIssues)
    }

    if (issueError) return <div>Error Loading issues...</div>

    return (
        <div>
            {/* Spring Manager */}
            <SprintManager
                sprint={currentSprint}
                setCurrentSprint={setCurrentSprint}
                sprints={sprints}
                projectId={projectId}
            />

            {issues && !issueLoading && (
                <BoardFilters 
                    issues = {issues}
                    onFilterChange={handleFilterChange} 
                />
            )}

            {updateIssueError && (
                <p className='text-red-500 mt-2'>{updateIssueError.message}</p>
            )}

            {(issueLoading || updateIssueLoading) && (
                <BarLoader className='mt-4' width={"100%"} color='#36d7b7' />
            )}

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-600 p-4 rounded-lg'>
                    {statuses.map((column) => (
                        <Droppable key={column.key} droppableId={column.key}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className='space-y-2'
                                >
                                    <h3 className='font-semibold mb-2 text-center'>{column.name}</h3>
                                    {/* Issues */}
                                    {filteredIssues?.filter(
                                        (issue) => issue.status === column.key
                                    ).map((issue, index) => (
                                        <Draggable
                                            key={issue.id}
                                            draggableId={issue.id}
                                            index={index}
                                            isDragDisabled={updateIssueLoading}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <IssueCard 
                                                        issue={issue} 
                                                        onDelete={() => fetchIssues(currentSprint.id)}
                                                        onUpdate={
                                                            (updated) => setIssues((issues) => issues.map((issue) => {
                                                                if(issue.id === updated.id) {
                                                                    return updated;
                                                                }
                                                                return issue ;
                                                            }))
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))
                                    }

                                    {provided.placeholder}
                                    {column.key === "TODO" && currentSprint.staus !== "COMPLETED" && (
                                        <Button
                                            className='w-full'
                                            onClick={() => handleAddIssue(column.key)}
                                        >
                                            <Plus className='size-5 mr-2' />
                                            Create Issue
                                        </Button>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            <CreateIssueDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                sprintId={currentSprint.id}
                status={selectedStatus}
                projectId={projectId}
                onIssueCreated={handleIssueCreated}
                orgId={orgId}
            />

        </div>
    )
}

export default SprintBoard