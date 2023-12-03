import { NextFunction, Request, Response } from 'express'
import { ValidationError, validationResult } from 'express-validator'

export const validate = (validations: Array<any>) => {
    return async (request: Request, response: Response, next: NextFunction) => {
        await Promise.all(
            validations.map((validation) => validation.run(request))
        )

        const errors: ValidationError[] = validationResult(request).array()
        if (!errors.length) {
            return next()
        }

        return response.status(422).json({
            result: errors[0].msg,
            error: 1,
            param: errors[0].type === 'field' && errors[0].path
        })
    }
}
