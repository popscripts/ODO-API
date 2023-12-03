import express from 'express'
import * as BuffetController from '../controllers/buffet.controller'
import { validate } from '@middlewares/validation'
import { authorize } from '@middlewares/authorization'
import { verifyAccountType } from '@middlewares/accountTypeVerification'
import { AccountTypes } from '@libs/accountTypes'
import { newOrderValidation, orderStatusChangeValidation } from '@validations/buffet.validation'
import { orderStatusVerification } from '@middlewares/orderStatusVerification'

export const buffetRouter = express.Router()

/*
 * GET: List of all orders by openDayId
 * Allowed account types: admin, cook
 */
buffetRouter.get(
    '/',
    authorize,
    verifyAccountType(AccountTypes.admin, AccountTypes.cook),
    BuffetController.orders
)

/*
 * GET: List of all users orders
 */
buffetRouter.get('/user', authorize, BuffetController.userOrders)

/*
 * GET: List of all orders by status
 * Param: status
 */
buffetRouter.get(
    '/:status',
    authorize,
    verifyAccountType(AccountTypes.admin, AccountTypes.cook),
    BuffetController.ordersByStatus
)

/*
 * POST: Place an order
 * Param: order
 */
buffetRouter.post('/', authorize, validate(newOrderValidation), BuffetController.placeOrder)

/*
 * PATCH: Change order status
 * Params: id (orderId), status
 */
buffetRouter.patch(
    '/',
    authorize,
    validate(orderStatusChangeValidation),
    orderStatusVerification,
    BuffetController.changeOrderStatus
)

/*
 * GET: List of all user orders by status
 * Param: status
 */
buffetRouter.get('/user/:status', authorize, BuffetController.userOrdersByStatus)
