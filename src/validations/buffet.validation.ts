import {
    body,
    cookie,
    CustomValidator,
    ValidationChain
} from 'express-validator'
import * as BuffetService from '../services/buffet.service'
import { Token } from '@customTypes/auth.type'
import { verifyToken } from '@utils/auth.helper'
import { NewOrder } from '@customTypes/buffet.type'
import { DishEnum } from '@libs/dishEnum'

const MAX_NUMBER_OF_ACTIVE_ORDERS = 3

const orderedByValidation: CustomValidator = async (token) => {
    const tokenData: Token = verifyToken(token, 'accessToken')
    return BuffetService.checkAmountOfActiveUserOrders(tokenData.id).then(
        (amountOfActiveOrders: number) => {
            if (amountOfActiveOrders >= MAX_NUMBER_OF_ACTIVE_ORDERS) {
                return Promise.reject(
                    'Przekroczono maksymalną ilość aktywnych zamówień (max 3)'
                )
            }
        }
    )
}

const ordersValidation: CustomValidator = async (order: NewOrder) => {
    if (!order || order.orderPositions.length === 0) {
        return Promise.reject('Należy wybrać co najmniej jedną opcję z bufetu')
    }

    let doesPositionExist: boolean = true
    let unknownPosition = null

    for (let orderPosition in order.orderPositions) {
        if (!DishEnum[order.orderPositions[orderPosition].dishId]) {
            doesPositionExist = false
            unknownPosition = order.orderPositions[orderPosition].dishId
            break
        }
    }

    if (!doesPositionExist) {
        return Promise.reject(`Pozycja ${unknownPosition} nie istnieje w menu`)
    }
}

export const newOrderValidation: ValidationChain[] = [
    cookie('JWT').custom(orderedByValidation),
    body('order').custom(ordersValidation)
]

export const orderStatusChangeValidation: ValidationChain[] = [
    body('id').isNumeric().withMessage('ID zamówienia nie zostało podane'),
    body('statusId')
        .isNumeric()
        .withMessage('Status zamówienia nie został przekazany')
]
