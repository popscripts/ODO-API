import { Server as httpServer } from 'http'
import { Event, Server, Socket } from 'socket.io'
import {
    roomHandler,
    socketMiddlewareHandler,
    statusHandler
} from '@utils/socket.handler'
import { logger } from '@config/logger'
import { isSocketRegistered } from '@services/socket.service'
import {
    logOutSocket,
    registerUserSocket
} from '@controllers/socket.controller'
import { SocketEnum } from '@libs/socketEnum'

export const socketConfig = (server: httpServer): Server => {
    return new Server(server, {
        cors: {
            origin: process.env.EXPO_URI
        }
    })
}

export const ioConnectionConfig = (io: Server): void => {
    io.on('connection', (socket: Socket): void => {
        logger.info(`User: ${socket.id} connected`)

        socket.use(async (event: Event, next): Promise<void> => {
            if (!(await isSocketRegistered(socket.id))) {
                await registerUserSocket(socket, event[SocketEnum.EventData])
                next()
            }
            next()
        })

        socket.use(socketMiddlewareHandler)
        socket.on('joinRoom', (data, err) => roomHandler(socket, data, err))
        socket.on('setClassroomStatus', (data, err) =>
            statusHandler(io, data, err)
        )

        socket.on('logOut', () => logOutSocket(socket))

        socket.on('error', (error: Error): void => {
            socket.emit('error_handler', error.message)
        })

        socket.on('disconnect', async (): Promise<void> => {
            await logOutSocket(socket)
            logger.info(`User: ${socket.id} disconnected`)
        })
    })
}
