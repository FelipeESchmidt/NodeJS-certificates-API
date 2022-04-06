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

export async function saveCertificate(certificate) {
  if (!certificate) {
    return Promise.reject(appError('Failed to save certificate'));
  }

  try {
    const newCertificate = await Certificate.create(certificate);
    logger.info(`New certificate saved`, { certificate });
    return newCertificate;
  } catch (error) {
    logger.info(`Error while trying to save certificate`, { error });
  }
}
