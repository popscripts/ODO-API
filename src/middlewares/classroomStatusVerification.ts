import { Request, Response, NextFunction } from 'express'
import { Classroom, ShortClassroom } from '@customTypes/classroom.type'
import { getClassroom } from '@services/classroom.service'
import { User } from '@customTypes/auth.type'
import { Group } from '@customTypes/group.type'
import { ClassroomStatusEnum } from '@libs/statuses'
import { getUser } from '@services/auth.service'
import {
    classroomIsNotReservedByGroup,
    classroomStatusVerificationType,
    notVerifiedStatusResponse,
    userIsNotAMemberOfAnyGroupResponse,
    verifiedStatusResponse
} from '@libs/classroomStatusVerificationResponses'

export const classroomStatusVerification = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const classroomId = request.body.id
    const status = request.body.status

    const classroomStatusVerification: classroomStatusVerificationType =
        await isClassroomStatusVerified(
            classroomId,
            status,
            request.user.id,
            request.user.accountType.name
        )

    if (classroomStatusVerification.verified) {
        next()
    } else {
        response.status(406).json({
            result: classroomStatusVerification.result,
            error: 1
        })
    }
}

const isClassroomStatusVerified = async (
    classroomId: number,
    status: string,
    userId: number,
    accountType: string
): Promise<classroomStatusVerificationType> => {
    const classroom: Classroom | null = await getClassroom(classroomId)
    const user: User | null = await getUser(userId)
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

            if (isClassroomTakenByGroup(classroomId, groupTaken?.id)) {
                return verifiedStatusResponse
            }

            if (
                isClassroomReservedByGroupAndNotBusy(
                    classroomId,
                    group?.Reserved?.id,
                    classroomStatus
                )
            ) {
                return verifiedStatusResponse
            }

            if (isClassroomReservedByGroup(classroomId, groupReserved?.id)) {
                return verifiedStatusResponse
            } else {
                return classroomIsNotReservedByGroup
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
                    classroomId,
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
