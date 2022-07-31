import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';

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

export const buildTicket = async (title?: string, price?: number) => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: title || 'Concert',
    price: price || 20,
  });

  await ticket.save();

  return ticket;
};
