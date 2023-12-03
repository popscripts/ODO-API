import { Express } from 'express'
import { authRouter } from '@routes/auth.router'
import { classroomRouter } from '@routes/classroom.router'
import { keyRouter } from '@routes/key.router'
import { buffetRouter } from '@routes/buffet.router'
import { infoRouter } from '@routes/info.router'
import { groupRouter } from '@routes/group.router'

export const routerConfig = (app: Express): void => {
    app.use('/api/auth', authRouter)
    app.use('/api/classroom', classroomRouter)
    app.use('/api/key', keyRouter)
    app.use('/api/buffet', buffetRouter)
    app.use('/api/info', infoRouter)
    app.use('/api/group', groupRouter)
}
