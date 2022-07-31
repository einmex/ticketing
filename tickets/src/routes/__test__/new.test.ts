import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { createTicket } from '../../test/utils';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns status other than 401 if user is signed in', async () => {
  const response = await createTicket();
  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await createTicket({
    title: '',
    price: 20,
  }).expect(400);

  await createTicket({
    price: 20,
  }).expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await createTicket({
    title: 'Some title',
    price: -20,
  }).expect(400);

  await createTicket({
    title: 'Some title',
  }).expect(400);
});

it('creates a ticket with valid inputs', async () => {
  //add in a check to make sure a ticket was saved
  const ticket = {
    title: 'Title',
    price: 20,
  };

  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);

  await createTicket(ticket).expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(ticket.price);
  expect(tickets[0].title).toEqual(ticket.title);
});

it('publishes an event', async () => {
  const ticket = {
    title: 'Title',
    price: 20,
  };

  await createTicket(ticket).expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
