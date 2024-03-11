export type classroomStatusVerificationType = {
    result: string
    verified: boolean
}

export const verifiedStatusResponse: classroomStatusVerificationType = {
    result: 'Zgoda',
    verified: true
}

export const userIsNotAMemberOfAnyGroupResponse: classroomStatusVerificationType =
    {
        result: 'Użytkownik nie należy do żadnej grupy',
        verified: false
    }

export const classroomIsNotReservedByGroup: classroomStatusVerificationType = {
    result: 'Klasa nie jest zarezerowana przez Twoją grupę',
    verified: false
}

export const notVerifiedStatusResponse: classroomStatusVerificationType = {
    result: 'Zmiana statusu klasy jest niemożliwa',
    verified: false
}
