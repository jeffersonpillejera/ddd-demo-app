import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig, DatabaseConfig, ServerConfig } from './env.interface';

@Injectable()
export class EnvConfigService implements EnvConfig {
  readonly database: DatabaseConfig;
  readonly server: ServerConfig;

  constructor(private readonly configService: ConfigService) {
    this.database = { url: configService.get<string>('DATABASE_URL')! };

    this.server = {
      nodeEnv: configService.get<string>('NODE_ENV'),
      port: configService.get<number>('PORT'),
      allowedOrigins:
        configService.get<string>('ALLOWED_ORIGINS')?.split(',') ?? [],
    };
  }
}
