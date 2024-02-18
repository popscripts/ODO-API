import { SocketEnum } from '@libs/socketEnum'
import { logger } from '@config/logger'
import { registerUserSocketError } from '@libs/errors'
import { Server, Socket, Event } from 'socket.io'
import { isSocketRegistered } from '@services/socket.service'
import { registerUserSocket } from '@controllers/socket.controller'

export const registerSocketMiddleware = async (
    event: Event,
    io: Server,
    socket: Socket,
    next: any
): Promise<void> => {
    try {
        if (!(await isSocketRegistered(socket.id))) {
            await registerUserSocket(socket, event[SocketEnum.EventData])
            io.to(socket.id).emit('loginStatus', true)

            next()
        }

        next()
    } catch (error: any) {
        logger.log(
            'socket',
            `registerSocketMiddleware ${error.message} | error: ${1}`
        )
        next(new Error(registerUserSocketError.result))
    }
}
