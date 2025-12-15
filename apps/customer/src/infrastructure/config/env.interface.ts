export interface DatabaseConfig {
  url: string;
}

export interface ServerConfig {
  nodeEnv?: string;
  port?: number;
  allowedOrigins?: string[];
}

export interface EnvConfig {
  database: DatabaseConfig;
  server: ServerConfig;
}
