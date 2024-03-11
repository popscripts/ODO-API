import { NextFunction, Request, Response } from 'express'
import * as Error from '@libs/errors'

export const verifyAccountType = (...accountTypes: number[]) => {
    return (request: Request, response: Response, next: NextFunction) => {
        try {
            const accountTypesArray: number[] = [...accountTypes]

            const result: boolean = accountTypesArray
                .map(
                    (allowedAccountType: number): boolean =>
                        allowedAccountType === request.user.accountType.id
                )
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
