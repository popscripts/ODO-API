import * as GroupService from '@services/group.service'
import { Request, NextFunction, Response } from 'express'
import * as Error from '@libs/errors'
import { Member } from '@customTypes/group.type'

export const isUserMemberOfGroupVerification = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const groupId: number = request.body.id

    let verified: boolean = await GroupService.isUserMemberOfGroup(
        request.user.id,
        groupId
    )

    if (request.user.accountType.name === 'admin') {
        verified = true
    }

    if (verified) {
        next()
    } else {
        response.status(403).json(Error.userIsNotAMemberOfGroupError)
    }
}

export const isUserMemberOfAnyOtherGroupVerification = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const groupMembers: Member[] = request.body.groupMembers
    const groupId: number = parseInt(request.body.id)
    let isMember: boolean = false

    for (const groupMembersKey in groupMembers) {
        if (
            await GroupService.isUserMemberOfAnyGroup(
                groupMembers[groupMembersKey].id,
                groupId
            )
        ) {
            isMember = true
            break
        }
    }

    if (!isMember) {
        next()
    } else {
        response.status(422).json(Error.userIsAMemberOfOtherGroupError)
    }
}
