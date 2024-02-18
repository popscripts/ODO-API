import express, { Router } from 'express'
import * as GroupController from '@controllers/group.controller'
import { authorize } from '@middlewares/authorization'
import { isUserMemberOfGroupVerification } from '@middlewares/groupMemberVerification'
import { validate } from '@middlewares/validation'
import { groupValidation } from '@validations/group.validations'

export const groupRouter: Router = express.Router()

/**
 * GET: Get groups
 */
groupRouter.get('/', authorize, GroupController.getGroups)

/**
 * GET: Get group by ID
 */
groupRouter.get('/:id', authorize, GroupController.getGroup)

/**
 * POST: Add group
 * Optional params: groupSize (number), description (string), groupMembers (ShortUser[])
 */
groupRouter.post('/', authorize, GroupController.addGroup)

/**
 * PUT: Update group
 * Params: ID (groupId)
 * Optional params: groupSize (number), description (string), groupMembers (ShortUser[])
 */
groupRouter.put(
    '/',
    authorize,
    isUserMemberOfGroupVerification,
    validate(groupValidation),
    GroupController.updateGroup
)
/**
 * DELETE: Delete group
 * Params: ID (groupId)
 */
groupRouter.delete(
    '/',
    authorize,
    isUserMemberOfGroupVerification,
    validate(groupValidation),
    GroupController.deleteGroup
)
