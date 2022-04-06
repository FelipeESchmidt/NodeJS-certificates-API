/* istanbul ignore file */

const mongoose = require('mongoose');
import { DATABASE } from '@/utils';

mongoose.Promise = global.Promise;

mongoose
  .connect(DATABASE)
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch(err => {
    console.log(err);
  });
