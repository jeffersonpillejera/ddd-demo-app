import { Event } from './event';

export interface ProjectionRebuilder {
  rebuild(event: Event): Promise<void> | void;
  rebuildAll(): Promise<void> | void;
}
