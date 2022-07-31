import Link from "next/link";
import { CurrentUser } from "../types/user-types";

export default ({ currentUser }:CurrentUser) => {
 
  type LinksConfig = {
    label: string;
    href: string;
  }[]

  const linksConfig:LinksConfig = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Tickets', href:'/tickets/new' },
    currentUser && { label: 'My Orders', href:'/orders' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]

  const links = linksConfig
    .filter(linkConfig => linkConfig)
    .map(({ label, href }) => <li key={href} className="px-1">
      <Link href={href}>
        <a className="navbar-link">{label}</a>
      </Link>
      </li>
    );

  return <nav className="navbar navbar-light bg-light">
    <div className="container-fluid">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
         {links}
        </ul>
      </div>
    </div>
  </nav>
}