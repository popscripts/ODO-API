import { Request, Response, NextFunction } from 'express'
import * as AuthHelper from '@utils/auth.helper'
import * as Error from '@libs/errors'
import { Token } from '@customTypes/auth.type'
import { Order } from '@customTypes/buffet.type'
import { getOrder } from '@services/buffet.service'

export const orderStatusVerification = async (request: Request, response: Response, next: NextFunction) => {
    const { id, status } = request.body
    const token = request.cookies.JWT
    const tokenData: Token = AuthHelper.verifyToken(token, 'accessToken')
    const order: Order | null = await getOrder(id)
    let verified: boolean = false

    // Check if order belongs to the user, new status isn't "done" and order isn't cancelled
    if (tokenData.id === order?.orderedBy.id && status !== 'done' && order?.status.name !== 'cancelled') {
        verified = true
    }

    // Check if user has admin or cook privileges
    if (tokenData.accountType.name !== 'user') {
        verified = true
    }

    if (verified) {
        next()
    } else {
        return response.status(500).json(Error.responseError)
    }
}
