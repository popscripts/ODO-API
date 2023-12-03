import { NewKey } from '@customTypes/key.types'

export const generateKey = (openDayId: number, expiresIn: number = 7): NewKey => {
    const expiresAt: Date = getExpirationDay(expiresIn)
    return {
        openDayId,
        key: getRandomInt(111111, 999999),
        expiresAt
    }
}

const getExpirationDay = (days: number) => {
    const date: Date = new Date()
    date.setDate(date.getDate() + days)
    return date
}

const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}
