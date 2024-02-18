import { Event, Server, Socket } from 'socket.io'
import { socketEventLogger } from '@utils/socket.handler'
import * as SocketController from '@controllers/socket.controller'
import { registerSocketMiddleware } from '@middlewares/socketEvents'
import { Express, NextFunction, Request, Response } from 'express'

export const createSocketServer = (): Server => {
    return new Server({
        cors: {
            origin: process.env.EXPO_URI
        }
    })
}

export const ioConnectionConfig = (app: Express, io: Server): void => {
    io.on('connection', (socket: Socket): void => {
        socket.use((event: Event, next: any): void => {
            socketEventLogger(event, socket, next)
        })

        socket.use(
            async (event: Event, next: any): Promise<void> =>
                registerSocketMiddleware(event, io, socket, next)
        )

        socket.on('joinRoom', (data, err) =>
            SocketController.joinRoom(socket, data, err)
        )

        // // Just for development purpose
        // socket.on('send_message', (data) => {
        //     io.to(data.message).emit('receive_message', 'test message')
        // })
        //
        // socket.on('error', (error: Error): void => {
        //     io.to(socket.id).emit('errorHandler', error.message)
        // })
        //
        socket.on('disconnect', async (): Promise<void> => {
            await SocketController.logOutSocket(socket)
        })
    })

    app.use((request: Request, response: Response, next: NextFunction) => {
        request.io = io
        next()
    })
}
