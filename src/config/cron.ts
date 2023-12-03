import * as Job from '@utils/cron.jobs'

export const cronConfig = () => {
    Job.expireTheKey.start()
}
