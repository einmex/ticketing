import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from '@einmex-org/common-auth';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
