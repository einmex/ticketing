import request from 'supertest';
import { app } from '../../app';
import { createTicket } from '../../test/utils';

it('can fetch a list of tickets', async () => {
  await createTicket({ title: 'concert', price: 20 }).expect(201);
  await createTicket({ title: 'concert1', price: 22 }).expect(201);
  await createTicket({ title: 'concert2', price: 25 }).expect(201);

  const response = await request(app).get('/api/tickets').send().expect(200);
  expect(response.body.length).toEqual(3);
});
