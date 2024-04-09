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
            if (
                isClassroomJustBusy(classroom) ||
                isClassroomJustReserved(classroom)
            ) {
                await ClassroomService.setFreeStatus(classroom.id)
                break
            }

            if (
                isClassroomTakenByMyGroupAndReservedByOtherGroup(
                    classroom,
                    group
                )
            ) {
                await ClassroomService.setFreeWhenReserved(classroom.id)
                break
            }

            if (
                isClassroomTakenByOtherGroupAndReservedByMyGroup(
                    classroom,
                    group
                )
            ) {
                await ClassroomService.cancelReservation(classroom.id)
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

const isClassroomReserved = (classroom: ShortClassroom | null): boolean => {
    return classroom?.reservedAt !== null
}

const isClassroomBusy = (classroom: ShortClassroom | null): boolean => {
    return classroom?.takenAt !== null
}

const isClassroomJustBusy = (classroom: ShortClassroom | null) => {
    return (
        classroom?.status.id === ClassroomStatusEnum.busy &&
        classroom.reservedAt === null
    )
}

const isClassroomJustReserved = (classroom: ShortClassroom | null) => {
    return (
        classroom?.status.id === ClassroomStatusEnum.reserved &&
        classroom.takenAt === null
    )
}

const isClassroomTakenByOtherGroupAndReservedByMyGroup = (
    classroom: ShortClassroom,
    group: Group
): boolean => {
    return classroom.takenAt !== null && classroom.id === group.Reserved?.id
}

const isClassroomTakenByMyGroupAndReservedByOtherGroup = (
    classroom: ShortClassroom,
    group: Group
): boolean => {
    return classroom.reservedAt !== null && classroom.id === group.Taken?.id
}
