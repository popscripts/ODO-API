import { Request, Response } from 'express'
import { logger } from '@config/logger'
import * as Error from '@libs/errors'
import { Member } from '@customTypes/group.type'
import * as DynamicContentService from '@services/dynamicContent.service'

export const getDynamicMembers = async (
    request: Request,
    response: Response
) => {
    try {
        const dynamicMemberList: Member[] =
            await DynamicContentService.getDynamicContent(request.params.value)

        return response
            .status(200)
            .json({ result: dynamicMemberList, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.getMembersListError)
    }
}
