import { NextFunction, Request, Response } from 'express'
import * as Error from '@libs/errors'
import * as AuthHelper from '@utils/auth.helper'
import { Token } from '@customTypes/auth.type'

export const authorize = async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get tokens from cookie
        const { JWT, refreshToken } = request.cookies

        // Verify token
        const tokenData: Token = AuthHelper.verifyToken(JWT, 'accessToken')

        // Check if the token renewal time is coming
        const now: Date = new Date()
        const exp: Date = new Date(tokenData.exp * 1000)
        const difference: number = exp.getTime() - now.getTime()
        const minutes: number = Math.round(difference / 60000)

        if (refreshToken && minutes < 15) {
            // Verify refresh token and get refresh token data
            const refreshTokenData: Token = await AuthHelper.verifyToken(refreshToken, 'refreshToken')
            // Check the user of refresh token
            if (refreshTokenData.id === tokenData.id) {
                const newTokenData = {
                    id: tokenData.id,
                    openDayId: tokenData.openDayId,
                    username: tokenData.username,
                    accountType: tokenData.accountType
                }
                // Generate new tokens
                const newAccessToken: string = AuthHelper.generateToken(newTokenData)
                const newRefreshToken: string = AuthHelper.generateRefreshToken(newTokenData)

                // Set response cookies
                response.cookie('JWT', newAccessToken, {
                    httpOnly: true,
                    sameSite: 'none'
                })

                response.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    sameSite: 'none'
                })
            }
        }
        next()
    } catch (error: any) {
        // Clear tokens
        response.clearCookie('JWT')
        response.clearCookie('refreshToken')
        return response.status(401).json(Error.authorizationError)
    }
}
