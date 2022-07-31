import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { getAuthCookie } from '../../test/utils';
import { OrderStatus } from '@einmex-org/common-auth';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe');

const buildOrder = async (orderstatus?: OrderStatus) => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: orderstatus || OrderStatus.Created,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
  });

  await order.save();
  return order;
};

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', getAuthCookie())
    .send({
      orderId: new mongoose.Types.ObjectId().toHexString(),
      token: 'oeriwuowei',
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to user', async () => {
  const order = await buildOrder();

  await request(app)
    .post('/api/payments')
    .set('Cookie', getAuthCookie())
    .send({
      orderId: order.id,
      token: 'oeriwuowei',
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const order = await buildOrder(OrderStatus.Cancelled);

  await request(app)
    .post('/api/payments')
    .set('Cookie', getAuthCookie(order.userId))
    .send({
      orderId: order.id,
      token: 'oeriwuowei',
    })
    .expect(400);
});

it('returns a 201 with valid inputs', async () => {
  const order = await buildOrder();

  await request(app)
    .post('/api/payments')
    .set('Cookie', getAuthCookie(order.userId))
    .send({
      orderId: order._id,
      token: 'tok_visa',
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual('usd');
});

it('creates payment with given orderId and stripeId', async () => {
  const order = await buildOrder();

  await request(app)
    .post('/api/payments')
    .set('Cookie', getAuthCookie(order.userId))
    .send({
      orderId: order.id,
      token: 'tok_visa',
    })
    .expect(201);

  const payment = await Payment.findOne({ orderId: order.id });
  expect(payment).not.toBeFalsy();
});
