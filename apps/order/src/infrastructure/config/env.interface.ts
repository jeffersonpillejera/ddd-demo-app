export interface DatabaseConfig {
  projectionStoreUrl: string;
  eventStoreUrl: string;
}

export interface ServerConfig {
  nodeEnv?: string;
  port?: number;
  allowedOrigins?: string[];
}

export interface RedisConfig {
  host: string;
  port: number;
}

export interface EnvConfig {
  database: DatabaseConfig;
  server: ServerConfig;
  redis: RedisConfig;
}
