import { Server as httpServer } from 'http'
import { Server, Socket } from 'socket.io'
import {
    roomHandler,
    socketMiddlewareHandler,
    statusHandler
} from '@utils/socket.handler'
import { logger } from '@config/logger'

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

        socket.use(socketMiddlewareHandler)
        socket.on('joinRoom', (data, err) => roomHandler(socket, data, err))
        socket.on('setClassroomStatus', (data, err) =>
            statusHandler(io, data, err)
        )

        socket.on('error', (error: Error): void => {
            socket.emit('error_handler', error.message)
        })

        socket.on('disconnect', (): void => {
            logger.info(`User: ${socket.id} disconnected`)
        })
    })
}
