import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from './prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { EnvConfigService } from '../config/env.service';

@Injectable()
export class ProjectionStoreService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly envConfigService: EnvConfigService) {
    const adapter = new PrismaPg({
      connectionString: envConfigService.database.projectionStoreUrl,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
