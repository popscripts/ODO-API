import { Request, Response } from 'express'
import * as BuffetService from '@services/buffet.service'
import * as Error from '@libs/errors'
import * as Callback from '@libs/callbacks'
import { statuses } from '@libs/statuses'
import { logger } from '@config/logger'
import { NewOrder, Order } from '@customTypes/buffet.type'
import { Dishes } from '@libs/dishes'

export const orders = async (request: Request, response: Response) => {
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

export const userOrders = async (request: Request, response: Response) => {
    try {
        const usersOrders: Order[] = await BuffetService.getUserOrders(
            request.user.id
        )

        return response.status(200).json({ result: usersOrders, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const ordersByStatus = async (request: Request, response: Response) => {
    try {
        const status: string = request.params.status
        const statusId: number = statuses[status]

        const orders: Order[] = await BuffetService.getOrdersByStatus(
            request.user.openDayId,
            statusId
        )

        return response.status(200).json({ result: orders, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const placeOrder = async (request: Request, response: Response) => {
    try {
        const { dish, amount, comment }: NewOrder = request.body

        await BuffetService.placeOrder(
            request.user.openDayId,
            request.user.id,
            Dishes[dish],
            amount,
            comment
        )

        return response.status(201).json(Callback.newOrder)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const changeOrderStatus = async (
    request: Request,
    response: Response
) => {
    try {
        const { id, status } = request.body
        const statusId = statuses[status]
        await BuffetService.changeOrderStatus(id, statusId)
        return response.status(200).json(Callback.changeStatus)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const userOrdersByStatus = async (
    request: Request,
    response: Response
) => {
    try {
        const usersOrders = await BuffetService.getUserOrdersByStatus(
            request.user.openDayId,
            statuses[request.params.status],
            request.user.id
        )

        return response.status(200).json({ result: usersOrders, error: 0 })
    } catch (error: any) {
        return response.status(500).json(Error.responseError)
    }
}
