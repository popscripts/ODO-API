export type Key = {
    id: number
    openDayId: number
    key: number
    expired: boolean
    expiresAt: Date
}

export type NewKey = {
    openDayId: number
    key: number
    expiresAt: Date
}

export type ExpirationDate = {
    expiresAt: Date | null
}
