import request from 'supertest'

import app from '../../src/app'
import { register } from '@libs/callbacks'

describe('Auth routes', () => {
    test('Should register the user', async () => {
        const registerData = {
            openDayId: 1,
            username: 'test',
            password: 'password123',
            key: 123456
        }

        const res = await request(app)
            .post('/api/auth/register')
            .send(registerData)

        expect(res.body).toEqual(register)
    })
})
