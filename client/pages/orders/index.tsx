import { AxiosInstance } from "axios";
import { NextPageContext } from "next";

const OrderIndex = ({ orders }) => {
  return <div><ul>
      {orders.map(order => {
        return <li key={order.id}>{order.ticket.title} - {order.status}</li>
      })}
    </ul></div>
}

OrderIndex.getInitialProps = async (ctx:NextPageContext, client: AxiosInstance) => {
  const { data } = await client.get('/api/orders');

  return {
    orders: data
  }
}


export default OrderIndex;