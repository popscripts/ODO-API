export type JsonResponse = {
    result: string
    error: number
    param?: string
}

export const registerError: JsonResponse = {
    result: 'Wystąpił błąd podczas rejestracji',
    error: 1
}

export const wrongPassword: JsonResponse = {
    result: 'Podano błędny login lub hasło',
    error: 1,
    param: 'username'
}

export const loginError: JsonResponse = {
    result: 'Wystąpił błąd poczas logowania',
    error: 1
}

export const authorizationError: JsonResponse = {
    result: 'Nie zalogowano',
    error: 1
}

export const responseError: JsonResponse = {
    result: 'Wystąpił błąd',
    error: 1
}

export const permissionError: JsonResponse = {
    result: 'Brak uprawnień',
    error: 1
}

export const updateProfilePictureError: JsonResponse = {
    result: 'Wystąpił błąd podczas aktualizacji zdjęcia',
    error: 1
}

export const loadProfilePictureError: JsonResponse = {
    result: 'Wystąpił błąd podczas wczytywania zdjęcia',
    error: 1
}

export const deactivateKeyError: JsonResponse = {
    result: 'Wystąpił błąd podczas deaktywacji klucza',
    error: 1
}

export const regenerateKeyError: JsonResponse = {
    result: 'Wystąpił błąd podczas odnowienia klucza',
    error: 1
}

export const updatePersonalDataError: JsonResponse = {
    result: 'Wystąpił błąd podczas zapisywania danych personalnych',
    error: 1
}

export const registerUserSocketError: JsonResponse = {
    result: 'Wystąpił błąd podczas rejestracji Socketu',
    error: 1
}

export const changeClassroomStatusError: JsonResponse = {
    result: 'Wystąpił błąd podczas zmiany statusu klasy',
    error: 1
}

export const getGroupsError: JsonResponse = {
    result: 'Wystąpił błąd podczas pobierania grup',
    error: 1
}

export const getGroupError: JsonResponse = {
    result: 'Wystąpił błąd podczas pobierania danych o grupie',
    error: 1
}

export const addGroupError: JsonResponse = {
    result: 'Wystąpił błąd podczas dodawania grupy',
    error: 1
}

export const updateGroupError: JsonResponse = {
    result: 'Wystąpił błąd podczas edycji grupy',
    error: 1
}

export const deleteGroupError: JsonResponse = {
    result: 'Wystąpił błąd podczas usuwania grupy',
    error: 1
}

export const orderStatusVerificationError: JsonResponse = {
    result: 'Nie można zmienić statusu tego zamówienia',
    error: 1
}

export const userIsNotAMemberOfGroupError: JsonResponse = {
    result: 'Użytkownik nie należy do podanej grupy',
    error: 1
}

export const addGroupVisitedClassroomError: JsonResponse = {
    result: 'Wystąpił błąd podczas oznaczonia klasy jako odwiedzonej',
    error: 1
}

export const getGroupVisitedClassroomsError: JsonResponse = {
    result: 'Wystąpił błąd podczas pobierania odwiedzonych klas',
    error: 0
}

export const groupClassroomAlreadyVisitedError: JsonResponse = {
    result: 'Klasa została już odwiedzona przez grupę',
    error: 1
}

export const deleteGroupVisitedClassroomError: JsonResponse = {
    result: 'Wystąpił błąd podczas usuwania klasy z odwiedzonych',
    error: 0
}

export const userIsAMemberOfOtherGroupError: JsonResponse = {
    result: 'Co najmniej jeden z użytkowników należy już do innej grupy',
    error: 1
}

export const getMembersListError: JsonResponse = {
    result: 'Wystąpił błąd podczas pobierania danych',
    error: 1
}
