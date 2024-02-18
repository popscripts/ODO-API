import { ShortUser } from '@customTypes/auth.type'

export type Socket = {
    id: string
    User: ShortUser | null
    connected: boolean
}

export type SocketUserId = {
    userId: number
}

export type UserSocket = {
    id: string
    connected: boolean
}
