import { logger } from '@/utils';
import { StatusCodes } from 'http-status-codes';

/**
 * Este método encapsula o envio dos erros de
 * validação ao cliente e nos permite logar os
 * erros para futura avaliação.
 */
export const validationResponse = (res, errors) => {
  const errorList = errors.array();
  logger.error('Validation failure', { errors: errorList });
  res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errorList });
};

export const certificateFiels = [
  'description',
  'endDate',
  'stacks',
  'title',
  'imageAlt',
  'courseImg',
  'courseUrl',
  'certificateImg',
];

export const buildCertificate = reqBody => ({
  info: {
    description: reqBody.description,
    endDate: reqBody.endDate,
    stacks: reqBody.stacks,
    title: reqBody.title,
  },
  imageAlt: reqBody.imageAlt,
  courseImg: reqBody.courseImg,
  courseUrl: reqBody.courseUrl,
  certificateImg: reqBody.certificateImg,
});
