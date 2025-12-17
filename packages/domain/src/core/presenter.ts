export interface IPresenter<E, D> {
  toDTO(domain: E): D;
}
