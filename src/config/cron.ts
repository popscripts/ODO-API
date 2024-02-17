import * as Job from '@utils/cron.jobs'

export const cronConfig = () => {
    if (process.env.ODO_ENV === 'prod') {
        Job.expireTheKey.start()
    }
}
