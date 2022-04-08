import mongoose from 'mongoose';
import { buildCall } from 'test/builders.integration';

describe('Router > Integration > Home', () => {
  it('should return status 200 and a welcome message', async done => {
    const res = await buildCall('/api');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ welcome: 'Welcome to the API!' });

    await mongoose.connection.close();
    done();
  });
});
