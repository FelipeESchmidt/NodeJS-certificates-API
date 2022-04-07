/* istanbul ignore file */

import dotenv from 'dotenv';
dotenv.config();

/**
 * Este é apenas um wrapper no arquivo .env para que não seja necessário
 * utilizar process.env.DATABASE por exemplo. Isso facilita obter
 * uma referência direta à contante.
 */
const { DATABASE, PORT, API_SECURITY_KEY } = process.env;

export { DATABASE, PORT, API_SECURITY_KEY };
