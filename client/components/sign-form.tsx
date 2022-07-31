import { useState } from "react";
import Router from "next/router";
import useRequest from "../hooks/use-request";
import { ShowErrors } from "./show-errors";

export const Form = (url:string, name:string) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors, isError } = useRequest({
    url: url,
    method: 'post',
    body: {
      email, password
    },
    onSuccess: () => Router.push('/'),
  })
  
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await doRequest();
  }


  return (
    <form onSubmit={onSubmit}>
      <h1>{name}</h1>
      {ShowErrors({errors})}
      <div className="form-group">
        <label>Email address</label>
        <input 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className={`form-control ${isError('email') && 'is-invalid'}`} 
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" className={`form-control ${isError('password') && 'is-invalid'}`}  />
      </div>
      <button className="btn btn-primary">{name}</button>
    </form>
  )
}