import winston from 'winston';
import { isDev } from './environment';

export const logger = winston.createLogger({
  level: isDev() ? 'debug' : 'info',
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
});
