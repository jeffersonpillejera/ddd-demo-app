import { Module, Global } from '@nestjs/common';
import { PersistenceService } from './persistence.service';
import { EnvConfigModule } from '../config/env.module';

@Global()
@Module({
  imports: [EnvConfigModule],
  providers: [PersistenceService],
  exports: [PersistenceService],
})
export class PersistenceModule {}
