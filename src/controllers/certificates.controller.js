import { body, validationResult } from 'express-validator';
import {
  validationResponse,
  buildCertificate,
  certificateFiels,
} from './utils';

export async function index(req, res, next) {
  try {
    const certificates = await req.service.listCertificates();
    res.status(200).json({ certificates });
  } catch (error) {
    /**
     * Os erros passados para o método next() serão capturados
     * pelo gerenciador global de erros (ver app.js) e chegarão
     * no client que fez a requisição
     */
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
