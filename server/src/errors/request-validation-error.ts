import { FieldValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  status_code = 400;

  constructor(public errors: FieldValidationError[]) {
    super('Invalid request parameters...');

    // * Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serialize_error() {
    return { message: this.errors[0].msg };
  }
}
