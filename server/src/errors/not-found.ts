import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  status_code = 404;

  constructor(message: string) {
    super(message);

    // * Only because we are extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serialize_error() {
    return { message: this.message };
  }
}
