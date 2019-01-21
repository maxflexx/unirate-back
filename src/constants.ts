/* Environment-dependent variables: begin */

const ormConfig = require('../ormconfig.json');
export const ORM_CONFIG_MEMORY = ormConfig.MEMORY_DB;

export const LISTEN_PORT = 3000;

export const ORM_CONFIG = ORM_CONFIG_MEMORY;

export const JWT_SECRET = 'yu3egwfhjwhr9823q';

