import { CronJob } from 'cron'
import * as KeyService from '../services/key.service'
import { logger } from '@config/logger'
import { Key } from '@customTypes/key.types'

export const expireTheKey = new CronJob('* */12 * * *', async () => {
    try {
        const keys: Key[] = await KeyService.listUnexpiredKeys()
        const currentDate: number = new Date().getTime()

        Object.values(keys).forEach((key: Key) => {
            const expiresAt: number = key.expiresAt.getTime()
            if (expiresAt - currentDate < 0) {
                logger.info(`Klucz ${key.key} wygasł`)
                KeyService.expireTheKey(key.id)
            }
        })
    } catch (error: any) {
        logger.error(`Wystąpił błąd przy wygaszaniu klucza | ${error}`)
    }
})
