import { AxiosInstance, AxiosResponse } from "axios";
import { NextPageContext } from "next";
import Link from "next/link";
import { CurrentUser } from "../types/user-types";

const LandingPage = (
  { data }:
  {  
    data: {
      title: string, price: number, userId: string, version: number, id: string
    }[]}) => {
  const ticketList = data.length > 0 ? data.map(ticket => {
    return (
      <tr key={ticket.id}>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>{ticket.title}</a>
          </Link></td>
        <td>{ticket.price}</td>
      </tr>
    )
  }) : ( <tr><td colSpan={2} align="center">No tickets yet</td></tr>)

  return (
    <>
      <h1>Tickets</h1>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {ticketList}
          </tbody>
        </table>
      </div>
    </>
  );
};

LandingPage.getInitialProps = async (ctx:NextPageContext, client:AxiosInstance, currentUser: CurrentUser) => {
  const { data } = await client.get('/api/tickets');

  return {
    currentUser,
    data
  };
 
}

export default LandingPage;
