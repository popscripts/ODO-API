import * as dotenv from 'dotenv'
import express, { Express } from 'express'
import cors from 'cors'
import { routerConfig } from '@config/router'
import { dbHealthCheck } from '@utils/db.healthcheck'
import cookieParser from 'cookie-parser'
import { cronConfig } from '@config/cron'
import { logger, morganMiddleware } from '@config/logger'
import fileUpload from 'express-fileupload'
import { Server as httpServer, createServer } from 'http'
import { Server } from 'socket.io'
import { ioConnectionConfig, createSocketServer } from '@config/socket'
import { Token } from '@customTypes/auth.type'

dotenv.config()

if (!process.env.PORT) {
    logger.error('PORT is undefined')
    process.exit(1)
}

const PORT: number = parseInt(process.env.PORT, 10)

declare global {
    namespace Express {
        export interface Request {
            io: Server
            user: Token
        }

        export interface Response {}
    }
}

dbHealthCheck().then(() => {
    const app: Express = express()

    const io: Server = createSocketServer()

    ioConnectionConfig(app, io)

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

    const server: httpServer = createServer(app)

    io.attach(server)

    server.listen(PORT, (): void => {
        logger.info(`Server started on :${PORT}`)
    })
})
