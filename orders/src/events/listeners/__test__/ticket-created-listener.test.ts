import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@einmex-org/common-auth';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
const setup = async () => {
  //create instance of listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  //create fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Some title',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  //create fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};
it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  //call onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  //write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  //call onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  //write assertions to make sure a ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
