import request from 'supertest';
import { app } from '../app';

export const getAuthCookie = async (): Promise<string[]> => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};

export const isSession = (str: string): Boolean => {
  //if session is like session=o3sjdwerio - will return -1, otherwise will return 0, 1, 2, etc
  const cookieData = str.split(';').indexOf('session=');

  return cookieData === -1 ? true : false;
};
