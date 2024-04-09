import { db } from '@utils/db.server'
import * as BuffetType from '@customTypes/buffet.type'
import { NewOrder } from '@customTypes/buffet.type'
import { OrderStatusEnum } from '@libs/statuses'

export const getOrders = async (
    openDayId: number
): Promise<BuffetType.Order[]> => {
    return db.order.findMany({
        where: {
            openDayId
        },
        select: {
            id: true,
            openDayId: true,
            OrderPosition: {
                include: {
                    dish: true
                }
            },
            comment: true,
            status: true,
            orderedBy: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    Socket: {
                        select: {
                            id: true,
                            connected: true
                        }
                    },
                    pictureName: true,
                    accountType: true
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

export const getUserOrders = async (
    orderedById: number
): Promise<BuffetType.UserOrder[]> => {
    return db.order.findMany({
        where: {
            orderedById
        },
        select: {
            id: true,
            openDayId: true,
            OrderPosition: {
                include: {
                    dish: true
                }
            },
            comment: true,
            status: true,
            createdAt: true,
            updatedAt: true
        },
        orderBy: {
            id: 'desc'
        }
    })
}

export const getOrdersByStatus = async (
    openDayId: number,
    statusId: number
): Promise<BuffetType.Order[]> => {
    return db.order.findMany({
        where: {
            openDayId,
            statusId
        },
        select: {
            id: true,
            openDayId: true,
            OrderPosition: {
                include: {
                    dish: true
                }
            },
            comment: true,
            status: true,
            orderedBy: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    Socket: {
                        select: {
                            id: true,
                            connected: true
                        }
                    },
                    pictureName: true,
                    accountType: true
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

export const getOrder = async (
    id: number
): Promise<BuffetType.Order | null> => {
    return db.order.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            openDayId: true,
            OrderPosition: {
                include: {
                    dish: true
                }
            },
            comment: true,
            status: true,
            orderedBy: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    Socket: {
                        select: {
                            id: true,
                            connected: true
                        }
                    },
                    pictureName: true,
                    accountType: true
                }
            },
            createdAt: true,
            updatedAt: true
        }
    })
}

export const placeOrder = async (
    order: NewOrder,
    comment: string | null,
    openDayId: number,
    orderedById: number
) => {
    return db.order.create({
        data: {
            openDayId,
            orderedById,
            comment,
            OrderPosition: {
                create: order.orderPositions
            }
        },
        select: {
            id: true,
            orderedBy: {
                include: {
                    Socket: true
                }
            }
        }
    })
}

export const checkAmountOfActiveUserOrders = async (
    orderedById: number
): Promise<number> => {
    return db.order.count({
        where: {
            orderedById,
            statusId: {
                notIn: [
                    OrderStatusEnum.done,
                    OrderStatusEnum.pickedUp,
                    OrderStatusEnum.cancelled
                ]
            }
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
        },
        select: {
            id: true,
            orderedBy: {
                select: {
                    Socket: true
                }
            }
        }
    })
}

export const getUserOrdersByStatus = async (
    openDayId: number,
    statusId: number,
    orderedById: number
): Promise<BuffetType.UserOrder[]> => {
    return db.order.findMany({
        where: {
            openDayId,
            statusId,
            orderedById
        },
        select: {
            id: true,
            openDayId: true,
            OrderPosition: {
                include: {
                    dish: true
                }
            },
            comment: true,
            status: true,
            createdAt: true,
            updatedAt: true
        },
        orderBy: {
            id: 'desc'
        }
    })
}
