import express, { Router } from 'express'
import { getDynamicMembers } from '@controllers/dynamicContent.controller'

export const dynamicContentRouter: Router = express.Router()

/**
 * GET: Get dynamic list of members by their name
 * Param: value [Model: User - name (string)]
 * @return Member[]
 */
dynamicContentRouter.get('/members/:value', getDynamicMembers)
