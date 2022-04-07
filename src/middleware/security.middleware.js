import { StatusCodes } from 'http-status-codes';
import md5 from 'md5';
import { API_SECURITY_KEY } from '@/utils';

export const guaranteeSecurity = (req, res, next) => {
  const { security } = req.headers;

  if (md5(String(security)) !== String(API_SECURITY_KEY)) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Access denied' });
    return;
  }

  next();
};
