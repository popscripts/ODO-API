import { db } from '@utils/db.server'
import * as KeyType from '@customTypes/key.types'

export const listKeys = async (): Promise<KeyType.Key[]> => {
    return db.key.findMany({
        select: {
            id: true,
            openDayId: true,
            key: true,
            expired: true,
            expiresAt: true
        }
    })
}

export const createKey = async (newKey: KeyType.NewKey) => {
    const { openDayId, key, expiresAt } = newKey
    return db.key.create({
        data: {
            openDayId,
            key,
            expiresAt
        }
    })
}

export const extendKeyValidity = async (id: number, date: Date) => {
    return db.key.update({
        where: {
            id
        },
        data: {
            expiresAt: date
        }
    })
}

export const getKey = async (key: number): Promise<KeyType.Key | null> => {
    return db.key.findUnique({
        where: {
            key
        },
        select: {
            id: true,
            key: true,
            openDayId: true,
            expired: true,
            expiresAt: true
        }
    })
}

export const isKeyValid = async (key: number): Promise<boolean> => {
    const isValid = await db.key.findFirst({
        where: {
            key,
            expired: false
        },
        select: {
            id: true
        }
    })
    return !!isValid
}

export const doesKeyExist = async (id: number): Promise<boolean> => {
    const doesExist = await db.key.findUnique({
        where: {
            id
        }
    })
    return !!doesExist
}

export const listUnexpiredKeys = async (): Promise<KeyType.Key[]> => {
    return db.key.findMany({
        where: {
            expired: false
        },
        select: {
            id: true,
            openDayId: true,
            key: true,
            expired: true,
            expiresAt: true
        }
    })
}

export const expireTheKey = async (id: number) => {
    return db.key.update({
        where: {
            id
        },
        data: {
            expired: true
        }
    })
}

export const getKeyExpirationDate = async (id: number): Promise<KeyType.ExpirationDate | null> => {
    return db.key.findUnique({
        where: {
            id
        },
        select: {
            expiresAt: true
        }
    })
}

export const deactivateKey = async (id: number) => {
    return db.key.update({
        where: {
            id
        },
        data: {
            expired: true
        }
    })
}
