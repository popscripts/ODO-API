import { Request, Response, NextFunction } from 'express'
import { Classroom, ShortClassroom } from '@customTypes/classroom.type'
import { getClassroom } from '@services/classroom.service'
import { User } from '@customTypes/auth.type'
import { Group } from '@customTypes/group.type'
import { ClassroomStatusEnum } from '@libs/statuses'
import { getUser } from '@services/auth.service'
import {
    classroomIsNeitherTakenOrReservedByGroup,
    classroomStatusVerificationType,
    notVerifiedStatusResponse,
    userIsNotAMemberOfAnyGroupResponse,
    verifiedStatusResponse
} from '@libs/classroomStatusVerificationResponses'
import { classroomNotFoundError } from '@libs/errors'

export const classroomStatusVerification = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const status = request.body.status
    const classroom: Classroom | null = await getClassroom(request.body.id)
    const user: User | null = await getUser(request.user.id)

    if (!classroom) {
        response.status(404).json(classroomNotFoundError)
        return
    }

    const classroomStatusVerification: classroomStatusVerificationType =
        await isClassroomStatusVerified(
            classroom,
            user!,
            status,
            request.user.id,
            request.user.accountType.name
        )

    if (classroomStatusVerification.verified) {
        request.body.classroom = classroom as Classroom
        request.body.group = user?.Group as Group
        next()
    } else {
        response.status(406).json({
            result: classroomStatusVerification.result,
            error: 1
        })
    }
}

const isClassroomStatusVerified = async (
    classroom: Classroom,
    user: User,
    status: string,
    userId: number,
    accountType: string
): Promise<classroomStatusVerificationType> => {
    const group: Group | null | undefined = user?.Group
    const classroomStatus: number | undefined = classroom?.status.id
    const groupTaken: ShortClassroom | null | undefined = group?.Taken
    const groupReserved: ShortClassroom | null | undefined = group?.Reserved

    if (!group) {
        return userIsNotAMemberOfAnyGroupResponse
    }

    if (
        isAdmin(accountType) ||
        isClassroomManager(classroom?.managedBy?.id, userId)
    ) {
        return verifiedStatusResponse
    }

    switch (status) {
        case ClassroomStatusEnum[ClassroomStatusEnum.free]:
            if (isAlreadyFree(classroomStatus)) {
                return verifiedStatusResponse
            }

            if (isClassroomTakenByGroup(classroom.id, groupTaken?.id)) {
                return verifiedStatusResponse
            }

            if (isClassroomReservedByGroup(classroom.id, groupReserved?.id)) {
                return verifiedStatusResponse
            } else {
                return classroomIsNeitherTakenOrReservedByGroup
            }
        case ClassroomStatusEnum[ClassroomStatusEnum.busy]:
            if (
                isAlreadyFreeAndNoClassroomIsTakenByGroup(
                    classroomStatus,
                    groupTaken
                )
            ) {
                return verifiedStatusResponse
            }

            if (
                isClassroomReservedByGroupAndNotBusy(
                    classroom.id,
                    groupReserved?.id,
                    classroomStatus
                ) &&
                doesGroupHasNoOccupiedClassrooms(groupTaken)
            ) {
                return verifiedStatusResponse
            } else {
                return notVerifiedStatusResponse
            }
        case ClassroomStatusEnum[ClassroomStatusEnum.reserved]:
            if (isAlreadyFree(classroomStatus)) {
                return verifiedStatusResponse
            }

            if (!isClassroomReservedByOtherGroup(classroom)) {
                return verifiedStatusResponse
            }

            if (
                isNotReserved(classroomStatus) &&
                doesGroupHasNoReservations(groupReserved)
            ) {
                return verifiedStatusResponse
            } else {
                return notVerifiedStatusResponse
            }

        default:
            return notVerifiedStatusResponse
    }
}

const isAlreadyFree = (classroomStatus: number | undefined): boolean => {
    return classroomStatus === ClassroomStatusEnum.free
}

const isAdmin = (accountType: string): boolean => {
    return accountType === 'admin'
}

const isClassroomManager = (
    classroomManagerId: number | undefined,
    userId: number
): boolean => {
    return classroomManagerId === userId
}

const isAlreadyFreeAndNoClassroomIsTakenByGroup = (
    classroomStatus: number | undefined,
    groupTaken: ShortClassroom | null | undefined
): boolean => {
    return classroomStatus === ClassroomStatusEnum.free && groupTaken === null
}

const isNotReserved = (status: number | undefined): boolean => {
    return status !== ClassroomStatusEnum.reserved
}

const isClassroomTakenByGroup = (
    classroomId: number,
    takenClassroomId: number | undefined
): boolean => {
    return classroomId === takenClassroomId
}

const isClassroomReservedByGroup = (
    classroomId: number,
    reservedClassroomId: number | undefined
): boolean => {
    return classroomId === reservedClassroomId
}

const isClassroomReservedByGroupAndNotBusy = (
    classroomId: number,
    reservedClassroomId: number | undefined,
    classroomStatus: number | undefined
): boolean => {
    return (
        classroomId === reservedClassroomId &&
        classroomStatus !== ClassroomStatusEnum.busy
    )
}

const doesGroupHasNoOccupiedClassrooms = (
    groupTaken: ShortClassroom | undefined | null
): boolean => {
    return groupTaken === null
}

const doesGroupHasNoReservations = (
    groupReserved: ShortClassroom | undefined | null
): boolean => {
    return groupReserved === null
}

const isClassroomReservedByOtherGroup = (
    classroom: Classroom | null
): boolean => {
    return !!classroom?.reservedBy
}
