import { Server, Socket, Event } from 'socket.io'
import { logger } from '@config/logger'
import { SocketEnum } from '@libs/socketEnum'
import { UserSocket } from '@customTypes/socket.type'
import { deleteSocket, getSockets } from '@services/socket.service'

export const disconnectAllSocketHandler = async (io: Server): Promise<void> => {
    try {
        let sockets: UserSocket[] | null = await getSockets()
        io.emit('loginStatus', false)

        sockets?.forEach((socket: UserSocket): void => {
            deleteSocket(socket?.id)
        })
    } catch (error: any) {
        logger.error(error.message)
    }
}

export const socketEventLogger = (
    event: Event,
    socket: Socket,
    next: any
): void => {
    logger.log(
        'socket',
        `${event[SocketEnum.EventName]} - SocketID: ${socket.id}`
    )
    next()
}
