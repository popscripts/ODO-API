import { Status } from '../src/types/status.type'
import { db } from '../src/utils/db.server'
import { AccountType } from '../src/types/auth.type'
import { Dish } from '../src/types/buffet.type'

export const seed = async () => {
    try {
        console.log('Seeding DB...')
        await Promise.all(
            getStatuses().map((status: Status) => {
                return db.status.create({
                    data: {
                        id: status.id,
                        name: status.name
                    }
                })
            })
        )
    } catch (error: any) {
        console.error(error)
        console.error('An error occurred during creating statuses')
    }

    try {
        await Promise.all(
            getAccountTypes().map((accountType: AccountType) => {
                return db.accountType.create({
                    data: {
                        id: accountType.id,
                        name: accountType.name
                    }
                })
            })
        )
    } catch (error: any) {
        console.error(error)
        console.error('An error occurred during creating account types')
    }

    try {
        await Promise.all(
            getDishes().map((dish: Dish) => {
                return db.dish.create({
                    data: {
                        id: dish.id,
                        name: dish.name,
                        cheese: dish.cheese,
                        ham: dish.ham
                    }
                })
            })
        )
    } catch (error: any) {
        console.error(error)
        console.error('An error occurred during creating dishes')
    }
}

const getStatuses = (): Array<Status> => {
    return [
        { id: 1, name: 'free' },
        { id: 2, name: 'busy' },
        { id: 3, name: 'reserved' },
        { id: 4, name: 'ordered' },
        { id: 5, name: 'inProgress' },
        { id: 6, name: 'done' },
        { id: 7, name: 'pickedUp' },
        { id: 8, name: 'cancelled' }
    ]
}

const getAccountTypes = (): Array<AccountType> => {
    return [
        { id: 1, name: 'admin' },
        { id: 2, name: 'user' },
        { id: 3, name: 'cook' },
        { id: 4, name: 'classroomManager' },
        { id: 5, name: 'temp' }
    ]
}

const getDishes = (): Array<Dish> => {
    return [
        { id: 1, name: 'toastWithCheese', ham: false, cheese: true },
        { id: 2, name: 'toastWithHam', ham: true, cheese: false },
        { id: 3, name: 'toastWithCheeseAndHam', ham: true, cheese: true }
    ]
}
