import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Token } from '@customTypes/auth.type'
import { logger } from '@config/logger'

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10)
}

export const validatePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword)
}

export const generateToken = (data: object): string => {
    if (!process.env.JWT_SECRET_KEY) {
        logger.error('JWT_SECRET_KEY is undefined')
        process.exit(1)
    }
    return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
}

export const generateRefreshToken = (data: object): string => {
    if (!process.env.JWT_REFRESH_KEY) {
        logger.error('JWT_REFRESH_KEY is undefined')
        process.exit(1)
    }
    return jwt.sign(data, process.env.JWT_REFRESH_KEY, { expiresIn: '2h' })
}

export const verifyToken = (token: string, tokenType: string): Token => {
    if (!process.env.JWT_SECRET_KEY) {
        logger.error('JWT_SECRET_KEY is undefined')
        process.exit(1)
    }

    if (!process.env.JWT_REFRESH_KEY) {
        logger.error('JWT_SECRET_KEY is undefined')
        process.exit(1)
    }
    const secretKey: string =
        tokenType === 'accessToken' ? process.env.JWT_SECRET_KEY : process.env.JWT_REFRESH_KEY

    return jwt.verify(token, secretKey) as Token
}

export const getOpenDayId = (token: string) => {
    const tokenData: Token = verifyToken(token, 'accessToken')
    return tokenData.openDayId
}
