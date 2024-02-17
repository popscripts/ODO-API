import { Server, Socket } from 'socket.io'
import { SocketUserId } from '@customTypes/socket.type'
import { logger } from '@config/logger'
import * as SocketService from '@services/socket.service'
import * as Errors from '@libs/errors'
import { deleteSocket } from '@services/socket.service'
import { SocketUserData } from '@customTypes/auth.type'
import { Classroom, ClassroomStatusEvent } from '@customTypes/classroom.type'
import { Group } from '@customTypes/group.type'
import { getGroupByMemberId } from '@services/group.service'
import { getClassroom } from '@services/classroom.service'
import { setClassroomStatus } from '@utils/status.helper'

export const registerUserSocket = async (
    socket: Socket,
    data: SocketUserId
): Promise<void> => {
    try {
        if (!data.userId) {
            return
        }

        await SocketService.updateSocket(data.userId, socket.id)
        logger.log('socket', `UserID: ${data.userId} | SocketID: ${socket.id}`)
    } catch (error: any) {
        socket.emit('registerUserCallback', Errors.registerUserSocketError)
        logger.error(
            handleErrorLogMessage(
                'registerUserSocket',
                error,
                data?.userId,
                socket.id
            )
        )
    }
}

export const logOutSocket = async (socket: Socket): Promise<void> => {
    try {
        await deleteSocket(socket.id)
        logger.log('socket', `Socket ${socket.id} logged out`)
    } catch (error: any) {
        logger.error(
            handleErrorLogMessage('logOutSocket', error, null, socket.id)
        )
    }
}

export const joinRoom = (
    socket: Socket,
    data: SocketUserData,
    error: Error
): void => {
    if (error) {
        logger.error(error.message)
    } else {
        socket.join(data.accountType)
        logger.log(
            'socket',
            `${data.username} joined room '${data.accountType}'`
        )
    }
}

export const changeClassroomStatus = async (
    io: Server,
    data: ClassroomStatusEvent
): Promise<void> => {
    try {
        const { id, status, prevStatus, userId } = data
        const group: Group | null = await getGroupByMemberId(userId)
        const classroom: Classroom | null = await getClassroom(id)

        await setClassroomStatus(id, status, group!.id)
        io.emit('classroomStatus', {
            prevStatus,
            classroom
        })

        logger.log(
            'socket',
            `ClassroomID: ${id} | ${prevStatus} -> ${status} | UserID: ${userId}`
        )
    } catch (error: any) {
        logger.log(
            'socket',
            `classroomStatusHandler ${error.message} | error: ${1}`
        )
    }
}

const handleErrorLogMessage = (
    eventName: string,
    error: Error,
    userId: number | null,
    socketId: string
): string => {
    return `${eventName}: ${error.message} | UserID: ${userId} | SocketID: ${socketId}`
}
