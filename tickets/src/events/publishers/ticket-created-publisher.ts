import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@einmex-org/common-auth';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
