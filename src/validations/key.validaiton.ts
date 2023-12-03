import { body, CustomValidator } from 'express-validator'
import * as KeyService from '@services/key.service'

const customKeyIdValidation: CustomValidator = async (id) => {
    if (!id) {
        return Promise.reject('ID klucza nie zostało podane')
    }
    if (typeof id === 'string') {
        return Promise.reject('Wprowadzono błędne ID klucza')
    }
    return KeyService.doesKeyExist(id).then((doesExist) => {
        if (!doesExist) {
            return Promise.reject('Podany klucz nie istnieje')
        }
    })
}

export const keyIdValidation = [body('id').custom(customKeyIdValidation)]
