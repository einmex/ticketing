import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from '@einmex-org/common-auth';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
