import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { EnvConfigService } from './infrastructure/config/env.service';
import {
  GlobalExceptionFilter,
  PrismaClientExceptionFilter,
} from '@ecore/exception-filters';
import { LoggerService } from '@ecore/logger/logger.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true,
    bufferLogs: true,
  });

  app.useLogger(
    new LoggerService({
      logLevels: ['error', 'warn', 'log'],
      prefix: 'OrderService',
    }),
  );

  const envConfigService = app.get<EnvConfigService>(EnvConfigService);

  app.enableCors({
    origin: (
      origin: string,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      const allowedOrigins = envConfigService.server.allowedOrigins;
      if (
        !origin ||
        allowedOrigins?.some((allowedOrigin) => origin.endsWith(allowedOrigin))
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Ecommerce Core API')
    .setDescription('Ecommerce Core API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(
    new GlobalExceptionFilter(app.get(HttpAdapterHost)),
    new PrismaClientExceptionFilter(),
  );

  app.enableShutdownHooks();
  const port = envConfigService.server.port ?? 3001;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: { ...envConfigService.eventBus },
  });
  await app.startAllMicroservices();
  await app.listen(port);
  process.exitCode = 1;
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(process.exitCode);
});
