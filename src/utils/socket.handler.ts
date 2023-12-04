import { Server, Socket } from 'socket.io'
import { SocketUserData } from '@customTypes/auth.type'
import { Group } from '@customTypes/group.type'
import { Classroom, ClassroomStatusEvent } from '@customTypes/classroom.type'
import { socketClassroomStatusVerification } from '@middlewares/socketClassroomStatusVerifiaction'
import { getClassroom } from '@services/classroom.service'
import { setClassroomStatus } from '@utils/status.helper'
import { getGroupByMemberId } from '@services/group.service'
import { logger } from '@config/logger'
import { SocketEnum } from '@libs/socketEnum'

export const roomHandler = (
    socket: Socket,
    data: SocketUserData,
    error: Error
): void => {
    if (error) {
        logger.error(error.message)
    } else {
        socket.join(data.accountType)
        logger.info(`${data.username} joined room: ${data.accountType}`)
    }
}

export const statusHandler = async (
    io: Server,
    data: ClassroomStatusEvent,
    error: Error
): Promise<void> => {
    if (error) {
        logger.error(error.message)
    } else {
        try {
            const { id, status, prevStatus, userId } = data
            const group: Group | null = await getGroupByMemberId(userId)
            const classroom: Classroom | null = await getClassroom(id)

            if (!group) {
                logger.error(`User: ${userId} is not a member of any group`)
                return
            }

            await setClassroomStatus(id, status, group.id)
            io.emit('classroomStatus', {
                prevStatus,
                classroom
            })

            logger.info(
                `ClassroomId: ${id} | ${prevStatus} -> ${status} | UserId: ${userId}`
            )
        } catch (error: any) {
            logger.error(error.message)
        }
    }
}

export const socketMiddlewareHandler = async (
    event: Event[],
    next: any
): Promise<void> => {
    logger.info(`Emitted event: ${event[SocketEnum.EventName]}`)
    switch (event[SocketEnum.EventName].toString()) {
        case 'setClassroomStatus':
            try {
                const { id, status, userId, accountType } = event[
                    SocketEnum.EventData
                ] as ClassroomStatusEvent
                if (
                    await socketClassroomStatusVerification(
                        id,
                        status,
                        userId,
                        accountType
                    )
                ) {
                    next()
                } else {
                    logger.error(
                        "You can't change classroom status at the moment"
                    )

                    next(
                        new Error(
                            "You can't change classroom status at the moment"
                        )
                    )
                }

                break
            } catch (error: any) {
                logger.error(`Something wen wrong: ${error.message}`)
                next(new Error('Something went wrong'))
                break
            }
        default:
            next()
            break
    }
}
