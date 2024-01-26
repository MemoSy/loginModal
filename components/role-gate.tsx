"use client"

import { useCurrentRole } from "@/hooks/use-current-role"
import { UserRole } from "@prisma/client"
import { FormError } from "./formError"

interface RoleGateInterface {
    children: React.ReactNode
    allowedRoles: UserRole
}

export const RoleGate = ({children, allowedRoles}: RoleGateInterface) => {
    const role = useCurrentRole()

    if (role !== allowedRoles) {
        return (
            <FormError message="You dont have permission To See This contetn" />
        )
    }

    return (
        <>
            {children}
        </>
    )
}