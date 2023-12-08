import { Socket } from 'socket.io'
import { SocketUserId } from '@customTypes/socket.type'
import { logger } from '@config/logger'
import * as SocketService from '@services/socket.service'
import * as Callbacks from '@libs/callbacks'
import * as Errors from '@libs/errors'
import { deleteSocket } from '@services/socket.service'

export const registerUserSocket = async (
    socket: Socket,
    data: SocketUserId
): Promise<void> => {
    try {
        if (!data.userId) {
            return
        }

        await SocketService.updateSocket(data.userId, socket.id)
        socket.emit('registerUserCallback', Callbacks.registerUserSocket)
        logger.info(`UserId: ${data.userId} | RegisteredId: ${socket.id}`)
    } catch (error: any) {
        socket.emit('registerUserCallback', Errors.registerUserSocketError)
        logger.error(
            handleErrorLogMessage(
                'registerUserSocket',
                error,
                data?.userId,
                socket.id
            )
        )
    }
}

export const logOutSocket = async (socket: Socket): Promise<void> => {
    try {
        await deleteSocket(socket.id)
        logger.info('User logged out')
    } catch (error: any) {
        logger.error(
            handleErrorLogMessage('logOutSocket', error, null, socket.id)
        )
    }
}

const handleErrorLogMessage = (
    eventName: string,
    error: Error,
    userId: number | null,
    socketId: string
): string => {
    return `SOCKET.${eventName}: ${error.message} | UserId: ${userId} | SocketId: ${socketId}`
}
