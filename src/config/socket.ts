import { Server as httpServer } from 'http'
import { Server, Socket } from 'socket.io'
import { userData } from '@handlers/connection.handler'

export const socketConfig = (server: httpServer): Server => {
    return new Server(server, {
        cors: {
            origin: 'http://192.168.1.220:19000'
        }
    })
}

export const ioConnectionConfig = (io: Server): void => {
    io.on('connection', (socket: Socket): void => {
        console.log('connected')
        socket.use(middlewareHandler)
        socket.on('joinRoomByAccountType', (data, err) => joinRoomByAccountType(socket, data, err))
        socket.on('send_message', (data, err) => newMessageHandler(err, io, data))
        socket.on('setClassroomStatus', (data, err) => statusHandler(err, io, data))

        socket.on('error', (error: Error): void => {
            socket.emit('error_handler', error.message)
            console.log(error.message)
        })
    })
}

function joinRoomByAccountType(socket: Socket, data: userData, error: Error) {
    if (error) {
        console.log(error.message)
    } else {
        socket.join(data.accountType)
        console.log(data.username + ' joined room: ' + data.accountType)
    }
}

function newMessageHandler(error: Error, io: Server, data: any) {
    if (error) {
        // console.log(error)
    } else {
        io.in(data.room).emit('receive_message', data.message)
        console.log(`message from ${data.username} - ${data.message} to room: ${data.room}`)
    }
}

function statusHandler(error: Error, io: Server, data: any) {
    if (error) {
        console.log('error.message')
    } else {
        const { id, userId, prevStatus, status, accountType } = data
        // TODO... Add JWT verification middleware
        // await setClassroomStatus(id, status, userId)
        io.to(accountType).emit('classroomStatuses', { id, userId, prevStatus, status })
        console.log({ id, userId, prevStatus, status })
    }
}

function middlewareHandler(event: Event[], next: (err?: Error | undefined) => void): void {
    switch (event[0].toString()) {
        case 'setClassroomStatus':
            // const err = new Error('not authorized')
            // next(err)
            next()
            break
        default:
            next()
            break
    }
}
