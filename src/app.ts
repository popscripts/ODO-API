import * as dotenv from 'dotenv'
import express from 'express'
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

dotenv.config()

if (!process.env.PORT) {
    logger.error('PORT is undefined')
    process.exit(1)
}

dbHealthCheck()

const PORT: number = parseInt(process.env.PORT, 10)

const app = express()
app.use(cors())
app.use(
    fileUpload({
        createParentPath: true,
        limits: {
            fileSize: 2 * 1024 * 1024 * 1024 //2MB max file(s) size
        }
    })
)
app.use(express.json())
app.use(cookieParser())
app.use(morganMiddleware)
routerConfig(app)
if (process.env.ODO_ENV === 'prod') {
    cronConfig()
}

const server: httpServer = app.listen(PORT, () => {
    logger.info('Server started!')
})

const io: Server = socketConfig(server)
ioConnectionConfig(io)
