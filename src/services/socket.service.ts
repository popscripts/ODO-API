import { db } from '@utils/db.server'
import { UserSocket } from '@customTypes/socket.type'
import { faker } from '@faker-js/faker'

export const createSocket = async (id: string, userId: number) => {
    return db.socket.create({
        data: {
            id,
            userId
        }
    })
}

export const getSocket = async (id: string): Promise<UserSocket | null> => {
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
                    name: true
                }
            }
        }
    })
}

export const getSocketByUserId = async (
    userId: number
): Promise<UserSocket | null> => {
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
                    name: true
                }
            }
        }
    })
}

export const getSockets = async (): Promise<UserSocket[] | null> => {
    return db.socket.findMany({
        select: {
            id: true,
            User: {
                select: {
                    id: true,
                    username: true,
                    name: true
                }
            }
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
    return db.socket.update({
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

export const disconnectAllSockets = async (): Promise<void> => {
    let sockets: UserSocket[] | null = await getSockets()
    sockets?.forEach((socket: UserSocket): void => {
        deleteSocket(socket?.id)
    })
}
