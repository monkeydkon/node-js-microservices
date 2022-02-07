import { app } from '../../app'
import request from 'supertest'
import mongoose from 'mongoose'
import { Order } from '../../models/order'
import { OrderStatus } from '@monkeydkon-ticketing/common'
import { stripe } from '../../stripe'
import {Payment} from '../../models/payment'

jest.mock('../../stripe')

it('should fail cause of 404', async () => {
    const cookie = global.signin()
    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            orderId: new mongoose.Types.ObjectId().toHexString(),
            token: 'dsadsa'
        })
        .expect(404)
})

it('fails cause of 401', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        status: OrderStatus.Created
    })
    await order.save()

    const cookie = global.signin()

    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            orderId: order.id,
            token: 'dsasad'
        })
        .expect(401)
})

it('fails cause of cancelled', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId,
        price: 10,
        status: OrderStatus.Cancelled
    })
    await order.save()

    const cookie = global.signin(userId)

    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            orderId: order.id,
            token: 'dsasad'
        })
        .expect(400)
})

it('succeeds with 201', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId,
        price: 10,
        status: OrderStatus.Created
    })
    await order.save()

    const cookie = global.signin(userId)

    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            orderId: order.id,
            token: 'tok_visa'
        })
        .expect(201)

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
    expect(chargeOptions.source).toEqual('tok_visa')
    expect(chargeOptions.amount).toEqual(10 * 100)
    expect(chargeOptions.currency).toEqual('usd')
    expect(stripe.charges.create).toHaveBeenCalled()

    const payment = await Payment.findOne({
        orderId: order.id
    })
   // expect(payment).not.toBeNull()
})