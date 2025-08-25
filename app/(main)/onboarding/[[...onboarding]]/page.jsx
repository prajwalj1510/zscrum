'use client'
import { OrganizationList, useOrganization } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const OnboardingPage = () => {

    const { organization } = useOrganization()
    const router = useRouter()

    useEffect(() => {
        // console.log(organization);
        if(organization) {
            router.push(`/organization/${organization.slug}`)
        }
        
    },[organization])

    return (
        <div className="flex justify-center items-center pt-14">
            <OrganizationList 
                hidePersonal
                afterCreateOrganizationUrl="/organization/:slug"
                afterSelectOrganizationUrl="/organization/:slug"
            />
        </div>
    )
}

export default OnboardingPage