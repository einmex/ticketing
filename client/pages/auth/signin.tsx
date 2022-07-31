import { Form } from "../../components/sign-form";

export default () => {
  return Form(
    '/api/users/signin', 
    'Sign In'
  );
}