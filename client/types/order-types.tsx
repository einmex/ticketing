import { Ticket } from "./ticket-types";

export type Order = {
  id: string;
  userId: string;
  status: string;
  expiresAt: Date;
  ticket: Ticket;
  version: number;
}