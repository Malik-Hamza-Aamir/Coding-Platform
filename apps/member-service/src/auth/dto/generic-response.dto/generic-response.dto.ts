export class GenericResponseDto<T = any> {
  status: boolean;
  message: string;
  data?: T | null;

  constructor(status: boolean, message: string, data?: T | null) {
    this.status = status;
    this.message = message;
    this.data = data ?? null;
  }
}
