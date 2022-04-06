import '@/database/models';
import homeRouter from './home.router';
import certificatesRouter from './certificates.router';
import { serviceMiddleware } from '@/middleware';

const routers = [{ '/': homeRouter }, { '/certificates': certificatesRouter }];

const middlewares = [serviceMiddleware.get];

export function attachRouters(app) {
  for (const routerObj of routers) {
    const [resource, router] = Object.entries(routerObj)[0];
    //.....👇🏻 /api/certificates
    app.use(`/api${resource}`, middlewares, router);
  }
}
