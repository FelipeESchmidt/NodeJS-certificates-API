import { buildRes } from 'test/builders';
import { index } from './home.controller';

describe('Controllers > Home', () => {
  const res = buildRes();

  it('should do something', async () => {
    await index(null, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ welcome: 'Welcome Stranger!' });
  });
});
