import { Request, Response } from 'express'
import * as Error from '@libs/errors'
import * as KeyService from '@services/key.service'
import * as KeyType from '@customTypes/key.types'
import * as KeyHelper from '@utils/key.helper'
import * as AuthHelper from '@utils/auth.helper'
import * as Callback from '@libs/callbacks'
import { logger } from '@config/logger'

export const listKeys = async (request: Request, response: Response) => {
    try {
        const keyList: KeyType.Key[] = await KeyService.listKeys()
        return response.status(200).json({ result: keyList, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const generateKey = async (request: Request, response: Response) => {
    try {
        const token = request.cookies.JWT
        const openDayId: number = AuthHelper.getOpenDayId(token)
        const newKey: KeyType.NewKey = KeyHelper.generateKey(openDayId)
        await KeyService.createKey(newKey)
        return response.status(201).json(Callback.createKey)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const extendKeyValidity = async (request: Request, response: Response) => {
    try {
        const id: number = request.body.id
        const expirationDate: KeyType.ExpirationDate | null = await KeyService.getKeyExpirationDate(id)
        const parsedDate: Date = new Date(expirationDate!.expiresAt!)
        const extendedDate: Date = new Date()
        extendedDate.setDate(parsedDate.getDate() + 7)

        await KeyService.extendKeyValidity(id, extendedDate)
        return response.status(201).json(Callback.extendKeyValidity)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const listUnexpiredKeys = async (request: Request, response: Response) => {
    try {
        const unexpiredKeys: KeyType.Key[] = await KeyService.listUnexpiredKeys()
        return response.status(200).json({ result: unexpiredKeys, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const deactivateKey = async (request: Request, response: Response) => {
    try {
        const id: number = request.body.id
        await KeyService.deactivateKey(id)
        return response.status(200).json(Callback.deactivateKey)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.deactivateKeyError)
    }
}

export const regenerateKey = async (request: Request, response: Response) => {
    try {
        const id: number = request.body.id
        const token = request.cookies.JWT
        const openDayId: number = AuthHelper.getOpenDayId(token)
        const newKey: KeyType.NewKey = KeyHelper.generateKey(openDayId)
        await KeyService.deactivateKey(id)
        await KeyService.createKey(newKey)
        return response.status(201).json(Callback.regenerateKey)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.regenerateKeyError)
    }
}
