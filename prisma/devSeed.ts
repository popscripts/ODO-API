import { db } from '@utils/db.server'
import { NewUser } from '@customTypes/auth.type'
import { faker } from '@faker-js/faker'
import { NewClassroom } from '@customTypes/classroom.type'
import { hashPassword } from '@utils/auth.helper'
import { NewKey } from '@customTypes/key.types'

const devSeed = async () => {
    // Create random users
    await Promise.all(
        USERS.map(async (user: NewUser) => {
            const password = await hashPassword(user.password)
            return db.user.create({
                data: {
                    openDayId: user.openDayId,
                    username: user.username,
                    password: password,
                    accountTypeId: user.accountType
                }
            })
        })
    )

    // Create random classrooms
    await Promise.all(
        CLASSROOMS.map(async (newClassroom: NewClassroom) => {
            return db.classroom.create({
                data: {
                    openDayId: newClassroom.openDayId,
                    classroom: newClassroom.classroom,
                    title: newClassroom.title,
                    description: newClassroom.description,
                    managedById: newClassroom.managedById
                }
            })
        })
    )

    // Create admin account
    createAdminAccount().then((admin: NewUser) => {
        return db.user.create({
            data: {
                openDayId: admin.openDayId,
                username: admin.username,
                password: admin.password,
                accountTypeId: admin.accountType
            }
        })
    })

    // Create key
    return db.key.create({
        data: {
            openDayId: KEY.openDayId,
            key: KEY.key,
            expiresAt: KEY.expiresAt
        }
    })
}

const createRandomUser = (): NewUser => {
    return {
        openDayId: 1,
        accountType: faker.number.int({ min: 1, max: 4 }),
        username: faker.internet.userName(),
        password: faker.internet.password()
    }
}

const USERS: NewUser[] = faker.helpers.multiple(createRandomUser, {
    count: 5
})

const createRandomClassroom = (): NewClassroom => {
    return {
        openDayId: 1,
        classroom: faker.number.int({ min: 1, max: 305 }).toString(10),
        title: faker.lorem.slug({ min: 1, max: 4 }),
        description: faker.lorem.slug({ min: 15, max: 25 }),
        managedById: null
    }
}

const createAdminAccount = async (): Promise<NewUser> => {
    return { openDayId: 1, accountType: 1, username: 'admin', password: await hashPassword('haslo123') }
}

const KEY: NewKey = {
    openDayId: 1,
    key: 123456,
    expiresAt: faker.date.soon({ days: 14 })
}

const CLASSROOMS: NewClassroom[] = faker.helpers.multiple(createRandomClassroom, {
    count: 5
})

devSeed()
