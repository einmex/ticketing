import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@einmex-org/common-auth';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
