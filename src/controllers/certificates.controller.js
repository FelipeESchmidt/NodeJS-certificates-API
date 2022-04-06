import { body, validationResult } from 'express-validator';
import {
  validationResponse,
  buildCertificate,
  certificateFiels,
  buildCertificateChanges,
} from './utils';

export async function index(req, res, next) {
  try {
    const certificates = await req.service.listCertificates();
    res.status(200).json({ certificates });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      validationResponse(res, errors);
      return;
    }

    const data = buildCertificate(req.body);

    const certificate = await req.service.saveCertificate(data);

    res.status(200).json({ certificate: { id: certificate.id } });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      validationResponse(res, errors);
      return;
    }

    const { id } = req.params;
    const changes = buildCertificateChanges(req.body);

    await req.service.updateCertificate(id, changes);

    res.status(200).json({ id, changes });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      validationResponse(res, errors);
      return;
    }

    const { id } = req.params;

    await req.service.removeCertificate(id);

    res.status(200).json({ id });
  } catch (error) {
    next(error);
  }
}

/**
 * Este método é executado na rota como um middleware.
 * Ver orders.router.js.
 */
export const validate = method => {
  switch (method) {
    case 'create': {
      return [
        certificateFiels.map(field =>
          body(field, `Please provide ${field} field`).exists(),
        ),
      ];
    }
    default:
      throw new Error('Unknown method was provided');
  }
};
