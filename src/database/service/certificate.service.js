import { appError } from '@/utils';
import Certificate from '@/database/models/certificate.model';
import { logger } from '@/utils';

export async function listCertificates() {
  try {
    return await Certificate.find({});
  } catch (error) {
    return Promise.reject(appError(`Failed to list certificates`));
  }
}

export async function saveOrder(data) {
  if (!data) {
    return Promise.reject(appError('Failed to save order'));
  }
  logger.info(`New order saved`, { data });
  return await Order.create(data);
}
