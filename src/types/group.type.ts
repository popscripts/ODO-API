import { ShortClassroom } from '@customTypes/classroom.type'
import { ShortUser } from '@customTypes/auth.type'

export type Group = {
    id: number
    groupSize: number | null
    GroupMembers: ShortUser[] | null
    description: string | null
    Reserved: ShortClassroom | null
    Taken: ShortClassroom | null
}

export type ShortGroup = {
    id: number
    GroupMembers: ShortUser[] | null
    groupSize: number | null
    description: string | null
}
