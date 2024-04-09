import { db } from './db.server'
import { logger } from '@config/logger'
import process from 'process'

export const healthcheck = async (): Promise<void> => {
    if (!(await dbConnected())) {
        logger.error('Database connection error')
        process.exit(1)
    } else {
        logger.info('Database connected!')
    }
}
const dbConnected = async (): Promise<boolean> => {
    try {
        await db.$queryRaw`SELECT 1`
        return true
    } catch (error: any) {
        return false
    }
}
