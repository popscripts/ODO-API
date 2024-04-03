import { Group, Member } from '@customTypes/group.type'
import { db } from '@utils/db.server'
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
                    name: true,
                    Socket: {
                        select: {
                            id: true,
                            connected: true
                        }
                    },
                    pictureName: true,
                    accountType: true
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
            },
            GroupVisitedClassrooms: {
                select: {
                    id: true,
                    groupId: true,
                    classroomId: true
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
                    name: true,
                    Socket: {
                        select: {
                            id: true,
                            connected: true
                        }
                    },
                    pictureName: true,
                    accountType: true
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
            },
            GroupVisitedClassrooms: {
                select: {
                    id: true,
                    groupId: true,
                    classroomId: true
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
    groupMembers: Member[]
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
    await db.user.deleteMany({
        where: {
            groupId: id,
            accountTypeId: AccountTypes['temp']
        }
    })

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

export const addGroupVisitedClassroom = async (
    groupId: number,
    classroomId: number
) => {
    return db.groupVisitedClassroom.create({
        data: {
            groupId,
            classroomId
        }
    })
}

export const getGroupVisitedClassrooms = async (groupId: number) => {
    return db.groupVisitedClassroom.findMany({
        where: {
            groupId
        }
    })
}

export const deleteGroupVisitedClassroom = async (
    groupId: number,
    classroomId: number
) => {
    return db.groupVisitedClassroom.deleteMany({
        where: {
            AND: [{ groupId }, { classroomId }]
        }
    })
}

export const isClassroomAlreadyVisited = async (
    groupId: number,
    classroomId: number
): Promise<boolean> => {
    const isVisited: number = await db.groupVisitedClassroom.count({
        where: {
            AND: [{ groupId }, { classroomId }]
        }
    })

    return !!isVisited
}

export const isUserMemberOfAnyGroup = async (id: number): Promise<boolean> => {
    if (id === 0) {
        return false
    }

    const isNotAMember: number = await db.user.count({
        where: {
            id,
            groupId: null
        }
    })

    return !isNotAMember
}

export const getMemberList = async (): Promise<Member[]> => {
    return db.user.findMany({
        select: {
            id: true,
            name: true,
            groupId: true
        },
        orderBy: [{ groupId: 'asc' }, { name: 'asc' }]
    })
}

export const getNumberOfMembers = async (groupId: number) => {
    return db.user.count({
        where: {
            groupId
        }
    })
}

export const leaveGroup = async (id: number) => {
    return db.user.update({
        where: {
            id
        },
        data: {
            groupId: null
        }
    })
}
