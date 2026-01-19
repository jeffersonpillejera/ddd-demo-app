import { EventPublisherConfig } from './event-publisher-env.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventPublisherEnvService {
  readonly eventPublisher: EventPublisherConfig;

  constructor(private readonly configService: ConfigService) {
    this.eventPublisher = {
      host: configService.get<string>('EVENT_PUBLISHER_HOST')!,
      port: configService.get<number>('EVENT_PUBLISHER_PORT')!,
    };
  }
}
