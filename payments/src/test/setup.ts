import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../app'
import jwt from 'jsonwebtoken'

declare global {
    var signin: (id?: string) => string[]
}

jest.mock('../nats-wrapper')

let mongo: any
beforeAll(async () => {
    process.env.JWT_KEY = 'asddsaasd'
    mongo = await MongoMemoryServer.create()
    const mongoUri = mongo.getUri()

    await mongoose.connect(mongoUri)
})

beforeEach(async () => {
    jest.clearAllMocks()
    const collections = await mongoose.connection.db.collections()

    for (let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    await mongo.stop()
    await mongoose.connection.close()
})



global.signin = (id?: string) => {
    // build a JWT payload/ {id, email}
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    // create the jwt
    const token = jwt.sign(payload, process.env.JWT_KEY!)

    // build session object {jwt: MY_JWT}
    const session = {
        jwt: token
    }

    // turn that session into JSON
    const sessionJSON = JSON.stringify(session)

    // take JSON and encode as base64
    const base64 = Buffer.from(sessionJSON).toString('base64')

    // return a astring thats the cookee
    return [`session=${base64}`]
}

