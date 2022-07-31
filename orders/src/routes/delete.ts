import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@einmex-org/common-auth';
import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.patch(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    // get order
    const order = await Order.findById(req.params.orderId).populate('ticket');
    if (!order) {
      throw new NotFoundError();
    }

    // check it's users'
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // change status to cancelled
    order.status = OrderStatus.Cancelled;

    await order.save();

    // Publish an event saying the order was cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    res.send(order);
  }
);

export { router as deleteOrderRouter };
