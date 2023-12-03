import { db } from '@utils/db.server'
import * as BuffetType from '@customTypes/buffet.type'

export const getOrders = async (openDayId: number): Promise<BuffetType.Order[]> => {
    return db.order.findMany({
        where: {
            openDayId
        },
        select: {
            id: true,
            openDayId: true,
            dish: true,
            amount: true,
            comment: true,
            status: true,
            orderedBy: {
                select: {
                    id: true,
                    username: true,
                    name: true
                }
            },
            createdAt: true,
            updatedAt: true
        },
        orderBy: {
            id: 'desc'
        }
    })
}

export const getUserOrders = async (orderedById: number): Promise<BuffetType.Order[]> => {
    return db.order.findMany({
        where: {
            orderedById
        },
        select: {
            id: true,
            openDayId: true,
            dish: true,
            amount: true,
            comment: true,
            status: true,
            orderedBy: {
                select: {
                    id: true,
                    username: true,
                    name: true
                }
            },
            createdAt: true,
            updatedAt: true
        },
        orderBy: {
            id: 'desc'
        }
    })
}

export const getOrdersByStatus = async (openDayId: number, statusId: number): Promise<BuffetType.Order[]> => {
    return db.order.findMany({
        where: {
            openDayId,
            statusId
        },
        select: {
            id: true,
            openDayId: true,
            dish: true,
            amount: true,
            comment: true,
            status: true,
            orderedBy: {
                select: {
                    id: true,
                    username: true,
                    name: true
                }
            },
            createdAt: true,
            updatedAt: true
        },
        orderBy: {
            id: 'desc'
        }
    })
}

export const getOrder = async (id: number): Promise<BuffetType.Order | null> => {
    return db.order.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            openDayId: true,
            dish: true,
            amount: true,
            comment: true,
            status: true,
            orderedBy: {
                select: {
                    id: true,
                    username: true,
                    name: true
                }
            },
            createdAt: true,
            updatedAt: true
        }
    })
}

export const placeOrder = async (
    openDayId: number,
    orderedById: number,
    dishId: number,
    amount: number,
    comment: string | null
) => {
    return db.order.create({
        data: {
            openDayId,
            dishId,
            amount,
            orderedById,
            comment
        }
    })
}

export const checkAmountOfActiveUserOrders = async (orderedById: number): Promise<number> => {
    return db.order.count({
        where: {
            orderedById,
            statusId: 4
        }
    })
}

export const changeOrderStatus = async (id: number, statusId: number) => {
    return db.order.update({
        where: {
            id
        },
        data: {
            statusId
        }
    })
}

export const getUserOrdersByStatus = async (
    openDayId: number,
    statusId: number,
    orderedById: number
): Promise<BuffetType.Order[]> => {
    return db.order.findMany({
        where: {
            openDayId,
            statusId,
            orderedById
        },
        select: {
            id: true,
            openDayId: true,
            dish: true,
            amount: true,
            comment: true,
            status: true,
            orderedBy: {
                select: {
                    id: true,
                    username: true,
                    name: true
                }
            },
            createdAt: true,
            updatedAt: true
        },
        orderBy: {
            id: 'desc'
        }
    })
}
