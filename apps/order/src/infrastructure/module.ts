import { Module } from '@nestjs/common';
import { EnvConfigModule } from './config/env.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvConfigService } from './config/env.service';
import { SubscribersModule } from './subscribers/subscribers.module';
import { ControllersModule } from './controllers/controller.module';

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
    SubscribersModule,
    ControllersModule,
  ],
})
export class AppModule {}
