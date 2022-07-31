import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { OrderStatus } from '@einmex-org/common-auth';
import { getAuthCookie, buildTicket } from '../../test/utils';
import { natsWrapper } from '../../nats-wrapper';

it('changes status of an order to cancelled', async () => {
  // create a ticket
  const ticket = await buildTicket();
  const user = getAuthCookie();

  // make request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to delete the order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  const { body: updatedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
});

it('user cannot fetch order of another user', async () => {
  // create a ticket
  const ticket = await buildTicket();

  // make request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', getAuthCookie())
    .send()
    .expect(401);
});

it('receives 404 when no order is found', async () => {
  // make request to fetch the order
  await request(app)
    .get(`/api/orders/${new mongoose.Types.ObjectId()}`)
    .set('Cookie', getAuthCookie())
    .send()
    .expect(404);
});

it('emits an order cancelled event', async () => {
  // create a ticket
  const ticket = await buildTicket();
  const user = getAuthCookie();

  // make request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to delete the order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
