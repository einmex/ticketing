export type Ticket = {
  id: string;
  title: string;
  price: number;
  userId: string;
  orderId?: string;
  version: number;
}