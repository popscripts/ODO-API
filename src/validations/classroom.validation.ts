import { body, CustomValidator } from 'express-validator'
import * as ClassroomService from '@services/classroom.service'

const classroomIdValidation: CustomValidator = async (id) => {
    if (!id) {
        return Promise.reject('ID klasy nie zostało podane')
    }
    if (typeof id === 'string') {
        return Promise.reject('Wprowadzono błędne ID klasy')
    }
    return ClassroomService.doesClassroomExist(id).then((doesExist) => {
        if (!doesExist) {
            return Promise.reject('Podana klasa nie istnieje')
        }
    })
}

export const newClassroomValidation = [
    body('classroom')
        .isString()
        .withMessage('Podaj nazwę klasy')
        .isLength({ min: 0 })
        .withMessage('Podaj nazwę klasy'),
    body('title')
        .isString()
        .withMessage('Podaj tytuł klasy')
        .isLength({ min: 1 })
        .withMessage('Podaj tytuł klasy'),
    body('description')
        .isString()
        .withMessage('Podaj opis klasy')
        .isLength({ min: 1 })
        .withMessage('Podaj opis klasy')
]

export const updatedClassroomValidation = [
    body('id').custom(classroomIdValidation),
    body('classroom')
        .isString()
        .withMessage('Podaj nazwę klasy')
        .isLength({ min: 0 })
        .withMessage('Podaj nazwę klasy'),
    body('title')
        .isString()
        .withMessage('Podaj tytuł klasy')
        .isLength({ min: 1 })
        .withMessage('Podaj tytuł klasy'),
    body('description')
        .isString()
        .withMessage('Podaj opis klasy')
        .isLength({ min: 1 })
        .withMessage('Podaj opis klasy')
]

export const deleteClassroomValidation = [body('id').custom(classroomIdValidation)]

export const restoreClassroomValidation = [body('id').custom(classroomIdValidation)]
