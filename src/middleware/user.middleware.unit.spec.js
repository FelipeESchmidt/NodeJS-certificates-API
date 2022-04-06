import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import * as service from '@/database/service';
import { get } from './user.middleware';
import { buildError, buildNext, buildReq } from 'test/builders';

jest.mock('@/database/service');

describe('Middlewares > User', () => {
  const error = buildError(
    StatusCodes.UNPROCESSABLE_ENTITY,
    `${ReasonPhrases.UNPROCESSABLE_ENTITY}: header should contain a valid email`,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  const buildHeaderWithEmail = email => buildReq({ user: { email } });

  it('should forward an error when an email is not provided in the headers', () => {
    const req = buildHeaderWithEmail();
    const next = buildNext();

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should forward an error when an invalid email is provided in the headers', () => {
    const req = buildHeaderWithEmail('felipe');
    const next = buildNext();

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should return an user object given a valid email is provided', async () => {
    const email = 'felipe@email.com';
    const req = buildHeaderWithEmail(email);
    const next = buildNext();
    const resolved = {
      id: 1,
      email,
    };

    jest.spyOn(service, 'findOrSave').mockResolvedValueOnce([resolved]);

    await get(req, null, next);

    expect(req.user).toBeDefined();
    expect(req.user).toEqual(resolved);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(/* notthing */);
  });

  it('should forward an error when service.findOrSave fails', async () => {
    const email = 'felipe@email.com';
    const errorMessage = 'DataBase is down';
    const req = buildHeaderWithEmail(email);
    delete req.user;
    const next = buildNext();

    jest.spyOn(service, 'findOrSave').mockRejectedValueOnce(errorMessage);

    await get(req, null, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
