import 'tsconfig-paths/register'
import { db } from './src/utils/db.server'

module.exports = async function globalTeardown(): Promise<void> {
    await db.classroom.deleteMany()
    await db.group.deleteMany()
    await db.groupVisitedClassroom.deleteMany()
    await db.info.deleteMany()
    await db.order.deleteMany()
    await db.orderPosition.deleteMany()
    await db.socket.deleteMany()
    await db.user.deleteMany()
    await db.key.deleteMany()
    await db.status.deleteMany()
    await db.dish.deleteMany()
    await db.accountType.deleteMany()
    await db.openDay.deleteMany()
}
