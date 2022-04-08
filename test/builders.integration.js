import supertest from 'supertest';
import app from '@/app';
import { API_SECURITY } from '@/utils';

export async function buildCall(endpoint, method = 'get', body = null) {
  const request = supertest(app);

  return request[method](endpoint).send(body).set('security', API_SECURITY);
}
