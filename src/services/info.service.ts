import { db } from '@utils/db.server'
import { Info } from '@customTypes/info.type'

export const getInfo = async (openDayId: number): Promise<Info | null> => {
    return db.info.findFirst({
        where: {
            openDayId,
            deleted: false
        },
        select: {
            id: true,
            openDayId: true,
            content: true,
            deleted: true,
            createdAt: true,
            updatedAt: true
        }
    })
}

export const addInfo = async (openDayId: number, content: string) => {
    return db.info.create({
        data: {
            openDayId,
            content
        }
    })
}

export const editInfo = async (id: number, content: string) => {
    return db.info.update({
        where: {
            id
        },
        data: {
            content
        }
    })
}
