import * as validator from 'express-validator';
import changesStub from 'test/stubs/changes.json';
import certificateStub from 'test/stubs/certificate.json';
import certificatesStub from 'test/stubs/certificates.json';
import { API_SECURITY, appError } from '@/utils';
import * as service from '@/database/service';

jest.mock('@/database/service');

export function buildReq({ user = buildUser(), ...overrides } = {}) {
  return {
    user,
    service,
    headers: { security: API_SECURITY },
    body: {},
    params: {},
    ...overrides,
  };
}

export function buildRes(overrides = {}) {
  const res = {
    json: jest.fn(() => res).mockName('res.json()'),
    status: jest.fn(() => res).mockName('res.status()'),
    ...overrides,
  };
  return res;
}

export function buildNext(impl) {
  return jest.fn(impl).mockName('next');
}

export function buildError(status = 500, message = 'Default error message') {
  return appError(message, status);
}

export function buildValidationErrors(condition) {
  const isEmpty = jest.fn().mockReturnValueOnce(!condition);

  jest.spyOn(validator, 'validationResult').mockReturnValueOnce({
    isEmpty,
    array: jest.fn().mockReturnValueOnce(condition ? ['error1', 'error2'] : []),
  });

  return { isEmpty };
}

export function buildChanges() {
  return changesStub;
}

export function buildCertificate() {
  return certificateStub;
}

export function buildCertificates() {
  return certificatesStub;
}

export function buildCertificatesStringifyed() {
  return certificatesStub.map(order => {
    order.products = JSON.stringify(order.products);
    return order;
  });
}
