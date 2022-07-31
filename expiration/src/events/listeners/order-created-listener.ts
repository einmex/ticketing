import {
  Listener,
  OrderCreatedEvent,
  OrderData,
  Subjects,
} from '@einmex-org/common-auth';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderData, msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime(); // time + 15 mins - time => 15 mins or so.

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: delay,
      }
    );

    msg.ack();
  }
}
