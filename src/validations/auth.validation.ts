import { body, CustomValidator, ValidationChain } from 'express-validator'
import * as AuthService from '@services/auth.service'
import * as KeyService from '@services/key.service'

const usernameValidation: CustomValidator = async (username) => {
    if (!username) {
        return Promise.reject('Podaj login')
    }
    return AuthService.isUsernameTaken(username).then((isTaken) => {
        if (isTaken) {
            return Promise.reject('Nazwa użytkownika jest już zajęta')
        }
    })
}

const keyValidation: CustomValidator = async (key) => {
    if (!key) {
        return Promise.reject('Podaj klucz dnia otwartego')
    }
    if (typeof key === 'string') {
        return Promise.reject('Wprowadzono błędny klucz')
    }
    return KeyService.isKeyValid(key).then((isValid) => {
        if (!isValid) {
            return Promise.reject('Wprowadzono błędny klucz')
        }
    })
}

const accountTypeValidation: CustomValidator = async (accountType) => {
    if (!accountType) {
        return Promise.reject('Podaj typ konta')
    }
    return AuthService.isValidAccountType(accountType).then((isValid) => {
        if (!isValid) {
            return Promise.reject('Wprowadzono błędny typ konta')
        }
    })
}

export const isValidUser: CustomValidator = async (id) => {
    if (!id) {
        return Promise.reject('Podaj id użytkownika')
    }
    if (typeof id === 'string') {
        return Promise.reject('Wprowadzono błędne ID użytkownika')
    }
    return AuthService.isValidIdUser(id).then((isValid) => {
        if (!isValid) {
            return Promise.reject('Podany użytkownik nie istnieje')
        }
    })
}

const loginDataValidation: CustomValidator = async (username) => {
    if (!username) {
        return Promise.reject('Podaj login')
    }

    return AuthService.doesUserExists(username).then((doesExists: boolean) => {
        if (!doesExists) {
            return Promise.reject('Podano błędny login lub hasło')
        }
    })
}

export const registerValidation: ValidationChain[] = [
    body('key').custom(keyValidation),
    body('username').custom(usernameValidation),
    body('password')
        .isString()
        .withMessage('Podaj hasło')
        .isLength({ min: 6 })
        .withMessage('Hasło za krótkie (min. 6 znaków)')
]

export const loginValidation: ValidationChain[] = [
    body('username').custom(loginDataValidation),
    body('password').isString().isLength({ min: 1 }).withMessage('Podaj hasło')
]

export const editUserValidation: ValidationChain[] = [
    body('id').custom(isValidUser),
    body('username').isString().withMessage('Podaj nazwę użytkownika'),
    body('accountType').custom(accountTypeValidation)
]

export const deleteUserValidation: ValidationChain[] = [
    body('id').custom(isValidUser)
]
export const restoreUserValidation: ValidationChain[] = [
    body('id').custom(isValidUser)
]

export const updateUserPersonalDataValidation: ValidationChain[] = [
    body('userId').custom(isValidUser),
    body('name')
        .isString()
        .isLength({ min: 5 })
        .withMessage('Podane dane są za krótkie')
]
