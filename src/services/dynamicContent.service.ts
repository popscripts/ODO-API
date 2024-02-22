import { Member } from '@customTypes/group.type'
import { db } from '@utils/db.server'

export const getDynamicContent = async (value: string): Promise<Member[]> => {
    return db.user.findMany({
        where: {
            name: {
                contains: value
            }
        },
        select: {
            id: true,
            name: true,
            groupId: true
        },
        orderBy: [{ groupId: 'asc' }, { name: 'asc' }]
    })
}
