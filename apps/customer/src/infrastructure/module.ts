import { Module } from '@nestjs/common';
import { EnvConfigModule } from './config/env.module';
import { ControllersModule } from './controllers/customer.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { PersistenceModule } from './persistence/persistence.module';

@Module({
  imports: [
    EnvConfigModule,
    ControllersModule,
    SubscribersModule,
    PersistenceModule,
  ],
})
export class AppModule {}
