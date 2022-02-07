import { Publisher, OrderCreatedEvent, Subjects } from "@monkeydkon-ticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}