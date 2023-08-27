import { CustomError } from './custom-error';

export class ForbiddenError extends CustomError {
  status_code = 403;

  constructor() {
    super(`Anda tidak memiliki wewenang untuk melakukan ini...`);

    // * Only because we are extending a built in class
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serialize_error() {
    return { message: this.message };
  }
}
