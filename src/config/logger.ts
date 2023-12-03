import morgan from 'morgan'
import moment from 'moment-timezone'
import winston from 'winston'
import * as dotenv from 'dotenv'

dotenv.config()

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
}

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
)

export const logger = winston.createLogger({
    level: 'debug',
    levels,
    format,
    transports:
        process.env.ODO_ENV === 'prod'
            ? [
                  new winston.transports.Console(),
                  new winston.transports.File({
                      filename: 'logs/error.log',
                      level: 'error'
                  }),
                  new winston.transports.File({ filename: 'logs/all.log' })
              ]
            : [new winston.transports.Console()]
})

const stream = {
    write: (message: any) => logger.http(message.trim())
}

const skip = () => {
    const env = process.env.NODE_ENV || 'development'
    return env !== 'development'
}

morgan.token('date', (req, res, tz) => {
    return moment()
        .tz(<string>tz)
        .format('DD/MM/YYYY, HH:mm:ss')
})

morgan.format('log', ':method :url : :status | - :response-time ms')

export const morganMiddleware = morgan('log', { stream, skip })
