import { Status } from './status.type'
import { ShortUser } from './auth.type'
import { ShortGroup } from '@customTypes/group.type'

export type NewClassroom = {
    openDayId: number
    classroom: string
    title: string
    description: string
    managedById: number | null
}

export type Classroom = {
    id: number
    openDayId: number
    classroom: string
    title: string
    description: string
    managedBy: ShortUser | null
    status: Status
    reservedAt: Date | null
    reservedBy: ShortGroup | null
    takenBy: ShortGroup | null
    takenAt: Date | null
}

export type ManagedClassroom = {
    id: number
    classroom: string
    title: string
    description: string
}

export type ShortClassroom = {
    id: number
    openDayId: number
    classroom: string
    title: string
    description: string
    status: Status
    reservedAt: Date | null
    takenAt: Date | null
}

export type ClassroomStatusEvent = {
    id: number
    userId: number
    status: string
    prevStatus: string
}

export type GroupVisitedClassroom = {
    groupId: number
    classroomId: number
    classroom: string
    title: string
}
