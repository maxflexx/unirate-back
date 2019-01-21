import {HttpException} from '@nestjs/common';

export class HttpCodeException extends HttpException {
  constructor(private readonly errorCode: number,
              private readonly error: string,
              private readonly errorDescription: string) {
    super('', errorCode);
  }

  getResponse(): string | object {
    return {
      error: this.error,
      error_description: this.errorDescription,
    };
  }

  getError(): string {
    return this.error;
  }

  getDescription(): string {
    return this.errorDescription;
  }

  sendResponse(res) {
    res.status(this.getStatus()).send(this.getResponse());
  }
}