export class UniqueIdentifier {
  constructor(private id?: string | number) {
    this.id = id ?? crypto.randomUUID();
  }

  equals(id: UniqueIdentifier): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    return id.toValue() === this.id;
  }

  toString() {
    return String(this.id);
  }

  toValue(): string | number {
    return this.id!;
  }
}
