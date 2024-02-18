import { Request, Response } from 'express'
import * as GroupService from '@services/group.service'
import { logger } from '@config/logger'
import * as Error from '@libs/errors'
import * as Callbacks from '@libs/callbacks'
import { Group } from '@customTypes/group.type'
import { verifyToken } from '@utils/auth.helper'
import { Server } from 'socket.io'

export const getGroups = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const token: string = request.cookies.JWT
        const { openDayId } = verifyToken(token, 'accessToken')
        const groups: Group[] | null = await GroupService.getGroups(openDayId)

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
        const token: string = request.cookies.JWT
        const { openDayId } = verifyToken(token, 'accessToken')

        const { id } = await GroupService.addGroup(
            openDayId,
            groupSize,
            description
        )

        await GroupService.updateGroupMembers(openDayId, id, groupMembers)

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
        const token: string = request.cookies.JWT
        const { openDayId } = verifyToken(token, 'accessToken')

        await GroupService.updateGroup(id, groupSize, description)

        await GroupService.updateGroupMembers(openDayId, id, groupMembers)

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
