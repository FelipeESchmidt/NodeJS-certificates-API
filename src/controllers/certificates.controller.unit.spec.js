import * as validator from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import {
  buildError,
  buildNext,
  buildCertificates,
  buildReq,
  buildRes,
  buildCertificate,
} from 'test/builders';
import {
  index,
  validate,
  create,
  update,
  remove,
} from './certificates.controller';
import { validationResponse } from './utils';
import * as utils from './utils';

jest.mock('express-validator');
jest.mock('./utils');
JSON.stringify = jest.fn();

const buildReqResNext = () => ({
  req: buildReq(),
  res: buildRes(),
  next: buildNext(),
});

const buildReqResNextWithReqOverrides = ({ ...overrides }) => ({
  req: buildReq({ ...overrides }),
  res: buildRes(),
  next: buildNext(),
});

const expectResStatus200Once = res => {
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(200);
};

const expectReqServiceFuncOnceWith = (reqServiceFunc, ...calledWith) => {
  expect(reqServiceFunc).toHaveBeenCalledTimes(1);
  expect(reqServiceFunc).toHaveBeenCalledWith(...calledWith);
};

const expectResJsonOnceWith = (res, jsonWith) => {
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith(jsonWith);
};

const expectValidationResponseOnceWith = (res, errorBag) => {
  expect(validationResponse).toHaveBeenCalledTimes(1);
  expect(validationResponse).toHaveBeenCalledWith(res, errorBag);
};

const expectResAndStatusJsonNoneOnce = res => {
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
};

const expectNextOnceWithError = (next, error) => {
  expect(next).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledWith(error);
};

const createErrorBag = () => ({
  isEmpty: jest.fn().mockReturnValueOnce(false),
  array: jest.fn().mockReturnValueOnce(['error1', 'error2']),
});

describe('Controllers > Certificates', () => {
  afterEach(() => jest.clearAllMocks());

  describe('Index (get)', () => {
    it('should return status 200 with a list of certificates', async () => {
      const { req, res, next } = buildReqResNext();
      const certificates = buildCertificates();

      jest
        .spyOn(req.service, 'listCertificates')
        .mockResolvedValueOnce(certificates);

      await index(req, res, next);

      expectResStatus200Once(res);
      expectResJsonOnceWith(res, { certificates });
      expectReqServiceFuncOnceWith(req.service.listCertificates);
    });

    it('should forwar an error when service.listCertificates fails', async () => {
      const { req, res, next } = buildReqResNext();
      const error = buildError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Some message here!',
      );

      jest.spyOn(req.service, 'listCertificates').mockRejectedValueOnce(error);

      await index(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expectNextOnceWithError(next, error);
    });
  });

  describe('Create (post)', () => {
    it('should return status 200 and the created certificate id', async () => {
      const forceId = '123e25bb02aea5a3b2bdd8dd';
      const certificate = buildCertificate();
      const { req, res, next } = buildReqResNextWithReqOverrides({
        body: { ...certificate },
      });
      const isEmpty = jest.fn().mockReturnValueOnce(true);

      jest.spyOn(validator, 'validationResult').mockReturnValueOnce({
        isEmpty,
      });
      jest.spyOn(req.service, 'saveCertificate').mockResolvedValueOnce({
        ...certificate,
        _id: forceId,
      });
      utils.buildCertificate = data => ({ ...data });

      await create(req, res, next);

      expect(isEmpty).toHaveBeenCalledTimes(1);
      expectResStatus200Once(res);
      expectResJsonOnceWith(res, { certificate: { id: forceId } });
      expectReqServiceFuncOnceWith(req.service.saveCertificate, certificate);
    });

    it('should forward an error when service.saveCertificate fails', async () => {
      const { req, res, next } = buildReqResNext();
      const isEmpty = jest.fn().mockReturnValueOnce(true);
      const error = buildError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Some error here',
      );

      jest.spyOn(validator, 'validationResult').mockReturnValueOnce({
        isEmpty,
      });
      jest.spyOn(req.service, 'saveCertificate').mockRejectedValueOnce(error);

      await create(req, res, next);

      expectResAndStatusJsonNoneOnce(res);
      expectNextOnceWithError(next, error);
    });

    it('should return validation response when error bag is not empty', async () => {
      const { req, res, next } = buildReqResNext();
      const errorBag = createErrorBag();

      jest.spyOn(validator, 'validationResult').mockReturnValueOnce(errorBag);

      expect(await create(req, res, next)).toBeUndefined();

      expectValidationResponseOnceWith(res, errorBag);
      expectResAndStatusJsonNoneOnce(res);
    });
  });

  describe('Update (put)', () => {
    it('should return status 200 and the certificate id and changes', async () => {
      const forceId = '123e25bb02aea5a3b2bdd8dd';
      const changes = { description: 'new desc', title: 'new title' };
      const { req, res, next } = buildReqResNextWithReqOverrides({
        params: { id: forceId },
        body: { ...changes },
      });
      const isEmpty = jest.fn().mockReturnValueOnce(true);

      jest.spyOn(validator, 'validationResult').mockReturnValueOnce({
        isEmpty,
      });
      jest.spyOn(req.service, 'updateCertificate').mockResolvedValueOnce();
      utils.buildCertificateChanges = data => ({ ...data });

      await update(req, res, next);

      expect(isEmpty).toHaveBeenCalledTimes(1);
      expectResStatus200Once(res);
      expectResJsonOnceWith(res, {
        id: forceId,
        changes,
      });
      expectReqServiceFuncOnceWith(req.service.updateCertificate, forceId, {
        ...changes,
      });
    });

    it('should forward an error when service.updateCertificate fails', async () => {
      const { req, res, next } = buildReqResNext();
      const isEmpty = jest.fn().mockReturnValueOnce(true);
      const error = buildError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Some error here',
      );

      jest.spyOn(validator, 'validationResult').mockReturnValueOnce({
        isEmpty,
      });
      jest.spyOn(req.service, 'updateCertificate').mockRejectedValueOnce(error);

      await update(req, res, next);

      expectResAndStatusJsonNoneOnce(res);
      expectNextOnceWithError(next, error);
    });

    it('should return validation response when error bag is not empty', async () => {
      const { req, res, next } = buildReqResNext();
      const errorBag = createErrorBag();

      jest.spyOn(validator, 'validationResult').mockReturnValueOnce(errorBag);

      expect(await update(req, res, next)).toBeUndefined();

      expectValidationResponseOnceWith(res, errorBag);
      expectResAndStatusJsonNoneOnce(res);
    });
  });

  describe('Remove (delete)', () => {
    it('should return status 200 and the certificate id', async () => {
      const forceId = '123e25bb02aea5a3b2bdd8dd';
      const { req, res, next } = buildReqResNextWithReqOverrides({
        params: { id: forceId },
      });
      const isEmpty = jest.fn().mockReturnValueOnce(true);

      jest.spyOn(validator, 'validationResult').mockReturnValueOnce({
        isEmpty,
      });
      jest.spyOn(req.service, 'removeCertificate').mockResolvedValueOnce();
      utils.buildCertificateChanges = data => ({ ...data });

      await remove(req, res, next);

      expect(isEmpty).toHaveBeenCalledTimes(1);
      expectResStatus200Once(res);
      expectResJsonOnceWith(res, { id: forceId });
      expectReqServiceFuncOnceWith(req.service.removeCertificate, forceId);
    });

    it('should forward an error when service.removeCertificate fails', async () => {
      const { req, res, next } = buildReqResNext();
      const isEmpty = jest.fn().mockReturnValueOnce(true);
      const error = buildError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Some error here',
      );

      jest.spyOn(validator, 'validationResult').mockReturnValueOnce({
        isEmpty,
      });
      jest.spyOn(req.service, 'removeCertificate').mockRejectedValueOnce(error);

      await remove(req, res, next);

      expectResAndStatusJsonNoneOnce(res);
      expectNextOnceWithError(next, error);
    });

    it('should return validation response when error bag is not empty', async () => {
      const { req, res, next } = buildReqResNext();
      const errorBag = createErrorBag();

      jest.spyOn(validator, 'validationResult').mockReturnValueOnce(errorBag);

      expect(await remove(req, res, next)).toBeUndefined();

      expectValidationResponseOnceWith(res, errorBag);
      expectResAndStatusJsonNoneOnce(res);
    });
  });

  describe('Validate (middleware)', () => {
    it('should build a list of errors', () => {
      const method = 'create';
      const existFn = jest.fn().mockReturnValue('Please provide this field');

      jest.spyOn(validator, 'body').mockReturnValue({
        exists: existFn,
      });

      utils.certificateFiels = ['title', 'description'];

      const errors = validate(method);

      expect(errors).toHaveLength(1);
      expect(errors[0]).toHaveLength(utils.certificateFiels.length);

      expect(validator.body).toHaveBeenCalledTimes(
        utils.certificateFiels.length,
      );

      utils.certificateFiels.map((field, i) => {
        expect(validator.body).toHaveBeenNthCalledWith(
          i + 1,
          field,
          `Please provide ${field} field`,
        );
      });
    });

    it('should throw an error when an unknown method is provided', () => {
      const method = 'unknown';

      expect(() => validate(method)).toThrowError(
        'Unknown method was provided',
      );
    });
  });
});
