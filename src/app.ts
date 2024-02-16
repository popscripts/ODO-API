import * as dotenv from 'dotenv'
import express, { Express } from 'express'
import cors from 'cors'
import { routerConfig } from '@config/router'
import { dbHealthCheck } from '@utils/db.healthcheck'
import cookieParser from 'cookie-parser'
import { cronConfig } from '@config/cron'
import { logger, morganMiddleware } from '@config/logger'
import fileUpload from 'express-fileupload'
import { Server as httpServer } from 'http'
import { Server } from 'socket.io'
import { ioConnectionConfig, socketConfig } from '@config/socket'
import { disconnectAllSocketHandler } from '@utils/socket.handler'

dotenv.config()

if (!process.env.PORT) {
    logger.error('PORT is undefined')
    process.exit(1)
}

const PORT: number = parseInt(process.env.PORT, 10)

dbHealthCheck().then(() => {
    const app: Express = express()
    app.use(cors())
    app.use(
        fileUpload({
            createParentPath: true,
            limits: {
                fileSize: 2 * 1024 * 1024 * 1024
            }
        })
    )
    app.use(express.json())
    app.use(cookieParser())
    app.use(morganMiddleware)
    routerConfig(app)
    cronConfig()

    const server: httpServer = app.listen(PORT, (): void => {
        logger.info('Server started!')
    })

    const io: Server = socketConfig(server)
    disconnectAllSocketHandler(io).then(() =>
        logger.info('Disconnected all Sockets')
    )

    ioConnectionConfig(io)
})
