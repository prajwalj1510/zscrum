'use server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server'

export const CreateIssue = async (projectId, data) => {
    const { userId, orgId } = await auth()

    if (!userId || !orgId) {
        throw new Error('Unauthorized')
    }

    let user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
    })

    const lastIssue = await prisma.issue.findFirst({
        where: {
            projectId,
            status: data.status
        },
        orderBy: { order: 'desc' }
    })

    const newOrder = lastIssue ? lastIssue.order + 1 : 0

    const issue = await prisma.issue.create({
        data: {
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            projectId: projectId,
            sprintId: data.sprintId,
            reporterId: user.id,
            assigneeId: data.assigneeId || null,
            order: newOrder,
        },
        include: {
            assignee: true,
            reporter: true,
        }
    })

    return issue

}

export const GetIssuesForSprint = async (sprintId) => {
    const { userId, orgId } = await auth()

    if (!userId || !orgId) {
        throw new Error('Unauthorized')
    }

    const issues = await prisma.issue.findMany({
        where: {
            sprintId: sprintId,
        },
        orderBy: [
            { status: 'asc' },
            { order: 'asc' },
        ],
        include: {
            assignee: true,
            reporter: true,
        }
    })

    return issues
}

export const updateIssueOrder = async (updatedIssues) => {
    const { userId, orgId } = await auth()

    if (!userId || !orgId) {
        throw new Error('Unauthorized')
    }

    await prisma.$transaction(async (prisma) => {
        for (const issue of updatedIssues) {
            await prisma.issue.update({
                where: {
                    id: issue.id,
                },
                data: {
                    status: issue.status,
                    order: issue.order,
                }
            })
        }
    })

    return { success: true }
}

export const deleteIssue = async (issueId) => {
    const { userId, orgId } = await auth()

    if (!userId || !orgId) {
        throw new Error('Unauthorized')
    }

    const user = await prisma.user.findUnique({
        where: {
            clerkUserId: userId,
        }
    })

    if (!user) {
        throw new Error('User not found')
    }

    const issue = await prisma.issue.findUnique({
        where: {
            id: issueId,
        },
        include: {
            project: true
        }
    })

    if (!issue) {
        throw new Error('Issue not found')
    }

    if (issue.reporterId !== user.id && !issue.project.adminIds.includes(user.id)) {
        throw new Error('You dont have permission to delete this issue')
    }

    await prisma.issue.delete({
        where: { id: issueId }
    })

    return { success: true }
}

export const updateIssue = async (issueId, data) => {
    const { userId, orgId } = await auth()

    if (!userId || !orgId) {
        throw new Error('Unauthorized')
    }

    try {
        const issue = await prisma.issue.findUnique({
            where: {
                id: issueId,
            },
            include: {
                project: true
            }
        })

        if (!issue) {
            throw new Error('Issue not found')
        }

        if (issue.project.organizationId !== orgId) {
            throw new Error('Unauthorized')
        }

        const updatedIssue = await prisma.issue.update({
            where: { id: issueId },
            data: {
                status: data.status,
                priority: data.priority,
            },
            include: {
                assignee: true,
                reporter: true,
            }
        })

        return updatedIssue

    } catch (error) {
        throw new Error(error.message)
    }
}

export const GetUserIssues = async (userId) => {
    const { orgId } = await auth()

    if (!userId || !orgId) {
        throw new Error('No user or organization found')
    }

    const user = await prisma.user.findUnique({
        where: {
            clerkUserId: userId,
        }
    })

    if (!user) {
        throw new Error('User not found')
    }

    const issues = await prisma.issue.findMany({
        where: {
            OR: [{ assigneeId: user.id }, { reporterId: user.id }],
            project: {
                organizationId: orgId,
            }
        },
        include: {
            project: true,
            assignee: true,
            reporter: true,
        },
        orderBy: { updatedAt: 'desc'}
    })

    return issues
}