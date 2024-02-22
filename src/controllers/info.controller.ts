import { Request, Response } from 'express'
import * as Error from '@libs/errors'
import * as Callback from '@libs/callbacks'
import { logger } from '@config/logger'
import { Info } from '@customTypes/info.type'
import * as InfoService from '@services/info.service'

export const info = async (request: Request, response: Response) => {
    try {
        const info: Info | null = await InfoService.getInfo(
            request.user.openDayId
        )

        return response.status(200).json({ result: info, error: 0 })
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const addInfo = async (request: Request, response: Response) => {
    try {
        const content: string = request.body.content
        await InfoService.addInfo(request.user.id, content)

        return response.status(201).json(Callback.newInfo)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const editInfo = async (request: Request, response: Response) => {
    try {
        const content: string = request.body.content
        await InfoService.editInfo(request.user.openDayId, content)

        return response.status(201).json(Callback.editInfo)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}
