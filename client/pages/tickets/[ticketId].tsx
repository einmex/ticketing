import { AxiosInstance } from "axios";
import { NextPageContext } from "next";
import { ShowErrors } from "../../components/show-errors";
import { ShowTicket } from "../../components/show-ticket";
import { Ticket } from "../../types/ticket-types";

const TicketShow = ({ ticket }) => {
  if (ticket.errors?.length > 0) {
    return <ShowErrors errors = {ticket.errors} />;
  }

  return <ShowTicket {...ticket} />;
}

TicketShow.getInitialProps = async (ctx:NextPageContext, client: AxiosInstance) => {
  const { ticketId } = ctx.query;
  try {
    const { data } = await client.get<Ticket>(`/api/tickets/${ticketId}`);
    return {
      ticket: data
    }
  } catch (error) {
    return {
      ticket: error.response.data
    }
  }
  
  
}

export default TicketShow;