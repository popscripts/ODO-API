import express from 'express'
import { validate } from '@middlewares/validation'
import {
    deleteUserValidation,
    editUserValidation,
    loginValidation,
    registerValidation,
    restoreUserValidation,
    updateUserPersonalDataValidation
} from '@validations/auth.validation'
import * as AuthController from '@controllers/auth.controller'
import { authorize } from '@middlewares/authorization'
import { verifyAccountType } from '@middlewares/accountTypeVerification'
import { AccountTypes } from '@libs/accountTypes'

export const authRouter = express.Router()

/**
 * POST: User registration
 * Params: key, username, password
 */
authRouter.post(
    '/register',
    validate(registerValidation),
    AuthController.register
)

/**
 * POST: User login
 * Params: username, password
 */
authRouter.post('/login', validate(loginValidation), AuthController.login)

/**
 * GET: Logout
 */
authRouter.get('/logout', AuthController.logout)

/**
 * GET: User data
 */
authRouter.get('/user', authorize, AuthController.user)

/**
 * GET: JWT data
 */
authRouter.get('/jwt', authorize, AuthController.jwt)

/**
 * GET: List of all users
 * Allowed account types: admin
 */
authRouter.get(
    '/users',
    authorize,
    verifyAccountType(AccountTypes.admin),
    AuthController.users
)

/**
 * PUT: Update user
 * Params: id, username, accountType
 * Allowed account types: admin
 */
authRouter.put(
    '/',
    authorize,
    verifyAccountType(AccountTypes.admin),
    validate(editUserValidation),
    AuthController.editUser
)

/**
 * DELETE: Delete user
 * Params: id
 * Allowed account types: admin
 */
authRouter.delete(
    '/',
    authorize,
    verifyAccountType(AccountTypes.admin),
    validate(deleteUserValidation),
    AuthController.deleteUser
)

/**
 * PATCH: Restore user
 * Params: id
 * Allowed account types: admin
 */
authRouter.patch(
    '/',
    authorize,
    verifyAccountType(AccountTypes.admin),
    validate(restoreUserValidation),
    AuthController.restoreUser
)

/*
 * GET: List of all users by active status
 * Param: status
 * Allowed account types: admin
 */
authRouter.get(
    '/users/:status',
    authorize,
    verifyAccountType(AccountTypes.admin),
    AuthController.usersByStatus
)

/*
 * POST: Update profile picture
 * File: picture
 */
authRouter.post('/picture', authorize, AuthController.updateProfilePicture)

/**
 * GET: Get profile picture by ID
 */
authRouter.get('/picture/:id', AuthController.getPicture)

/**
 * POST: Update user personal data
 * Param: userId, name
 */
authRouter.post(
    '/user/personal',
    authorize,
    validate(updateUserPersonalDataValidation),
    AuthController.updatePersonalData
)
