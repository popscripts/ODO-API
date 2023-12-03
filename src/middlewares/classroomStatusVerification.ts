import { Request, Response, NextFunction } from 'express'
import * as AuthHelper from '@utils/auth.helper'
import { Classroom } from '@customTypes/classroom.type'
import { getClassroom } from '@services/classroom.service'
import * as Error from '../libs/errors'
import { Token } from '@customTypes/auth.type'
import { getGroupByMemberId } from '@services/group.service'
import { Group } from '@customTypes/group.type'

export const classroomStatusVerification = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const classroomId = request.body.id
    const { status } = request.body
    const token = request.cookies.JWT
    const { id, accountType }: Token = AuthHelper.verifyToken(
        token,
        'accessToken'
    )
    const classroom: Classroom | null = await getClassroom(classroomId)
    let verified: boolean = false

    const group: Group | null = await getGroupByMemberId(id)

    // Check if classroom is already free and request status is free
    if (classroom?.status.name === 'free' && status === 'free') {
        return response.status(500).json(Error.classroomAlreadyFree)
    }

    // Check if user is an admin
    if (accountType.name === 'admin') {
        verified = true
    }

    // Check if classroom is free and no classroom is taken by him
    if (classroom?.status.name === 'free' && group?.Taken !== null) {
        verified = true
    }

    // Check if classroom isn't reserved and request status is "reserved"
    if (classroom?.status.name !== 'reserved' && status === 'reserved') {
        verified = true
    }

    // Check if user is a manager of the classroom
    if (
        accountType.name === 'classroomManager' &&
        classroom?.managedBy?.id === id
    ) {
        verified = true
    }

    // Check if classroom is taken by group
    if (classroomId === group?.Taken?.id) {
        verified = true
    }

    // Check if classroom is reserved by user and classroom isn't busy
    if (
        group?.Reserved?.id === classroomId &&
        classroom?.status.name !== 'busy'
    ) {
        verified = true
    }

    // Check if classroom is reserved by user and request status is "free"
    if (group?.Reserved?.id === classroomId && status === 'free') {
        verified = true
    }

    if (verified) {
        next()
    } else {
        return response.status(500).json(Error.responseError)
    }
}
