import { AxiosInstance } from "axios";
import { NextPageContext } from "next";
import { OrderExpired } from "../../components/order-expired";
import { ShowErrors } from "../../components/show-errors";
import { ShowOrder } from "../../components/show-order";
import { Order } from "../../types/order-types";

const OrderShow = ({ order, currentUser }) => {
  console.log('[orderId] file', order, currentUser);
  if (order.errors?.length > 0) {
    return <ShowErrors errors = {order.errors} />;
  }

  if (order.status === 'cancelled') {
    return <OrderExpired />
  }

  //return <div>What the fuck</div>

  return <ShowOrder order={order} currentUser={currentUser} />
}

OrderShow.getInitialProps = async (ctx:NextPageContext, client: AxiosInstance) => {
  const { orderId } = ctx.query;

  try {
    const { data } = await client.get<Order>(`/api/orders/${orderId}`);

    return {
      order: data
    }
  } catch (error) {
    return {
      order: error.response.data
    }
  }
}

export default OrderShow;