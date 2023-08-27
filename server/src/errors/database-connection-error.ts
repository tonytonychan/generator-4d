import { CustomError } from './custom-error';

class DatabaseConnectionError extends CustomError {
  status_code = 500;
  reason = 'Error connecting to database.';

  constructor() {
    super('Error connecting to database.');

    // * Only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serialize_error() {
    return { message: this.reason };
  }
}

export default DatabaseConnectionError;
