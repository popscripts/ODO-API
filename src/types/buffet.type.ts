import { Status } from './status.type'
import { ShortUser } from './auth.type'

export type Order = {
    id: number
    openDayId: number
    OrderPosition: OrderPosition[]
    comment: string | null
    status: Status
    orderedBy: ShortUser
    createdAt: Date
    updatedAt: Date
}

export type UserOrder = {
    id: number
    openDayId: number
    OrderPosition: OrderPosition[]
    comment: string | null
    status: Status
    createdAt: Date
    updatedAt: Date
}

export type OrderPosition = {
    id: number
    orderId: number
    dish: Dish
    amount: number
}

export type Dish = {
    id: number
    name: string
    cheese: boolean
    ham: boolean
}

export type NewOrder = {
    orderPositions: NewOrderPosition[]
    comment: string | null
}

export type NewOrderPosition = {
    dishId: number
    amount: number
}
