import { CustomError } from './custom-error';

class EnvMissingError extends CustomError {
  status_code = 500;

  constructor(missing_env: string) {
    super(`Env Missing: ${missing_env}`);

    // * Only because we are extending a built in class
    Object.setPrototypeOf(this, EnvMissingError.prototype);
  }

  serialize_error() {
    return { message: this.message };
  }
}

export default EnvMissingError;
