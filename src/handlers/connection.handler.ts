import { Server, Socket } from 'socket.io'

export type userData = {
    username: string
    accountType: string
    room: string
}

export const connectionHandler = (io: Server, socket: Socket) => {
    const joinRoomByAccountType = (data: userData): void => {
        socket.join(data.accountType)
        console.log(data.username + ' joined room: ' + data.accountType)
    }

    const disconnect = (): void => {
        console.log(`socket ${socket.id} disconnected`)
    }

    socket.on('joinRoomByAccountType', joinRoomByAccountType)
    socket.on('disconnect', disconnect)
}
