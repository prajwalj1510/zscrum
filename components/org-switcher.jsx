'use client'
import { OrganizationSwitcher, SignedIn, useOrganization, useUser } from "@clerk/nextjs"
import { usePathname } from "next/navigation"

export const OrgSwitcher = () => {

    const { isLoaded } = useOrganization()
    const { isLoaded: isUserLoaded } = useUser()
    const pathname = usePathname()

    if (!isLoaded || !isUserLoaded) {
        return null;
    }

    return (
        <div>
            <SignedIn>
                <OrganizationSwitcher
                    hidePersonal
                    afterCreateOrganizationUrl="/organization/:slug"
                    afterSelectOrganizationUrl="/organization/:slug"
                    createOrganizationMode={
                        pathname === '/onboarding' ? 'navigation' : 'modal'
                    }
                    createOrganizationUrl='/onboarding'
                    appearance = {{
                        elements: {
                            organizationSwitcherTrigger: 'border border-green-500 rounded-lg px-5 py-2',
                            organizationSwitcherTriggerIcon: 'text-white'
                        }
                    }}
                />
            </SignedIn>
        </div>
    )
}