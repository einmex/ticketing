import request from 'supertest';
import { app } from '../../app';
import { getAuthCookie } from '../../test/utils';

it('responds with details about current user', async () => {
  const cookie = await getAuthCookie();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds null when not signed in', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body.currentUser).toBeFalsy;
});
