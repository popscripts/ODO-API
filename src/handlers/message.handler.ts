import { Server, Socket } from 'socket.io'
import { userData } from './connection.handler'

interface messageData extends userData {
    message: string
}

export const messageHandler = (io: Server, socket: Socket): void => {
    const sendMessage = (data: messageData): void => {
        io.in(data.room).emit('receive_message', data.message)
        console.log(`message from ${data.username} - ${data.message} to room: ${data.room}`)
    }

    socket.on('send_message', sendMessage)
}
