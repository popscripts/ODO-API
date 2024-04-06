import * as ClassroomService from '@services/classroom.service'
import { ShortClassroom } from '@customTypes/classroom.type'
import { ClassroomStatusEnum } from '@libs/statuses'
import { Group } from '@customTypes/group.type'

export const setClassroomStatus = async (
    classroom: ShortClassroom,
    status: number,
    group: Group
): Promise<void> => {
    const date: Date = new Date()

    switch (status) {
        case ClassroomStatusEnum.free:
            if (isClassroomBusyAndNotReserved(classroom)) {
                await ClassroomService.setFreeStatus(classroom.id)
                break
            }

            if (isClassroomReserved(classroom)) {
                await ClassroomService.setFreeWhenReserved(classroom.id)
                break
            }

            if (isClassroomBusyAndReservedByTheGroup(classroom, group)) {
                await ClassroomService.cancelReservation(classroom.id)
                break
            }

            if (isClassroomNotReservedAndNotBusy(classroom)) {
                await ClassroomService.setFreeStatus(classroom.id)
                break
            }

            break
        case ClassroomStatusEnum.busy:
            if (isClassroomReserved(classroom)) {
                await ClassroomService.setBusyClassroomWhenReserved(
                    classroom.id,
                    group.id,
                    date
                )

                break
            } else {
                await ClassroomService.setBusyStatus(
                    classroom.id,
                    group.id,
                    date
                )

                break
            }
        case ClassroomStatusEnum.reserved:
            if (isClassroomBusy(classroom)) {
                await ClassroomService.setReservedStatusWhenBusy(
                    classroom.id,
                    group.id,
                    date
                )

                break
            } else {
                await ClassroomService.setReservedStatus(
                    classroom.id,
                    group.id,
                    date
                )

                break
            }
    }
}

const isClassroomBusyAndNotReserved = (
    classroom: ShortClassroom | null
): boolean => {
    return (
        classroom?.status.id === ClassroomStatusEnum.busy &&
        classroom?.reservedAt === null
    )
}
const isClassroomBusyAndReservedByTheGroup = (
    classroom: ShortClassroom | null,
    group: Group
): boolean => {
    return (
        classroom?.status.id === ClassroomStatusEnum.busy &&
        classroom?.id === group.Reserved?.id
    )
}

const isClassroomNotReservedAndNotBusy = (
    classroom: ShortClassroom | null
): boolean => {
    return (
        classroom?.reservedAt !== null &&
        classroom?.status.id !== ClassroomStatusEnum.busy
    )
}

const isClassroomReserved = (classroom: ShortClassroom | null): boolean => {
    return classroom?.reservedAt !== null
}

const isClassroomBusy = (classroom: ShortClassroom | null): boolean => {
    return classroom?.takenAt !== null
}
