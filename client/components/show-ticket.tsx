import Router from "next/router";
import useRequest from "../hooks/use-request";
import { Ticket } from "../types/ticket-types";
import { ShowErrors } from "./show-errors";

export const ShowTicket = (ticket:Ticket) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id
    },
    onSuccess: (order:{id:string}) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
  });

  if (errors) {
    console.log(errors);
  }

  const status = <p>Status - {(ticket.orderId) ? 'Reserved' : 'Available'}</p>;

  return (<div>
    <h1>{ticket.title}</h1>
    <h4>Price: {ticket.price}$</h4>
    {status}
    {ShowErrors({errors})}
    <button 
      className="btn btn-primary" 
      disabled={ticket.orderId ? true : false} 
      onClick={() => doRequest()}
    >Purchase</button>
  </div>);
}