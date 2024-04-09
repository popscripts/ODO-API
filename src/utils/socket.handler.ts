import { Socket, Event } from 'socket.io'
import { logger } from '@config/logger'
import { SocketEnum } from '@libs/socketEnum'

const skip = (event: Event): boolean => {
    return event[SocketEnum.EventName] === 'joinRoom'
}

export const socketEventLogger = (
    event: Event,
    socket: Socket,
    next: any
): void => {
    if (!skip(event)) {
        logger.log(
            'socket',
            `${event[SocketEnum.EventName]} | SocketID: ${socket.id}`
        )
    }

    next()
}
