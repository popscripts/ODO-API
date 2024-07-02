import { createServer, Server as httpServer } from 'http'
import { logger } from '@config/logger'
import app from './app'
import { Server } from 'socket.io'
import { createSocketServer, ioConnectionConfig } from '@config/socket'
import * as dotenv from 'dotenv'
import { healthcheck } from '@utils/healthcheck'

dotenv.config()

if (!process.env.PORT) {
    logger.error('PORT is undefined')
    process.exit(1)
}

healthcheck()

const PORT: number = parseInt(process.env.PORT, 10)
const io: Server = createSocketServer()

ioConnectionConfig(app, io)

const server: httpServer = createServer(app)

io.attach(server)

server.listen(PORT, (): void => {
    logger.info(`Server started on :${PORT}`)
})
