import express from 'express';
import { homeController } from '@/controllers';

const routes = express.Router().get('/', homeController.index);

export default routes;
