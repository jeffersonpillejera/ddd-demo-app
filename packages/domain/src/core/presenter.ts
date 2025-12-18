export interface Presenter<E, D> {
  toDTO(domain: E): D;
}
