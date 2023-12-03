import { NextFunction, Request, Response } from 'express'
import * as AuthHelper from '@utils/auth.helper'
import * as Error from '@libs/errors'
import { Token } from '@customTypes/auth.type'

export const verifyAccountType = (...accountTypes: number[]) => {
    return (request: Request, response: Response, next: NextFunction) => {
        try {
            const accountTypesArray: number[] = [...accountTypes]
            const token = request.cookies.JWT
            const { accountType }: Token = AuthHelper.verifyToken(token, 'accessToken')
            const result: boolean = accountTypesArray
                .map((allowedAccountType: number): boolean => allowedAccountType === accountType.id)
                .includes(true)
            if (!result) {
                return response.status(401).json(Error.permissionError)
            }
            next()
        } catch (error: any) {
            return response.status(401).json(Error.permissionError)
        }
    }
}
