import { DomainEvent } from '../domain-event';

export interface ProjectionRebuilder {
  rebuild(event: DomainEvent): Promise<void> | void;
  rebuildAll(): Promise<void> | void;
}
