import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export class ErrorHandler {
  private static DUPLICATE_KEY_ERROR_CODE = 11000; // E11000 duplicate key error collection

  static handleException = (error: any) => {
    const { code, keyValue, errorResponse } = error;

    if (code === ErrorHandler.DUPLICATE_KEY_ERROR_CODE) {
      throw new BadRequestException(
        `Record exists in db: ${JSON.stringify(keyValue)}`,
      );
    }
    throw new InternalServerErrorException(errorResponse.errmsg);
  };
}
