export interface DatabaseConfig {
  projectionStoreUrl: string;
  eventStoreUrl: string;
}

export interface ServerConfig {
  nodeEnv?: string;
  port?: number;
  allowedOrigins?: string[];
}

export interface EventBusConfig {
  host: string;
  port: number;
}

export interface EnvConfig {
  database: DatabaseConfig;
  server: ServerConfig;
  eventBus: EventBusConfig;
}
