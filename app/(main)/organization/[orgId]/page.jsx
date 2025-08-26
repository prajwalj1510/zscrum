import { GetOrganization } from "@/actions/organization"
import { OrgSwitcher } from "@/components/org-switcher"
import ProjectList from "./_components/ProjectList"
import UserIssues from './_components/user-issues'
import { auth } from '@clerk/nextjs/server'
import { redirect } from "next/navigation"

const OrganizationPage = async ({ params }) => {
    const { orgId } = await params
    const { userId } = await auth()

    if(!userId) {
        redirect('/sign-in')
    }

    const organization = await GetOrganization(orgId)

    if (!organization) {
        return <div>Organization not found</div>
    }

    return (
        <div className="container mx-auto">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
                <h1 className="text-5xl font-semibold gradient-title pb-2">
                    {organization.name.toUpperCase()}&apos;s Projects
                </h1>

                {/* Org Switcher */}

                <OrgSwitcher />

            </div>

            <div className="mb-4">
                <ProjectList orgId={organization.id} />
            </div>

            <div className="mb-4">
                <UserIssues userId={userId} />
            </div>
        </div>
    )
}

export default OrganizationPage
