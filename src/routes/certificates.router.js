import express from 'express';
import { certificatesController } from '@/controllers';
import { guaranteeSecurity } from '@/middleware/security.middleware';

const routes = express
  .Router()
  .get('/', certificatesController.index)
  .post(
    '/',
    guaranteeSecurity,
    certificatesController.validate('create'),
    certificatesController.create,
  )
  .put('/:id', guaranteeSecurity, certificatesController.update)
  .delete('/:id', guaranteeSecurity, certificatesController.remove);

export default routes;
