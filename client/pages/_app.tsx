import 'bootstrap/dist/css/bootstrap.css';
import type { AppProps } from 'next/app';
import buildClient from "../api/build-client";
import { CurrentUser } from '../types/user-types';
import Header from '../components/header';
import { NextPageContext } from 'next';
import { AxiosInstance } from 'axios';

const AppComponent = ({ Component, pageProps }:AppProps) => {
  const { currentUser }: CurrentUser = pageProps;
  return (
    <>
      <Header currentUser = {currentUser} />
      <div className="container">
        <Component {...pageProps}  />
      </div>
    </>
  );
}

AppComponent.getInitialProps = async ({ Component, ctx }) => {

  const req = ctx.req;
  const client = buildClient({ req });
  const { data: { currentUser } } = await client.get<CurrentUser>('/api/users/currentuser');
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx, client, currentUser);
  }

  pageProps = {
    ...pageProps,
    currentUser
  }

  return { pageProps };
}

export default AppComponent;
