import { useEffect, useState } from "react";
import useRequest from "../hooks/use-request";
import { Order } from "../types/order-types";
import { OrderExpired } from "./order-expired";
import StripeCheckout from 'react-stripe-checkout';
import { User } from "../types/user-types";
import { ShowErrors } from "./show-errors";
import Router from 'next/router';

export const ShowOrder = ({ order, currentUser }:{ order: Order, currentUser: User }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { 
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders'),
    
  });

  useEffect(()=>{
    const findTimeLeft = () => {
      const msLeft = (new Date(order.expiresAt)).valueOf() - (new Date()).valueOf();
      setTimeLeft(Math.round(msLeft / 1000));
    } 

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => clearInterval(timerId);

  }, []);

  if (timeLeft < 0) return <OrderExpired />;

  return <div>
      <p>Time left to pay: {timeLeft} seconds</p>
      <p>email: 1={currentUser.email}=2</p>
      <ShowErrors errors={errors}/>
      <StripeCheckout
        token={ ({ id }) => doRequest({ token: id }) } 
        stripeKey={process.env.STRIPE_PUBLISHABLE_KEY}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
  </div>;
}