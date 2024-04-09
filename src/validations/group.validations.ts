import { body, CustomValidator, ValidationChain } from 'express-validator'
import * as GroupService from '@services/group.service'

const groupIdValidation: CustomValidator = async (id) => {
    if (!id) {
        return Promise.reject('ID grupy nie zostało podane')
    }

    if (typeof id === 'string') {
        return Promise.reject('Wprowadzono błędne ID grupy')
    }

    return GroupService.doesGroupExist(id).then((doesExist) => {
        if (!doesExist) {
            return Promise.reject('Podana grupa nie istnieje')
        }
    })
}

export const groupValidation: ValidationChain[] = [
    body('id').custom(groupIdValidation)
]
