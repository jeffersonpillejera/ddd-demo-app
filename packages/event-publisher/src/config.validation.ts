import { plainToClass } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { validateSync } from 'class-validator';

class EventPublisherEnvVariables {
  @IsString()
  @IsNotEmpty()
  EVENT_PUBLISHER_HOST!: string;

  @IsNumber()
  @IsNotEmpty()
  EVENT_PUBLISHER_PORT!: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EventPublisherEnvVariables, config, {
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
