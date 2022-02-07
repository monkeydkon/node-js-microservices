import { Publisher, Subjects, TicketCreatedEvent } from "@monkeydkon-ticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}