'use server'
import { prisma } from '@/lib/prisma'
import { auth, clerkClient } from '@clerk/nextjs/server'

export const GetOrganization = async (slug) => {
    const { userId } = await auth()

    if (!userId) {
        throw new Error('Unauthorized')
    }

    const user = await prisma.user.findUnique({
        where: {
            clerkUserId: userId
        },
    })

    if (!user) {
        throw new Error('User not found')
    }

    const organization = await (await clerkClient()).organizations.getOrganization({
        slug: slug,
    })

    // console.log(organization);


    if (!organization) {
        return null;
    }

    const { data: membership } = await (await clerkClient()).organizations.getOrganizationMembershipList({
        organizationId: organization.id,
    })

    // console.log(membership);


    const userMembership = membership?.find(
        (member) => member.publicUserData.userId === userId
    )

    if (!userMembership) {
        return null;
    }

    return organization;
}

export const GetOrganizationUsers = async (orgId) => {
    const { userId } = await auth()

    if (!userId) {
        throw new Error('Unauthorized')
    }

    const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
    })

    if (!user) {
        throw new Error('User not found')
    }

    const { data: membership } = await (await clerkClient()).organizations.getOrganizationMembershipList({
        organizationId: orgId,
    })

    const userIds = membership?.map(
        (member) => member.publicUserData.userId
    )

    const users = await prisma.user.findMany({
        where: {
            clerkUserId : {
                in: userIds,
            }
        }
    })

    return users
}