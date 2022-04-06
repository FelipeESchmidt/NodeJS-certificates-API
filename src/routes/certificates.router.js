import express from 'express';
import { certificatesController } from '@/controllers';

export default express
  .Router()
  .get('/', certificatesController.index)
  .post(
    '/',
    certificatesController.validate('create'),
    certificatesController.create,
  )
  .put('/:id', certificatesController.update)
  .delete('/:id', certificatesController.remove);
