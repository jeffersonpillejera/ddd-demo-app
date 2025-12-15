export type ValueObjectProps = Record<string, any>;

export abstract class ValueObject<T extends ValueObjectProps> {
  public readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public isEqualTo(valueObject?: ValueObject<T>): boolean {
    if (!valueObject?.props) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(valueObject.props);
  }
}
