import * as GroupService from '@services/group.service'
import { Request, NextFunction, Response } from 'express'
import * as Error from '@libs/errors'

export const groupVisitedClassroomVerification = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const { id, classroomId } = request.body

    let verified: boolean = await GroupService.isUserMemberOfGroup(
        request.user.id,
        id
    )

    let isVisited: boolean = await GroupService.isClassroomAlreadyVisited(
        id,
        classroomId
    )

    if (verified && !isVisited) {
        next()
    } else if (verified && isVisited) {
        response.status(422).json(Error.groupClassroomAlreadyVisitedError)
    } else {
        response.status(403).json(Error.userIsNotAMemberOfGroupError)
    }
}
