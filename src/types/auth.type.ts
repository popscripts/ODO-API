import { ManagedClassroom } from './classroom.type'
import { Group } from '@customTypes/group.type'
import { UserSocket } from '@customTypes/socket.type'

export type NewUser = {
    openDayId: number
    username: string
    password: string
    accountType: number
}

export type LoginUser = {
    id: number
    openDayId: number
    username: string
    password: string
    accountType: AccountType
}

export type User = {
    id: number
    openDayId: number
    username: string
    name: string | null
    accountType: AccountType
    pictureName: string | null
    ManagedClassroom: ManagedClassroom | null
    Group: Group | null
    Socket: UserSocket | null
}

export type ShortUser = {
    id: number
    username: string
    name: string | null
    Socket: UserSocket | null
    pictureName: string | null
}

export type AccountType = {
    id: number
    name: string
}

export interface Token {
    id: number
    openDayId: number
    username: string
    accountType: AccountType
    iat: number
    exp: number
}

export type Users = {
    id: number
    username: string
    name: string | null
    openDayId: number
    accountType: AccountType
    active: boolean
}
