import { body } from 'express-validator'

export const newInfoValidation = [body('content').isString().withMessage('Nie podano treści informacji')]

export const updatedInfoValidation = [body('content').isString().withMessage('Nie podano treści informacji')]
