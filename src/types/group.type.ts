import { ShortClassroom } from '@customTypes/classroom.type'
import { ShortUser } from '@customTypes/auth.type'

export type Group = {
    id: number
    openDayId: number
    groupSize: number | null
    GroupMembers: ShortUser[] | null
    description: string | null
    Reserved: ShortClassroom | null
    Taken: ShortClassroom | null
    GroupVisitedClassrooms: GroupVisitedClassroom[] | null
}

export type ShortGroup = {
    id: number
    GroupMembers: ShortUser[] | null
    groupSize: number | null
    description: string | null
}

export type GroupVisitedClassroom = {
    id: number
    groupId: number
    classroomId: number
}

export type Member = {
    id: number
    name: string | null
}
