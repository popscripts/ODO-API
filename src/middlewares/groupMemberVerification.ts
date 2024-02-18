import { Token } from '@customTypes/auth.type'
import { verifyToken } from '@utils/auth.helper'
import * as GroupService from '@services/group.service'
import { Request, NextFunction, Response } from 'express'
import * as Error from '@libs/errors'

export const isUserMemberOfGroupVerification = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const tokenData: Token = verifyToken(request.cookies.JWT, 'accessToken')
    const groupId: number = request.body.id

    let verified: boolean = await GroupService.isUserMemberOfGroup(
        tokenData.id,
        groupId
    )

    if (tokenData.accountType.name === 'admin') {
        verified = true
    }

    if (verified) {
        next()
    } else {
        response.status(403).json(Error.userIsNotAMemberOfGroupError)
    }
}
