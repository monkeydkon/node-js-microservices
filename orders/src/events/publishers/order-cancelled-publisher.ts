import { Publisher, OrderCancelledEvent, Subjects } from "@monkeydkon-ticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}