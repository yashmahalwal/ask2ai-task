import { isDev } from '../utils/environment';
import { logger } from '../utils/logger';
import { sequelize } from './config';

export async function initialiseStorage() {
  try {
    await sequelize.authenticate();
    logger.debug('Connection has been established successfully.');
    await sequelize.sync({ force: isDev() });
    logger.info('Storage initialised successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
  }
}
