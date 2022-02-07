import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from '@monkeydkon-ticketing/common'
import { Order } from '../models/order'
import { stripe } from '../stripe'
import { Payment } from '../models/payment'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post('/api/payments', requireAuth, [
    body('token')
        .not()
        .isEmpty()
        .withMessage('token cannot be empty'),
    body('orderId')
        .not()
        .isEmpty()
        .withMessage('orderId cannot be empty')
], validateRequest, async (req: Request, res: Response) => {

    const { token, orderId } = req.body

    const order = await Order.findById(orderId)

    if (!order) {
        throw new NotFoundError()
    }

    if (order.userId !== req.currentUser?.id) {
        throw new NotAuthorizedError()
    }

    if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('order has been cancelled')
    }

    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token
    })

    const payment = Payment.build({
        orderId,
        stripeId: charge.id
    })

    await payment.save()

    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.id
    })

    res.status(201).send({ id: payment.id })
})

export { router as createChargeRouter }
