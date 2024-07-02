import 'tsconfig-paths/register'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.test' })

import { seed } from './prisma/testSeed'
import { db } from './src/utils/db.server'
import { faker } from '@faker-js/faker'

const createTestOpenDay = async () => {
    try {
        const openDay = await db.openDay.create({
            data: {},
            select: { id: true }
        })

        await db.key.create({
            data: {
                openDayId: openDay.id,
                key: 123456,
                expiresAt: faker.date.soon({ days: 1 })
            }
        })
    } catch (error: any) {
        console.error('An error occurred during creating open day')
    }
}

module.exports = async function globalSetup() {
    await seed()
    await createTestOpenDay()
}
