import { db } from '@utils/db.server'
import { Socket } from '@customTypes/socket.type'
import { faker } from '@faker-js/faker'

export const createSocket = async (id: string, userId: number) => {
    return db.socket.create({
        data: {
            id,
            userId
        }
    })
}

export const getSocket = async (id: string): Promise<Socket | null> => {
    return db.socket.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            User: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    Socket: {
                        select: {
                            id: true,
                            connected: true
                        }
                    }
                }
            },
            connected: true
        }
    })
}

export const getSocketByUserId = async (
    userId: number
): Promise<Socket | null> => {
    return db.socket.findUnique({
        where: {
            userId
        },
        select: {
            id: true,
            User: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    Socket: {
                        select: {
                            id: true,
                            connected: true
                        }
                    }
                }
            },
            connected: true
        }
    })
}

export const getSockets = async (): Promise<Socket[] | null> => {
    return db.socket.findMany({
        select: {
            id: true,
            User: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    Socket: {
                        select: {
                            id: true,
                            connected: true
                        }
                    }
                }
            },
            connected: true
        }
    })
}

export const updateSocket = async (userId: number, newSocketId: string) => {
    return db.socket.update({
        where: {
            userId
        },
        data: {
            id: newSocketId,
            connected: true
        }
    })
}

export const deleteSocket = async (id: string) => {
    return db.socket.updateMany({
        where: {
            id
        },
        data: {
            id: faker.string.hexadecimal({ length: 8 }),
            connected: false
        }
    })
}

export const isSocketRegistered = async (id: string): Promise<boolean> => {
    const isRegistered = await db.socket.findUnique({
        where: { id },
        select: {
            id: true
        }
    })

    return !!isRegistered
}
