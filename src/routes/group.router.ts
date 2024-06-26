import express, { Router } from 'express'
import * as GroupController from '@controllers/group.controller'
import { authorize } from '@middlewares/authorization'
import {
    isUserMemberOfAnyOtherGroupVerification,
    isUserMemberOfGroupVerification
} from '@middlewares/groupMemberVerification'
import { validate } from '@middlewares/validation'
import { groupValidation } from '@validations/group.validations'
import { groupVisitedClassroomVerification } from '@middlewares/groupVisitedClassroomVerification'
import { checkNumberOfMembers } from '@middlewares/checkNumberOfMembers'

export const groupRouter: Router = express.Router()

/**
 * GET: Get groups
 */
groupRouter.get('/', authorize, GroupController.getGroups)

/**
 * POST: Add group
 * Optional params: groupSize (number), description (string), groupMembers (Member[])
 */
groupRouter.post(
    '/',
    authorize,
    isUserMemberOfAnyOtherGroupVerification,
    GroupController.addGroup
)

/**
 * PUT: Update group
 * Params: ID (groupId)
 * Optional params: groupSize (number), description (string), groupMembers (Member[])
 */
groupRouter.put(
    '/',
    authorize,
    validate(groupValidation),
    isUserMemberOfGroupVerification,
    isUserMemberOfAnyOtherGroupVerification,
    GroupController.updateGroup
)

/**
 * DELETE: Delete group
 * Params: ID (groupId)
 */
groupRouter.delete(
    '/',
    authorize,
    validate(groupValidation),
    isUserMemberOfGroupVerification,
    GroupController.deleteGroup
)

/**
 * POST: Get group visited classrooms
 * Params: ID (groupId)
 */
groupRouter.get(
    '/visited-classrooms/:id',
    authorize,
    GroupController.getGroupVisitedClassroom
)

/**
 * POST: Add a group visited classroom
 * Params: ID (groupId), classroomId, classroom (name), title
 */
groupRouter.post(
    '/visited-classrooms',
    authorize,
    validate(groupValidation),
    groupVisitedClassroomVerification,
    GroupController.addGroupVisitedClassroom
)

/**
 * POST: Delete a group visited classroom
 * Params: ID (groupId), classroomId
 */
groupRouter.delete(
    '/visited-classrooms',
    authorize,
    isUserMemberOfGroupVerification,
    GroupController.deleteGroupVisitedClassroom
)

/**
 * GET: Get a list of users for add group member select
 */
groupRouter.get('/members-list', authorize, GroupController.getMemberList)

/**
 * PUT: Leave the group during a tour
 * Params: id (groupId)
 */
groupRouter.put(
    '/leave',
    authorize,
    validate(groupValidation),
    isUserMemberOfGroupVerification,
    checkNumberOfMembers,
    GroupController.leaveGroup
)

/**
 * GET: Get a group by ID
 */
groupRouter.get('/:id', authorize, GroupController.getGroup)
