import { ShortUser } from '@customTypes/auth.type'

export type UserSocket = {
    id: string
    User: ShortUser | null
}

export type SocketUserId = {
    userId: number
}
