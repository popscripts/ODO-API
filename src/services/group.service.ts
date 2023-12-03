import { Group } from '@customTypes/group.type'
import { db } from '@utils/db.server'

export const getGroup = async (id: number): Promise<Group | null> => {
    return db.group.findUnique({
        where: {
            id
        },
        select: {
            id: true,
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
                    managedBy: {
                        select: {
                            id: true,
                            username: true,
                            name: true
                        }
                    },
                    status: true
                }
            },
            Taken: {
                select: {
                    id: true,
                    openDayId: true,
                    classroom: true,
                    title: true,
                    description: true,
                    managedBy: {
                        select: {
                            id: true,
                            username: true,
                            name: true
                        }
                    },
                    status: true
                }
            }
        }
    })
}

export const getGroupByMemberId = async (
    groupMemberId: number
): Promise<Group | null> => {
    return db.group.findFirst({
        where: {
            GroupMembers: {
                every: {
                    id: groupMemberId
                }
            }
        },
        select: {
            id: true,
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
                    managedBy: {
                        select: {
                            id: true,
                            username: true,
                            name: true
                        }
                    },
                    status: true
                }
            },
            Taken: {
                select: {
                    id: true,
                    openDayId: true,
                    classroom: true,
                    title: true,
                    description: true,
                    managedBy: {
                        select: {
                            id: true,
                            username: true,
                            name: true
                        }
                    },
                    status: true
                }
            }
        }
    })
}
