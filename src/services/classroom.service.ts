import { db } from '@utils/db.server'
import { Classroom } from '@customTypes/classroom.type'
import { ClassroomStatusEnum } from '@libs/statuses'

export const listClassrooms = async (
    openDayId: number
): Promise<Classroom[]> => {
    return db.classroom.findMany({
        where: {
            openDayId,
            deleted: false
        },
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
            status: true,
            reservedAt: true,
            reservedBy: {
                select: {
                    id: true,
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
                    groupSize: true,
                    description: true
                }
            },
            takenBy: {
                select: {
                    id: true,
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
                    groupSize: true,
                    description: true
                }
            },
            takenAt: true
        }
    })
}

export const getClassroomsByStatus = async (
    openDayId: number,
    status: number,
    groupVisitedClassrooms: number[]
): Promise<Classroom[]> => {
    return db.classroom.findMany({
        where: {
            openDayId,
            id: {
                notIn: groupVisitedClassrooms
            },
            statusId: status,
            deleted: false
        },
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
            status: true,
            reservedAt: true,
            reservedBy: {
                select: {
                    id: true,
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
                    groupSize: true,
                    description: true
                }
            },
            takenBy: {
                select: {
                    id: true,
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
                    groupSize: true,
                    description: true
                }
            },
            takenAt: true
        }
    })
}

export const addClassroom = async (
    openDayId: number,
    classroom: string,
    title: string,
    description: string,
    managedById: number | null
) => {
    return db.classroom.create({
        data: {
            openDayId,
            classroom,
            title,
            description,
            managedById
        },
        select: {
            id: true
        }
    })
}

export const updateClassroom = async (
    id: number,
    classroom: string,
    title: string,
    description: string,
    managedById: number
) => {
    return db.classroom.update({
        where: {
            id
        },
        data: {
            classroom,
            title,
            description,
            managedById
        },
        select: {
            classroom: true,
            title: true,
            description: true,
            managedById: true
        }
    })
}

export const deleteClassroom = async (id: number) => {
    return db.classroom.update({
        where: {
            id
        },
        data: {
            deleted: true
        }
    })
}

export const restoreClassroom = async (id: number) => {
    return db.classroom.update({
        where: {
            id
        },
        data: {
            deleted: false
        }
    })
}

export const doesClassroomExist = async (id: number): Promise<boolean> => {
    const doesExist = await db.classroom.findUnique({
        where: {
            id
        },
        select: {
            id: true
        }
    })
    return !!doesExist
}

export const listClassroomsByStatus = async (
    openDayId: number,
    status: string
): Promise<Classroom[]> => {
    return db.classroom.findMany({
        where: {
            openDayId,
            status: {
                name: status
            },
            deleted: false
        },
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
                    pictureName: true,
                    name: true,
                    Socket: {
                        select: {
                            id: true,
                            connected: true
                        }
                    },
                    accountType: true
                }
            },
            status: true,
            reservedAt: true,
            reservedBy: {
                select: {
                    id: true,
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
                    groupSize: true,
                    description: true
                }
            },
            takenBy: {
                select: {
                    id: true,
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
                    groupSize: true,
                    description: true
                }
            },
            takenAt: true
        }
    })
}

export const getClassroom = async (id: number): Promise<Classroom | null> => {
    return db.classroom.findUnique({
        where: {
            id,
            deleted: false
        },
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
                    pictureName: true,
                    name: true,
                    Socket: {
                        select: {
                            id: true,
                            connected: true
                        }
                    },
                    accountType: true
                }
            },
            status: true,
            reservedAt: true,
            reservedBy: {
                select: {
                    id: true,
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
                    groupSize: true,
                    description: true
                }
            },
            takenBy: {
                select: {
                    id: true,
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
                    groupSize: true,
                    description: true
                }
            },
            takenAt: true
        }
    })
}

export const setFreeStatus = async (id: number) => {
    return db.classroom.update({
        where: {
            id
        },
        data: {
            statusId: ClassroomStatusEnum.free,
            takenById: null,
            takenAt: null,
            reservedById: null,
            reservedAt: null
        }
    })
}

export const cancelReservation = async (id: number) => {
    return db.classroom.update({
        where: {
            id
        },
        data: {
            reservedById: null,
            reservedAt: null
        }
    })
}

export const setBusyStatus = async (
    id: number,
    takenById: number,
    takenAt: Date
) => {
    return db.classroom.update({
        where: {
            id
        },
        data: {
            statusId: ClassroomStatusEnum.busy,
            takenById,
            takenAt
        }
    })
}

export const setReservedStatus = async (
    id: number,
    reservedById: number,
    reservedAt: Date
) => {
    return db.classroom.update({
        where: {
            id
        },
        data: {
            statusId: ClassroomStatusEnum.reserved,
            reservedById,
            reservedAt
        }
    })
}

export const setReservedStatusWhenBusy = async (
    id: number,
    reservedById: number,
    reservedAt: Date
) => {
    return db.classroom.update({
        where: {
            id
        },
        data: {
            reservedById,
            reservedAt
        }
    })
}

export const setBusyClassroomWhenReserved = async (
    id: number,
    takenById: number,
    takenAt: Date
) => {
    return db.classroom.update({
        where: {
            id
        },
        data: {
            statusId: ClassroomStatusEnum.busy,
            reservedById: null,
            reservedAt: null,
            takenById,
            takenAt
        }
    })
}

export const setFreeWhenReserved = async (id: number) => {
    return db.classroom.update({
        where: {
            id
        },
        data: {
            statusId: ClassroomStatusEnum.reserved,
            takenById: null,
            takenAt: null
        }
    })
}
