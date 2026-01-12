import { DynamicModule, Module, Type } from '@nestjs/common';
import { EventBusService } from './event-bus.service';
import { CqrsModule } from '@nestjs/cqrs';
import {
  ClientsModule,
  ClientsProviderAsyncOptions,
} from '@nestjs/microservices';

export const MESSAGE_BROKER_CLIENT_NAME = 'MESSAGE_BROKER';
export const EVENT_PRESENTER_TOKEN = 'EVENT_PRESENTER';

export interface EventBusModuleConfig {
  clientProviderOptions: ClientsProviderAsyncOptions;
  presenterModule: Type<any> | DynamicModule;
}

@Module({
  imports: [CqrsModule],
  providers: [EventBusService],
  exports: [EventBusService],
})
export class EventBusModule {
  static register(config: EventBusModuleConfig): DynamicModule {
    const { clientProviderOptions, presenterModule } = config;
    return {
      module: EventBusModule,
      imports: [
        CqrsModule,
        ClientsModule.registerAsync([
          { ...clientProviderOptions, name: MESSAGE_BROKER_CLIENT_NAME },
        ]),
        presenterModule,
      ],
      providers: [EventBusService],
      exports: [EventBusService],
    };
  }
}
