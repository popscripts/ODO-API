import morgan from 'morgan'
import moment from 'moment-timezone'
import winston from 'winston'
import * as dotenv from 'dotenv'
import DailyRotateFile from 'winston-daily-rotate-file'

dotenv.config()

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    socket: 4
}

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
        (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
    )
)

export const logger = winston.createLogger({
    level: 'socket',
    levels,
    format,
    transports:
        process.env.ODO_ENV === 'prod'
            ? [
                  new winston.transports.Console(),
                  new DailyRotateFile({
                      filename: 'logs/ODO-API-T%DATE%.log',
                      datePattern: 'HH-mm',
                      frequency: '30m'
                  })
              ]
            : [new winston.transports.Console()]
})

const stream = {
    write: (message: any) => logger.http(message.trim())
}

const skip = (request: any) => {
    return request.originalUrl.startsWith('/api/dynamic-content')
}

morgan.token('date', (req, res, tz) => {
    return moment()
        .tz(<string>tz)
        .format('DD/MM/YYYY, HH:mm:ss')
})

morgan.format('log', ':method :url : :status | - :response-time ms')

export const morganMiddleware = morgan('log', { stream, skip })
