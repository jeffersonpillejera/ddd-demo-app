import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EnvConfig,
  DatabaseConfig,
  ServerConfig,
  RedisConfig,
} from './env.interface';

@Injectable()
export class EnvConfigService implements EnvConfig {
  readonly database: DatabaseConfig;
  readonly server: ServerConfig;
  readonly redis: RedisConfig;

  constructor(private readonly configService: ConfigService) {
    this.database = { url: configService.get<string>('DATABASE_URL')! };

    this.server = {
      nodeEnv: configService.get<string>('NODE_ENV'),
      port: configService.get<number>('PORT'),
      allowedOrigins:
        configService.get<string>('ALLOWED_ORIGINS')?.split(',') ?? [],
    };

    this.redis = {
      host: configService.get<string>('REDIS_HOST')!,
      port: configService.get<number>('REDIS_PORT')!,
    };
  }
}
