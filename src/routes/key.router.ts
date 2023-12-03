import express from 'express'
import { authorize } from '@middlewares/authorization'
import { verifyAccountType } from '@middlewares/accountTypeVerification'
import { AccountTypes } from '@libs/accountTypes'
import * as KeyController from '@controllers/key.controller'
import { validate } from '@middlewares/validation'
import { keyIdValidation } from '@validations/key.validaiton'

export const keyRouter = express.Router()

/**
 * GET: List of all keys
 * Allowed account types: admin
 */
keyRouter.get('/', authorize, verifyAccountType(AccountTypes.admin), KeyController.listKeys)

/**
 * POST: Generate a key
 * Allowed account types: admin
 */
keyRouter.post('/', authorize, verifyAccountType(AccountTypes.admin), KeyController.generateKey)

/**
 * PATCH: Extend key validity by 7 days
 * Params: id (keyId)
 * Allowed account types: admin
 */
keyRouter.patch(
    '/',
    authorize,
    validate(keyIdValidation),
    verifyAccountType(AccountTypes.admin),
    KeyController.extendKeyValidity
)

/**
 * GET: List of all unexpired keys
 * Allowed account types: admin
 */
keyRouter.get('/unexpired', authorize, verifyAccountType(AccountTypes.admin), KeyController.listUnexpiredKeys)

/**
 * DELETE: Deactivate the key
 * Params: id (keyId)
 * Allowed account types: admin
 */
keyRouter.delete(
    '/',
    authorize,
    validate(keyIdValidation),
    verifyAccountType(AccountTypes.admin),
    KeyController.deactivateKey
)

/**
 * POST: Regenerate the key
 * Params: id (keyId)
 * Allowed account types: admin
 */
keyRouter.post(
    '/regenerate',
    authorize,
    validate(keyIdValidation),
    verifyAccountType(AccountTypes.admin),
    KeyController.regenerateKey
)
