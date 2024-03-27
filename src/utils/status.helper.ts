import * as ClassroomService from '@services/classroom.service'
import { Classroom } from '@customTypes/classroom.type'
import { ClassroomStatusEnum } from '@libs/statuses'

export const setClassroomStatus = async (
    id: number,
    status: string,
    groupId: number
): Promise<void> => {
    const date: Date = new Date()
    const classroom: Classroom | null = await ClassroomService.getClassroom(id)

    switch (status) {
        case 'free':
            if (isClassroomBusyAndNotReserved(classroom)) {
                await ClassroomService.setFreeStatus(id)
                break
            }

            if (isClassroomBusyAndReservedByTheGroup(classroom, groupId)) {
                await ClassroomService.cancelReservation(id)
                break
            }

            if (isClassroomNotReservedAndNotBusy(classroom)) {
                await ClassroomService.setFreeStatus(id)
                break
            }

            if (isClassroomReserved(classroom)) {
                await ClassroomService.setFreeWhenReserved(id)
                break
            }

            break
        case 'busy':
            if (isClassroomReserved(classroom)) {
                await ClassroomService.setBusyClassroomWhenReserved(
                    id,
                    groupId,
                    date
                )

                break
            } else {
                await ClassroomService.setBusyStatus(id, groupId, date)
                break
            }
        case 'reserved':
            if (isClassroomBusy(classroom)) {
                await ClassroomService.setReservedStatusWhenBusy(
                    id,
                    groupId,
                    date
                )

                break
            } else {
                await ClassroomService.setReservedStatus(id, groupId, date)
                break
            }
    }
}

const isClassroomBusyAndNotReserved = (
    classroom: Classroom | null
): boolean => {
    return (
        classroom?.status.id === ClassroomStatusEnum.busy &&
        classroom?.reservedAt === null
    )
}
const isClassroomBusyAndReservedByTheGroup = (
    classroom: Classroom | null,
    groupId: number
): boolean => {
    return (
        classroom?.status.id === ClassroomStatusEnum.busy &&
        classroom.reservedBy?.id === groupId
    )
}

const isClassroomNotReservedAndNotBusy = (
    classroom: Classroom | null
): boolean => {
    return (
        classroom?.reservedAt !== null &&
        classroom?.status.id !== ClassroomStatusEnum.busy
    )
}

const isClassroomReserved = (classroom: Classroom | null): boolean => {
    return classroom?.reservedAt !== null
}

const isClassroomBusy = (classroom: Classroom | null): boolean => {
    return classroom?.takenAt !== null
}
