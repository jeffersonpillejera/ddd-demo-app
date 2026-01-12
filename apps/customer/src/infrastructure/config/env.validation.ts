import { plainToClass } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  validateSync,
  IsNumber,
  IsOptional,
} from 'class-validator';

class EnvVariables {
  @IsString()
  @IsOptional()
  NODE_ENV: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsNumber()
  @IsOptional()
  PORT: number;

  @IsString()
  @IsOptional()
  ALLOWED_ORIGINS: string;

  @IsString()
  @IsNotEmpty()
  EVENT_BUS_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  EVENT_BUS_PORT: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
