export abstract class Event {
  public id: string = crypto.randomUUID();
  public occurredAt: Date = new Date();
  public type: string = this.constructor.name;
  public version: number;
  public correlationId?: string;
  public causationId?: string;
}
