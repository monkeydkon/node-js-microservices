import { Publisher, Subjects, TicketUpdatedEvent } from "@monkeydkon-ticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}