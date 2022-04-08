import { StatusCodes } from 'http-status-codes';
import {
  buildCertificate,
  buildCertificatesStringifyed,
  buildChanges,
} from 'test/builders';
import { appError, logger } from '@/utils';
import Certificate from '@/database/models/certificate.model';
import {
  listCertificates,
  removeCertificate,
  saveCertificate,
  updateCertificate,
} from './certificate.service';

jest.mock('@/database/models/certificate.model');
jest.mock('@/utils');

describe('Service > Certificate', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should return a list of certificates', async () => {
    const certificates = buildCertificatesStringifyed();

    jest.spyOn(Certificate, 'find').mockResolvedValueOnce(certificates);

    const returnedCertificates = await listCertificates();

    expect(returnedCertificates).toEqual(certificates);
    expect(Certificate.find).toHaveBeenCalledTimes(1);
    expect(Certificate.find).toHaveBeenCalledWith({});
  });

  it('should reject with an error when Certificates.find() fails', async () => {
    jest.spyOn(Certificate, 'find').mockRejectedValueOnce();

    try {
      await listCertificates();
    } catch (error) {
      expect(appError).toHaveBeenCalledTimes(1);
      expect(appError).toHaveBeenCalledWith('Failed to list certificates');
    }
  });

  it('should reject with an error when saveCertificate() is called without any data', async () => {
    try {
      await saveCertificate();
    } catch (error) {
      expect(appError).toHaveBeenCalledTimes(1);
      expect(appError).toHaveBeenCalledWith('Failed to save certificate');
    }
  });

  it('should save and return new certificate', async () => {
    const data = buildCertificate();

    jest.spyOn(Certificate, 'create').mockResolvedValueOnce(data);

    const certificate = await saveCertificate(data);
    const order = {
      ...data,
      _id: certificate._id,
    };

    expect(certificate).toEqual(order);
    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith('New certificate saved', {
      certificate,
    });
  });

  it('should reject with an error when saveCertificate() fails', async () => {
    const data = buildCertificate();
    const error = {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Failed',
    };

    jest.spyOn(Certificate, 'create').mockRejectedValueOnce(error);

    await saveCertificate(data);

    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
      'Error while trying to save certificate',
      {
        error,
      },
    );
  });

  it('should reject with an error when updateCertificate() is called without any data or just 1 parameter', async () => {
    const message = 'Failed to update certificate';

    try {
      await updateCertificate();
    } catch (error) {
      expect(appError).toHaveBeenCalledTimes(1);
      expect(appError).toHaveBeenCalledWith(message);
    }

    try {
      await updateCertificate('id');
    } catch (error) {
      expect(appError).toHaveBeenCalledTimes(2);
      expect(appError).toHaveBeenNthCalledWith(2, message);
    }
  });

  it('should update and call info', async () => {
    const changes = buildChanges();

    jest.spyOn(Certificate, 'updateOne').mockResolvedValueOnce();

    await updateCertificate('ID', changes);

    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith('Certificate ID changed', {
      changes,
    });
  });

  it('should reject with an error when updateCertificate() fails', async () => {
    const changes = buildChanges();
    const error = {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Failed',
    };

    jest.spyOn(Certificate, 'updateOne').mockRejectedValueOnce(error);

    await updateCertificate('ID', changes);

    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
      'Error while trying to update certificate',
      {
        error,
      },
    );
  });

  it('should reject with an error when removeCertificate() is called without any data', async () => {
    try {
      await removeCertificate();
    } catch (error) {
      expect(appError).toHaveBeenCalledTimes(1);
      expect(appError).toHaveBeenCalledWith('Failed to remove certificate');
    }
  });

  it('should remove and call info', async () => {
    jest.spyOn(Certificate, 'findByIdAndRemove').mockResolvedValueOnce();

    await removeCertificate('ID');

    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith('Certificate ID removed');
  });

  it('should reject with an error when removeCertificate() fails', async () => {
    const error = {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Failed',
    };

    jest.spyOn(Certificate, 'findByIdAndRemove').mockRejectedValueOnce(error);

    await removeCertificate('ID');

    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
      'Error while trying to remove certificate',
      {
        error,
      },
    );
  });
});
