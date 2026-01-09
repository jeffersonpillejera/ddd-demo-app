import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig, DatabaseConfig, ServerConfig } from './env.interface';

@Injectable()
export class EnvConfigService implements EnvConfig {
  readonly database: DatabaseConfig;
  readonly server: ServerConfig;

  constructor(private readonly configService: ConfigService) {
    this.database = {
      projectionStoreUrl: configService.get<string>(
        'DATABASE_PROJECTION_STORE_URL',
      )!,
      eventStoreUrl: configService.get<string>('DATABASE_EVENT_STORE_URL')!,
    };

    this.server = {
      nodeEnv: configService.get<string>('NODE_ENV'),
      port: configService.get<number>('PORT'),
      allowedOrigins:
        configService.get<string>('ALLOWED_ORIGINS')?.split(',') ?? [],
    };
  }
}
