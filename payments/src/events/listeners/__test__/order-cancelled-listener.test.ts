import { OrderCancelledEvent, OrderStatus } from "@monkeydkon-ticketing/common"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import mongoose from 'mongoose'
import { Order } from "../../../models/order"
import { Message } from "node-nats-streaming"

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)

    const data: OrderCancelledEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 1,
        ticket: {
            id: 'asd'
        }
    }

    const order = await Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        userId: 'dsada',
        version: 0
    })
    await order.save()

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, order }
}

it('cancels the order', async () => {
    const { listener, data, msg, order } = await setup()

    await listener.onMessage(data, msg)

    const cancelledOrder = await Order.findById(order.id)
    expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('acks', async () => {
    const { listener, data, msg, order } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})