import { GetOrganization } from "@/actions/organization"
import { OrgSwitcher } from "@/components/org-switcher"
import ProjectList from "./_components/ProjectList"

const OrganizationPage = async ({ params }) => {
    const { orgId } = await params

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
                <ProjectList orgId = {organization.id}/>
            </div>

            <div className="mb-4">
                Show User assigned and reported issues here
            </div>
        </div>
    )
}

export default OrganizationPage
