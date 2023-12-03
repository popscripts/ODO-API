import { Status } from './status.type'
import { ShortUser } from './auth.type'

export type Order = {
    id: number
    openDayId: number
    dish: Dish
    amount: number
    comment: string | null
    status: Status
    orderedBy: ShortUser
    createdAt: Date
    updatedAt: Date
}

export type Dish = {
    id: number
    name: string
    cheese: boolean
    ham: boolean
}

export type NewOrder = {
    dish: string
    amount: number
    comment: string | null
}
