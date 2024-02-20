import { db } from '@utils/db.server'
import { hashPassword } from '@utils/auth.helper'
import * as AuthType from '@customTypes/auth.type'
import { faker } from '@faker-js/faker'

export const register = async (registerData: AuthType.NewUser) => {
    const { openDayId, username, password } = registerData
    const hashedPassword: string = await hashPassword(password)
    return db.user.create({
        data: {
            openDayId,
            username,
            password: hashedPassword,
            Socket: {
                create: {
                    id: faker.string.hexadecimal({ length: 8 })
                }
            }
        }
    })
}

export const login = async (
    username: string
): Promise<AuthType.LoginUser | null> => {
    return db.user.findUnique({
        where: {
            username
        },
        select: {
            id: true,
            openDayId: true,
            username: true,
            password: true,
            accountType: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })
}

export const isUsernameTaken = async (username: string): Promise<boolean> => {
    const isTaken = await db.user.findFirst({
        where: {
            username
        },
        select: {
            id: true
        }
    })
    return !!isTaken
}

export const getUser = async (id: number): Promise<AuthType.User | null> => {
    return db.user.findUnique({
        where: {
            id
        },
        select: {
            Socket: {
                select: {
                    id: true,
                    connected: true
                }
            },
            id: true,
            openDayId: true,
            username: true,
            name: true,
            accountType: {
                select: {
                    id: true,
                    name: true
                }
            },
            pictureName: true,
            ManagedClassroom: {
                select: {
                    id: true,
                    classroom: true,
                    title: true,
                    description: true
                }
            },
            Group: {
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
                            pictureName: true
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
            }
        }
    })
}

export const getUsers = async (
    openDayId: number
): Promise<AuthType.Users[]> => {
    return db.user.findMany({
        where: {
            openDayId
        },
        select: {
            id: true,
            username: true,
            name: true,
            openDayId: true,
            accountType: true,
            active: true
        }
    })
}

export const editUser = async (
    id: number,
    username: string,
    accountTypeId: number
) => {
    return db.user.update({
        where: {
            id
        },
        data: {
            username,
            accountTypeId
        }
    })
}

export const deleteUser = async (id: number) => {
    return db.user.update({
        where: {
            id
        },
        data: {
            active: false
        }
    })
}

export const restoreUser = async (id: number) => {
    return db.user.update({
        where: {
            id
        },
        data: {
            active: true
        }
    })
}

export const isValidAccountType = async (
    accountType: string
): Promise<boolean> => {
    const isValid = await db.accountType.findFirst({
        where: {
            name: accountType
        }
    })
    return !!isValid
}

export const isValidIdUser = async (id: number): Promise<boolean> => {
    const isValid = await db.user.findFirst({
        where: {
            id
        }
    })
    return !!isValid
}

export const getUsersByStatus = async (
    openDayId: number,
    status: boolean
): Promise<AuthType.Users[]> => {
    return db.user.findMany({
        where: {
            openDayId,
            active: status
        },
        select: {
            id: true,
            username: true,
            name: true,
            openDayId: true,
            accountType: true,
            active: true
        }
    })
}

export const doesUserExists = async (username: string): Promise<boolean> => {
    const doesExists = await db.user.findFirst({
        where: {
            username
        }
    })

    return !!doesExists
}

export const saveProfilePictureToDatabase = async (
    id: number,
    pictureName: string
) => {
    return db.user.update({
        where: {
            id
        },
        data: {
            pictureName
        }
    })
}

export const getProfilePictureName = async (
    id: number
): Promise<string | null> => {
    const result = await db.user.findUnique({
        where: {
            id
        },
        select: {
            pictureName: true
        }
    })

    if (result?.pictureName) {
        return result?.pictureName
    }

    return null
}

export const updatePersonalData = async (id: number, name: string) => {
    return db.user.update({
        where: {
            id
        },
        data: {
            name
        }
    })
}
