import { Request, Response } from 'express'
import * as GroupService from '@services/group.service'
import { logger } from '@config/logger'
import * as Error from '@libs/errors'
import * as Callbacks from '@libs/callbacks'
import { Group, Member } from '@customTypes/group.type'
import { Server } from 'socket.io'
import { ShortUser } from '@customTypes/auth.type'
import { setClassroomStatus } from '@utils/status.helper'
import { ClassroomStatusEnum } from '@libs/classroomStatusEnum'
import { emitClassroomStatus } from '@controllers/classroom.controller'
import { ClassroomStatusEvent } from '@customTypes/classroom.type'
import { GroupActionEnum } from '@libs/GroupActionEnum'

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

        await emitGroup(request.io, id)

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

        await emitGroup(request.io, id)

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
        emitGroupAction(request.io, id, GroupActionEnum.delete)

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
        const { id, classroomId } = request.body

        await GroupService.addGroupVisitedClassroom(id, classroomId)

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
        const groupVisitedClassrooms =
            await GroupService.getGroupVisitedClassrooms(id)

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

        await emitDeletedGroupVisitedClassroom(request.io, id, classroomId)

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
        const groupId: number = parseInt(request.params.id)
        await GroupService.leaveGroup(request.user.id)
        emitGroupAction(request.io, groupId, GroupActionEnum.leave)

        return response.status(201).json(Callbacks.leaveGroup)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.leaveGroup)
    }
}

const emitGroup = async (io: Server, groupId: number): Promise<void> => {
    try {
        const group: Group | null = await GroupService.getGroup(groupId)

        io.emit('groupUpdate', {
            group
        })

        logger.log('socket', `Group ${groupId} data emitted`)
    } catch (error: any) {
        logger.log('socket', `emitGroup ${error.message} | error: ${1}`)
    }
}

const emitGroupAction = (io: Server, groupId: number, action: number): void => {
    try {
        io.emit('groupAction', {
            groupId,
            action: GroupActionEnum[action]
        })

        logger.log(
            'socket',
            `Action ${GroupActionEnum[action]} for group ${groupId} emitted`
        )
    } catch (error: any) {
        logger.log('socket', `emitDeletedGroup ${error.message} | error: ${1}`)
    }
}

const emitDeletedGroupVisitedClassroom = async (
    io: Server,
    groupId: number,
    classroomId: number
): Promise<void> => {
    try {
        const group: Group | null = await GroupService.getGroup(groupId)

        if (group?.GroupMembers) {
            group.GroupMembers.map((groupMember: ShortUser) => {
                if (groupMember.Socket?.id) {
                    io.to(groupMember.Socket?.id).emit(
                        'groupVisitedClassroomDeleted',
                        classroomId
                    )
                }
            })
        }

        logger.log(
            'socket',
            `Deleted group visited classroom ${classroomId} for group ${groupId} emitted`
        )
    } catch (error: any) {
        logger.log(
            'socket',
            `emitDeletedGroupVisitedClassroom ${error.message} | error: ${1}`
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
        await setClassroomStatus(
            group.Taken.id,
            ClassroomStatusEnum[ClassroomStatusEnum.free],
            id
        )

        socketData.id = group.Taken.id
        socketData.prevStatus = ClassroomStatusEnum[ClassroomStatusEnum.busy]
        await emitClassroomStatus(io, socketData)
    }

    if (group?.Reserved) {
        await setClassroomStatus(
            group.Reserved.id,
            ClassroomStatusEnum[ClassroomStatusEnum.free],
            id
        )

        socketData.id = group.Reserved.id
        socketData.prevStatus =
            ClassroomStatusEnum[ClassroomStatusEnum.reserved]

        await emitClassroomStatus(io, socketData)
    }
}
