import { Socket } from 'socket.io'
import { logger } from '@config/logger'
import * as SocketService from '@services/socket.service'
import * as Errors from '@libs/errors'
import { deleteSocket } from '@services/socket.service'
import { SocketUserData } from '@customTypes/socket.type'

export const registerUserSocket = async (
    socket: Socket,
    userId: number
): Promise<void> => {
    try {
        await SocketService.updateSocket(userId, socket.id)
    } catch (error: any) {
        socket.emit('registerUserCallback', Errors.registerUserSocketError)

        logger.error(
            handleErrorLogMessage(
                'registerUserSocket',
                error,
                userId,
                socket.id
            )
        )
    }
}

export const logOutSocket = async (socket: Socket): Promise<void> => {
    try {
        await deleteSocket(socket.id)
    } catch (error: any) {
        logger.error(
            handleErrorLogMessage('logOutSocket', error, null, socket.id)
        )
    }
}

export const joinRoom = (
    socket: Socket,
    data: SocketUserData,
    error: Error
): void => {
    if (error) {
        logger.error(error.message)
    } else {
        socket.join(data.accountType)
        logger.log(
            'socket',
            `User with ID ${data.id} joined room '${data.accountType}'`
        )
    }
}

const handleErrorLogMessage = (
    eventName: string,
    error: Error,
    userId: number | null,
    socketId: string
): string => {
    return `${eventName}: ${error.message} | UserID: ${userId} | SocketID: ${socketId}`
}
