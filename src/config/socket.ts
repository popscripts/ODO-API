import { Server as httpServer } from 'http'
import { Event, Server, Socket } from 'socket.io'
import { socketEventLogger } from '@utils/socket.handler'
import * as SocketController from '@controllers/socket.controller'
import { registerSocketMiddleware } from '@middlewares/socketEvents'
import * as SocketEvents from '@middlewares/socketEvents'
import { cannotChangeClassroomStatusError } from '@libs/errors'

export const socketConfig = (server: httpServer): Server => {
    return new Server(server, {
        cors: {
            origin: process.env.EXPO_URI
        }
    })
}

export const ioConnectionConfig = (io: Server): void => {
    io.on('connection', (socket: Socket): void => {
        socket.use((event: Event, next: any) => {
            socketEventLogger(event, socket, next)
        })

        socket.use(
            async (event: Event, next: any): Promise<void> =>
                registerSocketMiddleware(event, io, socket, next)
        )

        socket.on('joinRoom', (data, err) =>
            SocketController.joinRoom(socket, data, err)
        )
        socket.on('changeClassroomStatus', async (data) => {
            if (await SocketEvents.classroomStatusMiddleware(data)) {
                await SocketController.changeClassroomStatus(io, data)
            } else {
                io.to(socket.id).emit(
                    'errorHandler',
                    cannotChangeClassroomStatusError.result
                )
            }
        })

        socket.on('send_message', (data) => {
            io.to(data.message).emit('receive_message', 'test message')
        })

        socket.on('logOut', async (): Promise<void> => {
            io.to(socket.id).emit('loginStatus', false)
            await SocketController.logOutSocket(socket)
        })

        socket.on('error', (error: Error): void => {
            io.to(socket.id).emit('errorHandler', error.message)
        })

        socket.on('disconnect', async (): Promise<void> => {
            await SocketController.logOutSocket(socket)
        })
    })
}
