import Router from "next/router";
import { useState } from "react";
import useRequest from "../../hooks/use-request";

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const {doRequest, errors, setErrors} = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title, price
    },
    onSuccess: (ticket) => Router.push('/'),
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setErrors(null);
    e.preventDefault();
    let formErrors = [];

    if (!title.trim()) {
      formErrors = [
        ...formErrors, 
        {message: 'Title should not be empty'}
      ]
    };
  
    if (price === '') {
      formErrors = [...formErrors, {message: 'Please add price. It should be number'}];
    }
    if (formErrors.length > 0) {
      setErrors(formErrors);
      return;
    }

    await doRequest();
  }

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      setPrice('');
      return;
    }

    setPrice(value.toFixed(2));
  }

  return (<div>
    <h1>Create a ticket</h1>
    {errors &&
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul className="my-0">
            {errors.map((err) => <li key={err.message}>{err.message}</li>)}
          </ul>
        </div>
      }
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} className="form-control" />
      </div>
      <div className="form-group">
        <label>Price</label>
        <input value={price} onChange={e => setPrice(e.target.value)} onBlur={onBlur} className="form-control" />
      </div>
      <button className="btn btn-primary">Submit</button>
    </form>
    
  </div>)
}

export default NewTicket;