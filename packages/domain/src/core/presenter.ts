export interface IPresenter<E, D> {
  toDTO(domain: E): D;
  notFound(id?: string): void;
  unauthorized(): void;
  forbidden(): void;
  badRequest(error: Error): void;
  internalServerError(error: Error): void;
  unprocessable(error: Error): void;
}
