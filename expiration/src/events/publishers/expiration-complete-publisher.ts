import { Publisher, Subjects, ExpirationCompleteEvent } from "@monkeydkon-ticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}