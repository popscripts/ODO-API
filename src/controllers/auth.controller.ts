import * as AuthService from '@services/auth.service'
import * as KeyService from '@services/key.service'
import * as Callback from '@libs/callbacks'
import * as Error from '@libs/errors'
import { Request, Response } from 'express'
import { UploadedFile } from 'express-fileupload'
import * as AuthHelper from '@utils/auth.helper'
import { AccountTypes } from '@libs/accountTypes'
import { LoginUser, User, Users } from '@customTypes/auth.type'
import { logger } from '@config/logger'
import { Key } from '@customTypes/key.type'
import { upload } from '@utils/file.helper'
import { Server } from 'socket.io'
import fs from 'fs'
import { disconnectUserSocket } from '@services/socket.service'

export const register = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const { key, username, password } = request.body
        const keyData: Key | null = await KeyService.getKey(key)

        if (!keyData) {
            logger.error(`500 | keyData is undefined`)
            return response.status(500).json(Error.registerError)
        }

        const registerData = {
            openDayId: keyData.openDayId,
            username,
            password,
            accountType: AccountTypes['user']
        }
        await AuthService.register(registerData)
        return response.status(201).json(Callback.register)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.registerError)
    }
}

export const login = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const { username, password } = request.body
        const user: LoginUser | null = await AuthService.login(username)

        const validatePassword: boolean = await AuthHelper.validatePassword(
            password,
            user!.password
        )

        if (!validatePassword) {
            return response.status(403).json(Error.wrongPassword)
        }

        const userData = {
            id: user!.id,
            openDayId: user!.openDayId,
            username: user!.username,
            accountType: user!.accountType
        }

        const accessToken: string = AuthHelper.generateToken(userData)
        const refreshToken: string = AuthHelper.generateRefreshToken(userData)

        response.cookie('JWT', accessToken, {
            httpOnly: true,
            sameSite: 'none'
        })

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'none'
        })

        return response.status(200).json(Callback.login)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.loginError)
    }
}

export const logout = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        response.clearCookie('JWT')
        response.clearCookie('refreshToken')

        await disconnectUserSocket(request.user.id)

        return response.status(200).json(Callback.logout)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const user = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const userData: User | null = await AuthService.getUser(request.user.id)
        return response.status(200).json({ result: userData, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const users = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const users: Users[] | null = await AuthService.getUsers(
            request.user.openDayId
        )

        return response.status(200).json({ result: users, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const editUser = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const { id, username, accountType, shouldLogout } = request.body
        await AuthService.editUser(id, username, AccountTypes[accountType])

        if (shouldLogout) {
            await callLogout(request.io, id)
        }

        return response.status(201).json(Callback.editUser)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const deleteUser = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const id: number = request.body.id
        await callLogout(request.io, id)
        await AuthService.deleteUser(id)
        return response.status(200).json(Callback.deleteUser)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const restoreUser = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const id: number = request.body.id
        await AuthService.restoreUser(id)
        return response.status(200).json(Callback.restoreUser)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const usersByStatus = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const status: boolean = request.params.status === 'active'
        const users: Users[] | null = await AuthService.getUsersByStatus(
            request.user.openDayId,
            status
        )

        return response.status(200).json({ result: users, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const updateProfilePicture = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const picture: UploadedFile = request.files!.picture as UploadedFile
        await upload(picture, request.user.id)
        return response.status(201).json(Callback.savePhoto)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.updateProfilePictureError)
    }
}

export const getPicture = async (
    request: Request,
    response: Response
): Promise<void | Response> => {
    try {
        const picturePath: string = './uploads/' + request.params.id + '.png'

        if (!fs.existsSync(picturePath)) {
            return response.status(404).json(Error.fileNotExistError)
        }

        return response.status(200).sendFile(picturePath, { root: '.' })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.loadProfilePictureError)
    }
}

export const updatePersonalData = async (
    request: Request,
    response: Response
): Promise<Response> => {
    try {
        const { userId, name } = request.body
        await AuthService.updatePersonalData(userId, name)
        return response.status(201).json(Callback.updatePersonalData)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.updatePersonalDataError)
    }
}

const callLogout = async (io: Server, userId: number): Promise<void> => {
    try {
        const user: User | null = await AuthService.getUser(userId)
        const socketId: string | undefined = user?.Socket?.id

        if (socketId) {
            io.to(socketId).emit('callLogout', true)
            logger.log('socket', `callLogout emitted for userID: ${user?.id}`)
        }
    } catch (error: any) {
        logger.log('socket', `callLogout ${error.message} | error: ${1}`)
    }
}
