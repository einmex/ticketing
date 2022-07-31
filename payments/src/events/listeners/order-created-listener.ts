import {
  Listener,
  OrderCreatedEvent,
  OrderData,
  Subjects,
} from '@einmex-org/common-auth';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderData, msg: Message) {
    const {
      id,
      status,
      version,
      userId,
      ticket: { price },
    } = data;

    //build an Order to store in DB
    const order = Order.build({ id, status, version, userId, price });
    await order.save();

    // ack the message
    msg.ack();
  }
}
