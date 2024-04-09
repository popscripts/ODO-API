import * as ClassroomService from '@services/classroom.service'
import { Request, Response } from 'express'
import * as Error from '@libs/errors'
import * as Callback from '@libs/callbacks'
import { setClassroomStatus } from '@utils/status.helper'
import { logger } from '@config/logger'
import {
    Classroom,
    ClassroomStatusEvent,
    GroupVisitedClassroom
} from '@customTypes/classroom.type'
import { getUserGroupId } from '@services/auth.service'
import { Server } from 'socket.io'
import { ClassroomStatusEnum } from '@libs/statuses'
import {
    addGroupVisitedClassroom,
    getGroupVisitedClassrooms,
    getGroupVisitedClassroomsIds
} from '@services/group.service'

export const listClassrooms = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const classrooms: Classroom[] = await ClassroomService.listClassrooms(
            request.user.openDayId
        )

        return response.status(200).json({ result: classrooms, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const groupedClassrooms = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const userGroupId: number | null = await getUserGroupId(request.user.id)
        let groupVisitedClassroomsIds: number[] = []

        if (userGroupId) {
            groupVisitedClassroomsIds =
                await getGroupVisitedClassroomsIds(userGroupId)
        }

        const free: Classroom[] = await ClassroomService.getClassroomsByStatus(
            request.user.openDayId,
            ClassroomStatusEnum.free,
            groupVisitedClassroomsIds
        )

        const busy: Classroom[] = await ClassroomService.getClassroomsByStatus(
            request.user.openDayId,
            ClassroomStatusEnum.busy,
            groupVisitedClassroomsIds
        )

        const reserved: Classroom[] =
            await ClassroomService.getClassroomsByStatus(
                request.user.openDayId,
                ClassroomStatusEnum.reserved,
                groupVisitedClassroomsIds
            )

        let visited: GroupVisitedClassroom[] = []

        if (userGroupId) {
            visited = await getGroupVisitedClassrooms(userGroupId)
        }

        const classrooms = {
            free,
            busy,
            reserved,
            visited
        }

        return response.status(200).json({ result: classrooms, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const getClassroom = async (request: Request, response: Response) => {
    try {
        const classroom: Classroom | null = await ClassroomService.getClassroom(
            parseInt(request.params.id)
        )

        return response.status(200).json({ result: classroom, error: 0 })
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

        const { id } = await ClassroomService.addClassroom(
            request.user.openDayId,
            classroom,
            title,
            description,
            managedById
        )

        emitClassroom(request.io, id)

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

        emitClassroom(request.io, id)

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
        emitClassroom(request.io, id)

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
        emitClassroom(request.io, id)

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
        const status: string = request.params.status

        const classrooms: Classroom[] =
            await ClassroomService.listClassroomsByStatus(
                request.user.openDayId,
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

        await setClassroomStatus(
            request.body.classroom,
            parseInt(ClassroomStatusEnum[status]),
            request.body.group
        )

        if (
            request.body.group?.Taken?.id === id &&
            status === ClassroomStatusEnum[ClassroomStatusEnum.free]
        ) {
            await addGroupVisitedClassroom(
                request.body.group.id,
                id,
                request.body.classroom.classroom,
                request.body.classroom.title
            )
        }

        emitClassroomStatus(request.io, {
            id,
            status,
            prevStatus,
            userId: request.user.id
        })

        return response.status(201).json(Callback.changeStatus)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.changeClassroomStatusError)
    }
}

export const emitClassroomStatus = (
    io: Server,
    data: ClassroomStatusEvent
): void => {
    try {
        const { id, status, prevStatus, userId } = data
        io.emit('classroomStatus', true)

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

const emitClassroom = (io: Server, classroomId: number): void => {
    try {
        io.emit('classroomUpdate', true)

        logger.log('socket', `Classroom ${classroomId} updated`)
    } catch (error: any) {
        logger.log('socket', `emitClassroom ${error.message} | error: ${1}`)
    }
}
