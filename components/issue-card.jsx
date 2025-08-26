'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { UserAvatar } from './user-avatar'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'
import IssueDetailsDailog from '@/components/IssueDetailsDailog '

const prioityColor = {
    LOW: 'border-green-500',
    MEDIUM: 'border-yellow-500',
    HIGH: 'border-orange-500',
    URGENT: 'border-red-500',
}

export const IssueCard = ({
    issue,
    showStatus = false,
    onDelete = () => { },
    onUpdate = () => { },
}) => {

    const [isDailogOpen, setIsDailogOpen] = useState(false)
    const router = useRouter()

    const onDeleteHandler = (...params) => {
        router.refresh();
        onDelete(...params)
    }

    const onUpdateHandler = (...params) => {
        router.refresh()
        onUpdate(...params)
    }

    const created = formatDistanceToNow(new Date(issue.createdAt), {
        addSuffix: true,
        includeSeconds: true,
    })

    return (
        <>
            <Card onClick={() => setIsDailogOpen(true)} className='cursor-pointer hover:shadow-lg transition-shadow'>
                <CardHeader className={`border-t-2 ${prioityColor[issue.priority]} rounded-lg`}>
                    <CardTitle className='text-lg mt-2'>{issue.title}</CardTitle>
                </CardHeader>
                <CardContent className='flex gap-2 -mt-3'>
                    {showStatus && (
                        <Badge>{issue.status}</Badge>
                    )}
                    <Badge className='-ml-1'>
                        {issue.priority}
                    </Badge>
                </CardContent>
                <CardFooter className='flex flex-col items-start space-y-3'>
                    <UserAvatar user={issue.assignee} />
                    <div className='text-xs text-zinc-400'>Created {created}</div>
                </CardFooter>
            </Card>

            {isDailogOpen && (
                <IssueDetailsDailog
                    isOpen={isDailogOpen}
                    onClose={() => setIsDailogOpen(false)}
                    issue={issue}
                    onDelete={onDeleteHandler}
                    onUpdate={onUpdateHandler}
                    borderCol={prioityColor[issue.priority]}
                />
            )}
        </>
    )
}
