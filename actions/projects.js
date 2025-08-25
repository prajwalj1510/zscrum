'use server'
import { prisma } from '@/lib/prisma'
import { auth, clerkClient } from '@clerk/nextjs/server'

export const createProject = async (data) => {
    const { userId, orgId } = await auth()

    if (!userId) {
        throw new Error('Unauthorized')
    }

    if (!orgId) {
        throw new Error('No Organization Selected')
    }

    const { data: membership } = await (await clerkClient()).organizations.getOrganizationMembershipList({
        organizationId: orgId,
    })

    const userMembership = membership.find(
        (member) => member.publicUserData.userId === userId
    )

    if (!userMembership || userMembership.role !== 'org:admin') {
        throw new Error('Only organization admins can create projects')
    }

    try {

        const project = await prisma.project.create({
            data: {
                name: data.name,
                key: data.key,
                description: data.description,
                organizationId: orgId,
            }
        })

        return project

    } catch (error) {
        console.log(error);
        throw new Error(error.message)

    }

}

export const getProjects = async (orgId) => {

    const { userId } = await auth()

    if (!userId) {
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

    const projects = await prisma.project.findMany({
        where: {
            organizationId: orgId
        },
        orderBy: {
            createdAt: 'desc'
        },
    })

    return projects
}

export const deleteProject = async (projectId) => {
    const { userId, orgId, orgRole } = await auth()

    if (!userId || !orgId) {
        throw new Error('Unauthorized')
    }

    if (orgRole !== 'org:admin') {
        throw new Error('Only Organization admins can delete projects!')
    }

    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
        }
    })

    if (!project || project.organizationId !== orgId) {
        throw new Error('Project not found or you dont have permission to delete it')
    }

    await prisma.project.delete({
        where: {
            id: projectId
        }
    })

    return { success: true }
}