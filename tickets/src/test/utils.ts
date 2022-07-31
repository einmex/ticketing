import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

type Ticket = {
  title?: string;
  price?: number;
};

export const getAuthCookie = (): string[] => {
  // Build a JWT payload. {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // Create the JWT
  const tocken = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object { jwt: MY_JWT  }
  // Turn that session into JSON
  const sessionJSON = JSON.stringify({ jwt: tocken });

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a cookie string with the encoded data
  return [`session=${base64}`];
};

export const isSession = (str: string): Boolean => {
  //if session is like session=o3sjdwerio - will return -1, otherwise will return 0, 1, 2, etc
  const cookieData = str.split(';').indexOf('session=');

  return cookieData === -1 ? true : false;
};

export const createTicket = (ticket?: Ticket) => {
  const response = ticket ? ticket : {};
  return request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send(response);
};
