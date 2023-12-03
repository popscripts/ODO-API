import { Request, Response } from 'express'
import * as GroupService from '@services/group.service'
import { logger } from '@config/logger'
import * as Error from '@libs/errors'
import { Group } from '@customTypes/group.type'

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
        return response.status(500).json(Error.responseError)
    }
}
