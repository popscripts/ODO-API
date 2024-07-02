import * as dotenv from 'dotenv'
import express, { Express } from 'express'
import cors from 'cors'
import { routerConfig } from '@config/router'
import cookieParser from 'cookie-parser'
import { cronConfig } from '@config/cron'
import { morganMiddleware } from '@config/logger'
import fileUpload from 'express-fileupload'
import { Server } from 'socket.io'
import { Token } from '@customTypes/auth.type'

dotenv.config()

declare global {
    namespace Express {
        export interface Request {
            io: Server
            user: Token
        }

        export interface Response {}
    }
}

const app: Express = express()

app.use(
    cors({
        credentials: true,
        origin: (_, callback) => {
            callback(null, true)
        }
    })
)
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

export default app
