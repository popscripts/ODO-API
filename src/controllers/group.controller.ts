import { Request, Response } from 'express'
import * as GroupService from '@services/group.service'
import { logger } from '@config/logger'
import * as Error from '@libs/errors'
import * as Callbacks from '@libs/callbacks'
import { Group, Member } from '@customTypes/group.type'
import { Server } from 'socket.io'
import { ShortUser } from '@customTypes/auth.type'
import { setClassroomStatus } from '@utils/status.helper'
import { ClassroomStatusEnum } from '@libs/statuses'
import { emitClassroomStatus } from '@controllers/classroom.controller'
import { ClassroomStatusEvent } from '@customTypes/classroom.type'

export const getGroups = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const groups: Group[] | null = await GroupService.getGroups(
            request.user.openDayId
        )

        return response.status(200).json({ result: groups, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.getGroupsError)
    }
}

export const getGroup = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const groupId: number = parseInt(request.params.id)
        const group: Group | null = await GroupService.getGroup(groupId)

        return response.status(200).json({ result: group, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.getGroupError)
    }
}

export const addGroup = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const { groupSize, description, groupMembers } = request.body

        const { id } = await GroupService.addGroup(
            request.user.openDayId,
            groupSize,
            description
        )

        await GroupService.updateGroupMembers(
            request.user.openDayId,
            id,
            groupMembers
        )

        emitGroup(request.io, id)

        return response.status(201).json(Callbacks.newGroup)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.addGroupError)
    }
}

export const updateGroup = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const { id, groupSize, description, groupMembers } = request.body
        await GroupService.updateGroup(id, groupSize, description)

        await GroupService.updateGroupMembers(
            request.user.openDayId,
            id,
            groupMembers
        )

        emitGroup(request.io, id)

        return response.status(201).json(Callbacks.updateGroup)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.updateGroupError)
    }
}

export const deleteGroup = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const { id } = request.body

        await handleDeletedGroupClassroom(id, request.user.id, request.io)
        await GroupService.deleteGroup(id)
        emitGroup(request.io, request.body.id)

        return response.status(200).json(Callbacks.deleteGroup)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.deleteGroupError)
    }
}

export const addGroupVisitedClassroom = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const { id, classroomId, classroom, title } = request.body

        await GroupService.addGroupVisitedClassroom(
            id,
            classroomId,
            classroom,
            title
        )

        await emitGroupVisitedClassrooms(request.io, id)

        return response.status(201).json(Callbacks.addGroupVisitedClassroom)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.addGroupVisitedClassroomError)
    }
}

export const getGroupVisitedClassroom = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const id: number = parseInt(request.params.id)
        const groupVisitedClassrooms: number[] =
            await GroupService.getGroupVisitedClassroomsIds(id)

        return response
            .status(200)
            .json({ result: groupVisitedClassrooms, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.getGroupVisitedClassroomsError)
    }
}

export const deleteGroupVisitedClassroom = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const { id, classroomId } = request.body
        await GroupService.deleteGroupVisitedClassroom(id, classroomId)

        await emitGroupVisitedClassrooms(request.io, id)

        return response.status(200).json(Callbacks.deleteGroupVisitedClassroom)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.deleteGroupVisitedClassroomError)
    }
}

export const getMemberList = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const memberList: Member[] = await GroupService.getMemberList()
        return response.status(200).json({ result: memberList, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.getMembersListError)
    }
}

export const leaveGroup = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        await GroupService.leaveGroup(request.user.id)
        emitGroup(request.io, request.body.id)

        return response.status(201).json(Callbacks.leaveGroup)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.leaveGroup)
    }
}

const emitGroup = (io: Server, groupId: number): void => {
    try {
        io.emit('groupUpdate', true)

        logger.log('socket', `Group ${groupId} updated`)
    } catch (error: any) {
        logger.log('socket', `emitGroup ${error.message} | error: ${1}`)
    }
}

const emitGroupVisitedClassrooms = async (
    io: Server,
    groupId: number
): Promise<void> => {
    try {
        const group: Group | null = await GroupService.getGroup(groupId)
        const visitedClassrooms =
            await GroupService.getGroupVisitedClassrooms(groupId)

        if (group?.GroupMembers) {
            group.GroupMembers.map((groupMember: ShortUser) => {
                if (groupMember.Socket?.id) {
                    io.to(groupMember.Socket?.id).emit(
                        'groupVisitedClassroom',
                        visitedClassrooms
                    )
                }
            })
        }

        logger.log('socket', `Group ${groupId} visited classrooms emitted`)
    } catch (error: any) {
        logger.log(
            'socket',
            `emitGroupVisitedClassrooms ${error.message} | error: ${1}`
        )
    }
}

const handleDeletedGroupClassroom = async (
    id: number,
    userId: number,
    io: Server
): Promise<void> => {
    const group: Group | null = await GroupService.getGroup(id)

    let socketData: ClassroomStatusEvent = {
        id: 0,
        status: ClassroomStatusEnum[ClassroomStatusEnum.free],
        prevStatus: '',
        userId
    }

    if (group?.Taken) {
        await setClassroomStatus(group.Taken, ClassroomStatusEnum.free, group)

        socketData.id = group.Taken.id
        socketData.prevStatus = ClassroomStatusEnum[ClassroomStatusEnum.busy]
        emitClassroomStatus(io, socketData)
    }

    if (group?.Reserved) {
        await setClassroomStatus(
            group.Reserved,
            ClassroomStatusEnum.free,
            group
        )

        socketData.id = group.Reserved.id
        socketData.prevStatus =
            ClassroomStatusEnum[ClassroomStatusEnum.reserved]

        emitClassroomStatus(io, socketData)
    }
}
