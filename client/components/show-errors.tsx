import { Errors } from "../types/errors-types";

export const ShowErrors = ({ errors }: {errors: Errors | null}) => {
  if (!errors) {return null;}
  return (
    <div className="alert alert-danger">
      <h4>Ooops...</h4>
      <ul className="my-0">
        {errors.map((err) => <li key={err.message}>{err.message}</li>)}        
      </ul>
    </div>
  );
}
  
    
  
