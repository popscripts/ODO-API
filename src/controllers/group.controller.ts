import { Request, Response } from 'express'
import * as GroupService from '@services/group.service'
import { logger } from '@config/logger'
import * as Error from '@libs/errors'
import * as Callbacks from '@libs/callbacks'
import { Group, Member } from '@customTypes/group.type'
import { Server } from 'socket.io'
import { ShortUser } from '@customTypes/auth.type'

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
        await GroupService.deleteGroup(id)
        emitDeletedGroup(request.io, id)

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

export const getMembersList = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const membersList: Member[] = await GroupService.getMembersList()
        return response.status(200).json({ result: membersList, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.getMembersListError)
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

const emitDeletedGroup = (io: Server, groupId: number): void => {
    try {
        io.emit('groupDeleted', {
            groupId
        })

        logger.log('socket', `Deleted group ${groupId} ID emitted`)
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
