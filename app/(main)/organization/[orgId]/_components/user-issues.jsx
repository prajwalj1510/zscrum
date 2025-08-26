import React, { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IssueCard } from '@/components/issue-card'
import { GetUserIssues } from '@/actions/issues'

const UserIssues = async ({ userId }) => {

    const issues = await GetUserIssues(userId) 

    if(issues.length === 0) return null

    const assignedIssues = issues.filter(
        (issue) => issue.assignee.clerkUserId === userId
    )

    const reportedIssues = issues.filter(
        (issue) => issue.reporter.clerkUserId === userId
    )

    return (
        <div>
            <h1 className='text-5xl font-bold gradient-title mb-4'>My Issues</h1>

            <Tabs defaultValue="assigned" className="w-full">
                <TabsList>
                    <TabsTrigger value="assigned">Assigned to you</TabsTrigger>
                    <TabsTrigger value="reported">Reported by you</TabsTrigger>
                </TabsList>
                <TabsContent value="assigned">
                    <Suspense fallback={<p>Loading...</p>}>
                        <IssueGrid issues={assignedIssues} />
                    </Suspense>
                </TabsContent>
                <TabsContent value="reported">
                    <Suspense fallback={<p>Loading...</p>}>
                        <IssueGrid issues={reportedIssues} />
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function IssueGrid({issues}) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {issues?.map((issue) => (
                <IssueCard key={issue.id} issue={issue} showStatus/>
            ))}
        </div>
    )
}

export default UserIssues
