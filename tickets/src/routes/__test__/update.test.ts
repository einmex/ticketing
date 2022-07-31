import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { getAuthCookie, createTicket } from '../../test/utils';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns 404 if provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', getAuthCookie())
    .send({ title: 'some title', price: 20 })
    .expect(404);
});

it('returns 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const res = await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'some title', price: 20 })
    .expect(401);
});

it('returns 401 if user does not own a ticket', async () => {
  const res = await createTicket({ title: 'Some title', price: 20 });

  const res2 = await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', getAuthCookie())
    .send({ title: 'some title1', price: 21 })
    .expect(401);
});

it('returns 400 if user provides an invalid title or price', async () => {
  const cookie = getAuthCookie();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'some title', price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 21 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ price: 21 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'some title', price: -21 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'some title' })
    .expect(400);
});

it('it updates the ticket provided valid inputs', async () => {
  const cookie = getAuthCookie();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'some title', price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'some title1', price: 21 })
    .expect(200);

  const response = await request(app).get(`/api/tickets/${res.body.id}`).send();

  expect(response.body.title).toEqual('some title1');
  expect(response.body.price).toEqual(21);
});

it('publishes an event', async () => {
  const cookie = getAuthCookie();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'some title', price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'some title1', price: 21 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if a ticket is reserved', async () => {
  const cookie = getAuthCookie();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'some title', price: 20 })
    .expect(201);

  const ticket = await Ticket.findById(res.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'some title1', price: 21 })
    .expect(400);
});
