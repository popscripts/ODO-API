import { Server, Socket } from 'socket.io'
import { setClassroomStatus } from '@utils/status.helper'

type classroomStatus = {
    id: number
    userId: number
    prevStatus: string
    status: string
    accountType: string
}

export const statusHandler = (io: Server, socket: Socket): void => {
    const changeClassroomStatus = async (data: classroomStatus): Promise<void> => {
        const { id, userId, prevStatus, status, accountType } = data
        // TODO... Add JWT verification middleware
        // await setClassroomStatus(id, status, userId)
        io.to(accountType).emit('classroomStatuses', { id, prevStatus, status, userId })
        console.log({ id, prevStatus, status, userId })
    }

    socket.on('setClassroomStatus', changeClassroomStatus)
}
