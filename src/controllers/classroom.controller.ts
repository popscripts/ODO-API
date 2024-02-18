import * as ClassroomService from '@services/classroom.service'
import { Request, Response } from 'express'
import * as Error from '@libs/errors'
import * as Callback from '@libs/callbacks'
import * as AuthHelper from '@utils/auth.helper'
import { setClassroomStatus } from '@utils/status.helper'
import { Token, User } from '@customTypes/auth.type'
import { verifyToken } from '@utils/auth.helper'
import { logger } from '@config/logger'
import { Classroom, ClassroomStatusEvent } from '@customTypes/classroom.type'
import { getUser } from '@services/auth.service'
import { Server } from 'socket.io'
import { getClassroom } from '@services/classroom.service'

export const listClassrooms = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const token: string = request.cookies.JWT
        const { openDayId }: Token = verifyToken(token, 'accessToken')
        const classrooms: Classroom[] =
            await ClassroomService.listClassrooms(openDayId)
        return response.status(200).json({ result: classrooms, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const addClassroom = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const { classroom, title, description, managedById } = request.body
        const token = request.cookies.JWT
        const { openDayId }: Token = verifyToken(token, 'accessToken')

        const { id } = await ClassroomService.addClassroom(
            openDayId,
            classroom,
            title,
            description,
            managedById
        )

        await emitClassroom(request.io, id)

        return response.status(201).json(Callback.newClassroom)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const updateClassroom = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const { id, classroom, title, description, managedById } = request.body
        await ClassroomService.updateClassroom(
            id,
            classroom,
            title,
            description,
            managedById
        )

        await emitClassroom(request.io, id)

        return response.status(201).json(Callback.editClassroom)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const deleteClassroom = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const id: number = request.body.id
        await ClassroomService.deleteClassroom(id)
        return response.status(200).json(Callback.deleteClassroom)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const restoreClassroom = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const id: number = request.body.id
        await ClassroomService.restoreClassroom(id)
        return response.status(200).json(Callback.restoreClassroom)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const listClassroomsByStatus = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const token: string = request.cookies.JWT
        const tokenData: Token = verifyToken(token, 'accessToken')
        const status: string = request.params.status

        const classrooms: Classroom[] =
            await ClassroomService.listClassroomsByStatus(
                tokenData.openDayId,
                status
            )

        return response.status(200).json({ result: classrooms, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const changeClassroomStatus = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const { id, status, prevStatus } = request.body

        const tokenData: Token = AuthHelper.verifyToken(
            request.cookies.JWT,
            'accessToken'
        )

        const user: User | null = await getUser(tokenData.id)
        await setClassroomStatus(id, status, user!.Group!.id)

        const socketData: ClassroomStatusEvent = {
            id,
            status,
            prevStatus,
            userId: tokenData.id
        }

        await emitClassroomStatus(request.io, socketData)

        return response.status(201).json(Callback.changeStatus)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.changeClassroomStatusError)
    }
}

const emitClassroomStatus = async (
    io: Server,
    data: ClassroomStatusEvent
): Promise<void> => {
    try {
        const { id, status, prevStatus, userId } = data
        const classroom: Classroom | null = await getClassroom(id)

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
            `emitClassroomStatus ${error.message} | error: ${1}`
        )
    }
}

const emitClassroom = async (
    io: Server,
    classroomId: number
): Promise<void> => {
    try {
        const classroom: Classroom | null = await getClassroom(classroomId)

        io.emit('classroomUpdate', {
            classroom
        })

        logger.log('socket', `Classroom ${classroomId} data emitted`)
    } catch (error: any) {
        logger.log('socket', `emitClassroom ${error.message} | error: ${1}`)
    }
}
