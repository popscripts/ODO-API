import { UploadedFile } from 'express-fileupload'
import crypto from 'crypto'
import path from 'path'
import * as AuthService from '@services/auth.service'
import fs from 'fs'
import { PictureName } from '@customTypes/auth.type'

export const upload = async (picture: UploadedFile, id: number) => {
    await removeOldPhoto(id)
    const extension: string = getExtension(picture)
    const pictureName: string = generatePictureName(8, extension)
    await saveProfilePicture(picture, pictureName)
    await AuthService.saveProfilePictureToDatabase(id, pictureName)
}

const saveProfilePicture = async (picture: UploadedFile, pictureName: string) => {
    await picture!.mv('./uploads/' + pictureName)
}
const generatePictureName = (byteSize: number, extension: string): string => {
    return crypto.randomBytes(byteSize).toString('hex') + extension
}

const getExtension = (picture: UploadedFile): string => {
    return '.' + path.extname(picture.name).substring(1)
}

const removeOldPhoto = async (id: number) => {
    const pictureName: PictureName | null = await AuthService.getProfilePictureName(id)
    if (pictureName?.pictureName !== null) {
        fs.unlinkSync('./uploads/' + pictureName!.pictureName!)
    }
}
