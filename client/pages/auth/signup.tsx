import { Form } from "../../components/sign-form";

export default () => {
  return Form(
    '/api/users/signup', 
    'Sign Up'
  );
}

