import express from 'express'
import { authorize } from '@middlewares/authorization'
import * as ClassroomController from '@controllers/classroom.controller'
import { validate } from '@middlewares/validation'
import {
    deleteClassroomValidation,
    newClassroomValidation,
    restoreClassroomValidation,
    updatedClassroomValidation
} from '@validations/classroom.validation'
import { verifyAccountType } from '@middlewares/accountTypeVerification'
import { AccountTypes } from '@libs/accountTypes'
import { classroomStatusVerification } from '@middlewares/classroomStatusVerification'

export const classroomRouter = express.Router()

/**
 * GET: List of all classrooms
 */
classroomRouter.get('/', authorize, ClassroomController.listClassrooms)

/**
 * POST: Add new classroom
 * Params: classroom, title, description, managedById (optional)
 * Allowed account types: admin
 */
classroomRouter.post(
    '/',
    authorize,
    verifyAccountType(AccountTypes.admin),
    validate(newClassroomValidation),
    ClassroomController.addClassroom
)

/**
 * PUT: Update classroom by ID
 * Params: id, classroom, title, description, managedById (optional)
 * Allowed account types: admin
 */
classroomRouter.put(
    '/',
    authorize,
    verifyAccountType(AccountTypes.admin),
    validate(updatedClassroomValidation),
    ClassroomController.updateClassroom
)

/**
 * DELETE: Delete classroom by ID
 * Param: id
 * Allowed account types: admin
 */
classroomRouter.delete(
    '/',
    authorize,
    validate(deleteClassroomValidation),
    verifyAccountType(AccountTypes.admin),
    ClassroomController.deleteClassroom
)

/**
 * PUT: Restore classroom by ID
 * Params: id
 * Allowed account types: admin
 */
classroomRouter.patch(
    '/',
    validate(restoreClassroomValidation),
    verifyAccountType(AccountTypes.admin),
    ClassroomController.restoreClassroom
)

/**
 * GET: List of all classrooms by statuses
 */
classroomRouter.get(
    '/status/:status',
    authorize,
    ClassroomController.listClassroomsByStatus
)

/**
 * PATCH: Change classroom status
 * Params: id (classroomId), status
 */
classroomRouter.patch(
    '/status',
    authorize,
    classroomStatusVerification,
    ClassroomController.changeClassroomStatus
)
