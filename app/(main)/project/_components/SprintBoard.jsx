'use client'
import React, { useState } from 'react'
import SprintManager from './SprintManager'

const SprintBoard = ({ sprints, projectId, orgId }) => {

    const [currentSprint, setCurrentSprint] = useState(
        sprints.find((sprint) => sprint.status === 'ACTIVE') || sprints[0]
    )

    return (
        <div>
            {/* Spring Manager */}
            <SprintManager
                sprint = {currentSprint}
                setCurrentSprint={setCurrentSprint}
                sprints = {sprints}
                projectId={projectId}
            />

            {/* Kanban Board */}
            SprintBoard
        </div>
    )
}

export default SprintBoard