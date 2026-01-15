import { Module } from '@nestjs/common';
import { EnvConfigModule } from './config/env.module';
import { ControllersModule } from './controllers/customer.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { PersistenceModule } from './persistence/persistence.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule.forRoot(),
    EnvConfigModule,
    ControllersModule,
    SubscribersModule,
    PersistenceModule,
  ],
})
export class AppModule {}
