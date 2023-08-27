export abstract class CustomError extends Error {
  abstract status_code: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serialize_error(): { message: string };
}
