import express, { Router } from 'express'
import * as GroupController from '@controllers/group.controller'
import { authorize } from '@middlewares/authorization'

export const groupRouter: Router = express.Router()

/**
 * GET: Get group by ID
 */
groupRouter.get('/:id', authorize, GroupController.getGroup)
