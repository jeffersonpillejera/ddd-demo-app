export interface IPresenter<E, D> {
  toDTO(domain: E): D;
  notFound(message?: string): void;
  unauthorized(message?: string): void;
  forbidden(message?: string): void;
  badRequest(message?: string): void;
  unprocessable(message?: string): void;
}
