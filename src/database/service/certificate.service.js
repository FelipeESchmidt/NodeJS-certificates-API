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

export async function updateCertificate(certificateId, changes) {
  if (!(certificateId && changes)) {
    return Promise.reject(appError('Failed to update certificate'));
  }

  try {
    await Certificate.updateOne({ _id: certificateId }, { ...changes });
    logger.info(`Certificate ${certificateId} changed`, { changes });
  } catch (error) {
    logger.info(`Error while trying to update certificate`, { error });
  }
}

export async function removeCertificate(certificateId) {
  if (!certificateId) {
    return Promise.reject(appError('Failed to remove certificate'));
  }

  try {
    await Certificate.findByIdAndRemove(certificateId);
    logger.info(`Certificate ${certificateId} removed`);
  } catch (error) {
    logger.info(`Error while trying to remove certificate`, { error });
  }
}
