import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
  status_code = 401;

  constructor() {
    super(`Anda perlu login ulang atau sesi Anda telah berakhir...`);

    // * Only because we are extending a built in class
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serialize_error() {
    return { message: this.message };
  }
}
