import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

const defaultLogger = new Logger('ErrorHandler');
const POSTGRESQL_UNIQUE_VIOLATION_ERROR = '23505';

export const handleDBException = (
  error: any,
  logger: Logger = defaultLogger,
): never => {
  const { code, detail } = error;

  if (code === POSTGRESQL_UNIQUE_VIOLATION_ERROR)
    throw new BadRequestException(detail);

  logger.error(error, { ...error }); // print error as log & error object detailed
  throw new InternalServerErrorException(
    'Unexpected error, check server logs.',
  );
};
