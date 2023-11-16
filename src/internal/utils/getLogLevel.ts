import { LogLevel } from '@nestjs/common';

export const getLogLevel = (isProduction: boolean): LogLevel[] => {
  if (isProduction) {
    return ['warn', 'error'];
  }
  return ['error', 'warn', 'log', 'verbose', 'debug'];
};
