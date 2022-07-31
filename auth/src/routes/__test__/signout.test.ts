import request from 'supertest';
import { app } from '../../app';
import { getAuthCookie, isSession } from '../../test/utils';

it('kills a cookie after signout', async () => {
  const cookie = await getAuthCookie();

  expect(isSession(cookie[0])).toBeTruthy;

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);
  const isCookie = isSession(response.get('Set-Cookie')[0]);

  expect(isCookie).toBeFalsy();
});
