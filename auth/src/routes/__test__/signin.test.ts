import request from 'supertest'
import { app } from '../../app'

it('returns a 400 with an invalid email', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: "test",
            password: 'password'
        })
        .expect(400)
})

it('returns a 400 with missing email and password', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com'
        })
        .expect(400)

    await request(app)
        .post('/api/users/signin')
        .send({
            password: 'password'
        })
        .expect(400)
})

it('it fails when a email that does not exist is supplier', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password`'
        })
})

it('it fails when an incorrect password is supplier', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'passwordWRONG'
        })
        .expect(400)
})

it('responds with a cookie when given valid credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined()
})