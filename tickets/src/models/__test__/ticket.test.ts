import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // create an instance of a ticket and save the ticket to the DB
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });
  await ticket.save();
  // fetch the ticket twice
  const instance1 = await Ticket.findById(ticket.id);
  const instance2 = await Ticket.findById(ticket.id);

  // make two separate changes to the tickets
  instance1!.set({ price: 10 });
  instance2!.set({ price: 15 });

  // save the first fetched ticket
  await instance1!.save();
  expect(instance1!.price).toEqual(10);

  // try saving the second fetched ticket and expect error
  await expect(() => instance2!.save()).rejects.toThrow();
});

it('updtes version number when saving', async () => {
  // create an instance of a ticket and save the ticket to the DB
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
