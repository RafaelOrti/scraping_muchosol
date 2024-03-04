export class HttpException extends Error {
  private _status: number;
  private _message: string;

  constructor(status: number, message: string) {
    super(message);
    this._status = status;
    this._message = message;
  }

  public get status(): number {
    return this._status;
  }

  public get message(): string {
    return this._message;
  }
}
