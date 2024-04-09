import { Request, Response } from 'express'
import * as Error from '@libs/errors'
import * as Callback from '@libs/callbacks'
import { logger } from '@config/logger'
import { Info } from '@customTypes/info.type'
import * as InfoService from '@services/info.service'
import { Server } from 'socket.io'

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

        const newInfo: Info = await InfoService.addInfo(
            request.user.openDayId,
            content
        )

        await emitInfo(request.io, newInfo)

        return response.status(201).json(Callback.newInfo)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

export const editInfo = async (request: Request, response: Response) => {
    try {
        const content: string = request.body.content

        const updatedInfo: Info = await InfoService.editInfo(
            request.user.openDayId,
            content
        )

        await emitInfo(request.io, updatedInfo)

        return response.status(201).json(Callback.editInfo)
    } catch (error: any) {
        logger.error(`500 | ${error}`)
        return response.status(500).json(Error.responseError)
    }
}

const emitInfo = async (io: Server, info: Info): Promise<void> => {
    try {
        io.emit('infoUpdate', {
            info
        })

        logger.log('socket', `Info ${info.id} data emitted`)
    } catch (error: any) {
        logger.log('socket', `emitInfo ${error.message} | error: ${1}`)
    }
}
