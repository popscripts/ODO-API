import { body, cookie, CustomValidator } from 'express-validator'
import * as BuffetService from '../services/buffet.service'
import { Token } from '@customTypes/auth.type'
import { verifyToken } from '@utils/auth.helper'

const orderedByValidation: CustomValidator = async (token) => {
    const tokenData: Token = verifyToken(token, 'accessToken')
    return BuffetService.checkAmountOfActiveUserOrders(tokenData.id).then((amountOfActiveOrders) => {
        if (amountOfActiveOrders >= 3) {
            return Promise.reject('Przekroczono maksymalną ilość aktywnych zamówień (max 3)')
        }
    })
}

export const newOrderValidation = [
    body('order')
        .isString()
        .withMessage('Nie podano treści zamówienia')
        .isLength({ min: 3 })
        .withMessage('Treść zamówienia zbyt krótka (min. 3 znaki)'),
    cookie('JWT').custom(orderedByValidation)
]

export const orderStatusChangeValidation = [
    body('id').isNumeric().withMessage('ID zamówienia nie zostało podane'),
    body('status').isString().withMessage('Status zamówienia nie został przekazany')
]
