import { Module } from '@nestjs/common';
import { EnvConfigModule } from './config/env.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvConfigService } from './config/env.service';
import { SubscribersModule } from './subscribers/subscribers.module';
import { ControllersModule } from './controllers/controller.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    EnvConfigModule,
    MongooseModule.forRootAsync({
      imports: [EnvConfigModule],
      useFactory: (envConfigService: EnvConfigService) => ({
        uri: envConfigService.database.eventStoreUrl,
      }),
      inject: [EnvConfigService],
    }),
    CqrsModule.forRoot(),
    SubscribersModule,
    ControllersModule,
  ],
})
export class AppModule {}
