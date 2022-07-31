import request from 'supertest';
import { app } from '../../app';
import { createTicket } from '../../test/utils';
import mongoose from 'mongoose';

it('returns 404 if ticket not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const res = await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const ticket = {
    title: 'concert',
    price: 20,
  };

  const response = await createTicket(ticket).expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(ticket.title);
  expect(ticketResponse.body.price).toEqual(ticket.price);
});
