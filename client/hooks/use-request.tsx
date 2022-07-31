import axios from "axios";
import { useState } from "react";
import { Errors } from "../types/errors-types";

type requestParams = {
  url: string;
  method: string;
  body: object;
  onSuccess: (response: object) => void;
}

export default ({ url, method, body, onSuccess }:requestParams) => {
  const [errors, setErrors] = useState<Errors|null>(null);
  const isError = (field: string): Boolean => {
    return (errors?.filter(err => err.field === field).length > 0) ;
  }

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await 
        axios[method](
          url, 
          {...body, ...props}
        );

      if(onSuccess) {
        onSuccess( response.data );
      }

      return response.data;
    } catch (err) {
      setErrors(err.response.data.errors);   
    }
  }

  return { doRequest, errors, isError, setErrors }
}