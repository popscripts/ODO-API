import { ShortUser } from '@customTypes/auth.type'

export type Socket = {
    id: string
    User: ShortUser | null
    connected: boolean
}

export type UserSocket = {
    id: string
    connected: boolean
}

export type SocketUserData = {
    id: number
    accountType: string
}
