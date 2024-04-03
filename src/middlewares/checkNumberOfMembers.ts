import { getNumberOfMembers } from '@services/group.service'
import { Request, NextFunction, Response } from 'express'
import { deleteGroup } from '@controllers/group.controller'

export const checkNumberOfMembers = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    const id: number = parseInt(request.params.id)
    const numberOfMembers: number = await getNumberOfMembers(id)

    if (numberOfMembers === 1) {
        request.body.id = id
        return deleteGroup(request, response)
    }

    next()
}
