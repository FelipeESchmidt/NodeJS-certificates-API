import { API_SECURITY_KEY } from '@/utils';
import { StatusCodes } from 'http-status-codes';
import md5 from 'md5';
import { buildNext, buildReq, buildRes } from 'test/builders';
import { guaranteeSecurity } from './security.middleware';

jest.mock('md5');

const buildReqResNext = () => ({
  req: buildReq(),
  res: buildRes(),
  next: buildNext(),
});

describe('Middleware > Security', () => {
  it('should call md5 when guaranteeSecurity() is called', () => {
    const { req, res, next } = buildReqResNext();

    guaranteeSecurity(req, res, next);

    expect(md5).toHaveBeenCalledTimes(1);
  });

  it('should unauthorized if security is not provided', () => {
    const { req, res, next } = buildReqResNext();
    delete req.security;

    guaranteeSecurity(req, res, next);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Access denied',
    });
  });

  it('should authorized if security is provided', () => {
    const { req, res, next } = buildReqResNext();

    md5.mockReturnValueOnce(API_SECURITY_KEY);

    guaranteeSecurity(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
});
