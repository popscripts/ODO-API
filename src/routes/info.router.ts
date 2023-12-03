import express from 'express'
import { validate } from '@middlewares/validation'
import { authorize } from '@middlewares/authorization'
import { verifyAccountType } from '@middlewares/accountTypeVerification'
import { AccountTypes } from '@libs/accountTypes'
import * as InfoController from '@controllers/info.controller'
import { newInfoValidation, updatedInfoValidation } from '@validations/info.validation'

export const infoRouter = express.Router()

/*
 * GET: Get active info
 */
infoRouter.get('/', authorize, InfoController.info)

/*
 * POST: Add new info
 * Params: content
 * Allowed account types: admin
 */
infoRouter.post(
    '/',
    authorize,
    validate(newInfoValidation),
    verifyAccountType(AccountTypes.admin),
    InfoController.addInfo
)

/*
 * PATCH: Edit info
 * Params: content
 * Allowed account types: admin
 */
infoRouter.patch(
    '/',
    authorize,
    validate(updatedInfoValidation),
    verifyAccountType(AccountTypes.admin),
    InfoController.editInfo
)
