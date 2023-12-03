import { Request, Response } from 'express'
import * as Error from '@libs/errors'
import { verifyToken } from '@utils/auth.helper'
import { Token } from '@customTypes/auth.type'
import * as Callback from '@libs/callbacks'
import { logger } from '@config/logger'
import { Info } from '@customTypes/info.type'
import * as InfoService from '@services/info.service'

export const info = async (request: Request, response: Response) => {
    try {
        const token: string = request.cookies.JWT
        const { openDayId }: Token = verifyToken(token, 'accessToken')
        const info: Info | null = await InfoService.getInfo(openDayId)
        return response.status(200).json({ result: info, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const addInfo = async (request: Request, response: Response) => {
    try {
        const content: string = request.body.content
        const token: string = request.cookies.JWT
        const { openDayId }: Token = verifyToken(token, 'accessToken')
        await InfoService.addInfo(openDayId, content)
        return response.status(201).json(Callback.newInfo)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const editInfo = async (request: Request, response: Response) => {
    try {
        const content: string = request.body.content
        const token: string = request.cookies.JWT
        const { openDayId }: Token = verifyToken(token, 'accessToken')
        await InfoService.editInfo(openDayId, content)
        return response.status(201).json(Callback.editInfo)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}
