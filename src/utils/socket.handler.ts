import { Socket, Event } from 'socket.io'
import { logger } from '@config/logger'
import { SocketEnum } from '@libs/socketEnum'

export const socketEventLogger = (
    event: Event,
    socket: Socket,
    next: any
): void => {
    logger.log(
        'socket',
        `${event[SocketEnum.EventName]} | SocketID: ${socket.id}`
    )

    next()
}
