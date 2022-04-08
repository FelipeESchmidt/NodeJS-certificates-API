import mongoose from 'mongoose';
import * as service from '@/database/service';
import { StatusCodes } from 'http-status-codes';
import { buildError, buildCertificate, buildCertificates } from 'test/builders';
import { buildCall } from 'test/builders.integration';
import { certificateFiels } from '@/controllers/utils';

jest.mock('@/database/service');

const finalizeTest = async done => {
  await mongoose.connection.close();
  done();
};

describe('Router > Integration > Certificates', () => {
  describe('GET /api/certificates', () => {
    it('should return status 200 and a list of certificates', async done => {
      const certificates = buildCertificates();
      jest
        .spyOn(service, 'listCertificates')
        .mockResolvedValueOnce(certificates);

      const res = await buildCall('/api/certificates');

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({ certificates });

      await finalizeTest(done);
    });

    it('should return status 500 and an error message when listCertificates rejects', async done => {
      const error = buildError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to retrieve list of certificates',
      );

      jest.spyOn(service, 'listCertificates').mockRejectedValueOnce(error);

      const res = await buildCall('/api/certificates');

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toEqual({
        message: 'Failed to retrieve list of certificates',
      });

      await finalizeTest(done);
    });
  });

  describe('POST /api/certificates', () => {
    it('should return status 200 and the newly created certificate id', async done => {
      const certificate = buildCertificate();
      jest.spyOn(service, 'saveCertificate').mockResolvedValueOnce(certificate);

      const res = await buildCall('/api/certificates', 'post', {
        ...certificate,
      });

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual({ certificate: { id: certificate._id } });

      await finalizeTest(done);
    });

    it('should return status 500 and an error message when saveCertificate rejects', async done => {
      const certificate = buildCertificate();
      const error = buildError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to save certificate',
      );

      jest.spyOn(service, 'saveCertificate').mockRejectedValueOnce(error);

      const res = await buildCall('/api/certificates', 'post', {
        ...certificate,
      });

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toEqual({ message: 'Failed to save certificate' });

      await finalizeTest(done);
    });

    it('should return status 422 and an error message when validation erros are returned', async done => {
      const res = await buildCall('/api/certificates', 'post');

      expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(res.body.errors).toHaveLength(certificateFiels.length);

      await finalizeTest(done);
    });
  });

  describe('PUT /api/certificates/:id', () => {
    it('should return status 200', async done => {
      const certificate = buildCertificate();
      jest.spyOn(service, 'updateCertificate').mockResolvedValueOnce();

      const res = await buildCall(
        `/api/certificates/${certificate._id}`,
        'put',
      );

      expect(res.status).toBe(StatusCodes.OK);

      await finalizeTest(done);
    });

    it('should return status 500 and an error message when updateCertificate rejects', async done => {
      const certificate = buildCertificate();
      const error = buildError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to update certificate',
      );

      jest.spyOn(service, 'updateCertificate').mockRejectedValueOnce(error);

      const res = await buildCall(
        `/api/certificates/${certificate._id}`,
        'put',
      );

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toEqual({ message: 'Failed to update certificate' });

      await finalizeTest(done);
    });
  });

  describe('DELETE /api/certificates/:id', () => {
    it('should return status 200', async done => {
      const certificate = buildCertificate();
      jest.spyOn(service, 'removeCertificate').mockResolvedValueOnce();

      const res = await buildCall(
        `/api/certificates/${certificate._id}`,
        'delete',
      );

      expect(res.status).toBe(StatusCodes.OK);

      await finalizeTest(done);
    });

    it('should return status 500 and an error message when removeCertificate rejects', async done => {
      const certificate = buildCertificate();
      const error = buildError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to remove certificate',
      );

      jest.spyOn(service, 'removeCertificate').mockRejectedValueOnce(error);

      const res = await buildCall(
        `/api/certificates/${certificate._id}`,
        'delete',
      );

      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toEqual({ message: 'Failed to remove certificate' });

      await finalizeTest(done);
    });
  });
});
