import { Classroom, ShortClassroom } from '@customTypes/classroom.type'
import { getClassroom } from '@services/classroom.service'
import { Group } from '@customTypes/group.type'
import { getGroupByMemberId } from '@services/group.service'
import { ClassroomStatusEnum } from '@libs/classroomStatusEnum'

export const socketClassroomStatusVerification = async (
    classroomId: number,
    status: string,
    userId: number,
    accountType: string
): Promise<boolean> => {
    const classroom: Classroom | null = await getClassroom(classroomId)
    const group: Group | null = await getGroupByMemberId(userId)
    const classroomStatus: number | undefined = classroom?.status.id
    const groupTaken: ShortClassroom | null | undefined = group?.Taken
    const groupReserved: ShortClassroom | null | undefined = group?.Reserved

    if (
        isAdmin(accountType) ||
        isClassroomManager(classroom?.managedBy?.id, userId)
    ) {
        return true
    }

    switch (status) {
        case ClassroomStatusEnum[ClassroomStatusEnum.free]:
            if (isAlreadyFree(classroomStatus)) {
                return true
            }

            if (isClassroomTakenByGroup(classroomId, groupTaken?.id)) {
                return true
            }

            if (
                isClassroomReservedByGroupAndNotBusy(
                    classroomId,
                    group?.Reserved?.id,
                    classroomStatus
                )
            ) {
                return true
            }

            return isClassroomReservedByGroup(classroomId, groupReserved?.id)
        case ClassroomStatusEnum[ClassroomStatusEnum.busy]:
            if (
                isAlreadyFreeAndNoClassroomIsTakenByGroup(
                    classroomStatus,
                    groupTaken
                )
            ) {
                return true
            }

            return (
                isClassroomReservedByGroupAndNotBusy(
                    classroomId,
                    groupReserved?.id,
                    classroomStatus
                ) && doesGroupHasNoOccupiedClassrooms(groupTaken)
            )
        case ClassroomStatusEnum[ClassroomStatusEnum.reserved]:
            if (
                isAlreadyFreeAndNoClassroomIsTakenByGroup(
                    classroomStatus,
                    groupTaken
                )
            ) {
                return true
            }

            return (
                isNotReservedAndNotBusy(classroomStatus) &&
                doesGroupHasNoReservations(groupReserved)
            )

        default:
            return false
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

const isNotReservedAndNotBusy = (status: number | undefined): boolean => {
    return status !== (ClassroomStatusEnum.reserved && ClassroomStatusEnum.busy)
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
