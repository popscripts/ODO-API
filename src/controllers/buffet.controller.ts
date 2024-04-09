import { Request, Response } from 'express'
import * as BuffetService from '@services/buffet.service'
import * as Error from '@libs/errors'
import * as Callback from '@libs/callbacks'
import { OrderStatusRecord } from '@libs/statuses'
import { logger } from '@config/logger'
import { Order, UserOrder } from '@customTypes/buffet.type'
import { Server } from 'socket.io'
import { UserSocket } from '@customTypes/socket.type'

export const orders = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const orders: Order[] = await BuffetService.getOrders(
            request.user.openDayId
        )

        return response.status(200).json({ result: orders, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const userOrders = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const usersOrders: UserOrder[] = await BuffetService.getUserOrders(
            request.user.id
        )

        return response.status(200).json({ result: usersOrders, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const ordersByStatus = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const orders: Order[] = await BuffetService.getOrdersByStatus(
            request.user.openDayId,
            OrderStatusRecord[request.params.status]
        )

        return response.status(200).json({ result: orders, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const placeOrder = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const { id, orderedBy } = await BuffetService.placeOrder(
            request.body.order,
            request.body.order.comment,
            request.user.openDayId,
            request.user.id
        )

        emitOrderUpdateEvent(request.io, orderedBy.Socket, id)

        return response.status(201).json(Callback.newOrder)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const changeOrderStatus = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const { id, orderedBy } = await BuffetService.changeOrderStatus(
            request.body.id,
            request.body.statusId
        )

        emitOrderUpdateEvent(request.io, orderedBy.Socket, id)

        return response.status(200).json(Callback.changeStatus)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const userOrdersByStatus = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const usersOrders: UserOrder[] =
            await BuffetService.getUserOrdersByStatus(
                request.user.openDayId,
                OrderStatusRecord[request.params.status],
                request.user.id
            )

        return response.status(200).json({ result: usersOrders, error: 0 })
    } catch (error: any) {
        return response.status(500).json(Error.responseError)
    }
}

const emitOrderUpdateEvent = (
    io: Server,
    orderSocket: UserSocket | null,
    orderId: number
): void => {
    try {
        io.to('cook').emit('orderUpdate', true)

        if (orderSocket?.connected) {
            io.to(orderSocket.id).emit('orderUpdate', true)
        }

        logger.log('socket', `Order ${orderId} emitted`)
    } catch (error: any) {
        logger.log(
            'socket',
            `emitOrderUpdateEvent ${error.message} | error: ${1}`
        )
    }
}
