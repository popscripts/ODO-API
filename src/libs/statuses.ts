export const statuses: Record<string, any> = {
    free: 1,
    busy: 2,
    reserved: 3,
    ordered: 4,
    inProgress: 5,
    done: 6,
    pickedUp: 7,
    cancelled: 8
}

export enum ClassroomStatusEnum {
    free = 1,
    busy = 2,
    reserved = 3
}

export enum OrderStatusEnum {
    ordered = 4,
    inProgress = 5,
    done = 6,
    pickedUp = 7,
    cancelled = 8
}

export const OrderStatusRecord: Record<string, any> = {
    ordered: 4,
    inProgress: 5,
    done: 6,
    pickedUp: 7,
    cancelled: 8
}
