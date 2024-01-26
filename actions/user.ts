"use server"

import { db } from "@/lib/db"

export const allUsers = async () => {
    const users = await db.user.findMany()

    return users
}

export const removeUser = async (id: string) => {
    const user = await db.user.delete({
        where: {
            id: id
        }
    })

    return user
}

export const editUser = async (id: string, data: any) => {
    const user = await db.user.update({
        where: {
            id: id
        },
        data: {
            ...data
        }
    })

    if (!user) {
        return {
            error: "User not found"
        }
    }

    return {
        success: "User updated"
    }
}