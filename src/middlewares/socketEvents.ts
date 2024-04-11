import { logger } from '@config/logger'
import { Socket } from 'socket.io'
import { isSocketRegistered } from '@services/socket.service'
import { registerUserSocket } from '@controllers/socket.controller'
import { SocketUserData } from '@customTypes/socket.type'

export const registerSocketMiddleware = async (
    data: SocketUserData,
    socket: Socket
): Promise<void> => {
    try {
        if (!data.id) {
            logger.log('socket', 'User ID not provided')
            return
        }

        if (!(await isSocketRegistered(socket.id))) {
            await registerUserSocket(socket, data.id)
        }
    } catch (error: any) {
        logger.log(
            'socket',
            `registerSocketMiddleware ${error.message} | error: ${1}`
        )
    }
}
