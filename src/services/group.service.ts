import { Group } from '@customTypes/group.type'
import { db } from '@utils/db.server'
import { ShortUser } from '@customTypes/auth.type'
import { AccountTypes } from '@libs/accountTypes'
import { faker } from '@faker-js/faker'
import { hashPassword } from '@utils/auth.helper'

export const getGroups = async (openDayId: number): Promise<Group[] | null> => {
    return db.group.findMany({
        where: {
            openDayId
        },
        select: {
            id: true,
            openDayId: true,
            groupSize: true,
            GroupMembers: {
                select: {
                    id: true,
                    username: true,
                    name: true
                }
            },
            description: true,
            Reserved: {
                select: {
                    id: true,
                    openDayId: true,
                    classroom: true,
                    title: true,
                    description: true,
                    status: true,
                    reservedAt: true,
                    takenAt: true
                }
            },
            Taken: {
                select: {
                    id: true,
                    openDayId: true,
                    classroom: true,
                    title: true,
                    description: true,
                    status: true,
                    reservedAt: true,
                    takenAt: true
                }
            }
        }
    })
}

export const getGroup = async (id: number): Promise<Group | null> => {
    return db.group.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            openDayId: true,
            groupSize: true,
            GroupMembers: {
                select: {
                    id: true,
                    username: true,
                    name: true
                }
            },
            description: true,
            Reserved: {
                select: {
                    id: true,
                    openDayId: true,
                    classroom: true,
                    title: true,
                    description: true,
                    status: true,
                    reservedAt: true,
                    takenAt: true
                }
            },
            Taken: {
                select: {
                    id: true,
                    openDayId: true,
                    classroom: true,
                    title: true,
                    description: true,
                    status: true,
                    reservedAt: true,
                    takenAt: true
                }
            }
        }
    })
}

export const addGroup = async (
    openDayId: number,
    groupSize: number,
    description: string | null
) => {
    return db.group.create({
        data: {
            groupSize,
            description,
            openDayId
        },
        select: {
            id: true
        }
    })
}

export const updateGroupMembers = async (
    openDayId: number,
    groupId: number,
    groupMembers: ShortUser[]
): Promise<void> => {
    for (const groupMembersKey in groupMembers) {
        await db.user.upsert({
            where: {
                id: groupMembers[groupMembersKey].id
            },
            update: {
                groupId
            },
            create: {
                openDayId,
                username: faker.string.uuid(),
                name: groupMembers[groupMembersKey].name,
                accountTypeId: AccountTypes['temp'],
                password: await hashPassword(
                    faker.string.hexadecimal({ length: 8 })
                ),
                groupId
            }
        })
    }
}

export const updateGroup = async (
    id: number,
    groupSize: number | null,
    description: string | null
) => {
    return db.group.update({
        where: {
            id
        },
        data: {
            groupSize,
            description,
            GroupMembers: {
                set: []
            }
        },
        select: {
            id: true
        }
    })
}

export const deleteGroup = async (id: number) => {
    return db.group.delete({
        where: {
            id
        }
    })
}

export const doesGroupExist = async (id: number): Promise<boolean> => {
    const doesExist = await db.group.findUnique({
        where: {
            id
        },
        select: {
            id: true
        }
    })

    return !!doesExist
}

export const isUserMemberOfGroup = async (
    id: number,
    groupId: number
): Promise<boolean> => {
    const isMember = await db.user.findUnique({
        where: {
            id,
            groupId
        },
        select: {
            id: true
        }
    })

    return !!isMember
}
