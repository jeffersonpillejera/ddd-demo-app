import { Module } from '@nestjs/common';
import { SequenceGenerator } from './sequence-generator';
import { SEQUENCE_GENERATOR_TOKEN } from '@ecore/core/sequence-generator';

@Module({
  providers: [
    SequenceGenerator,
    { provide: SEQUENCE_GENERATOR_TOKEN, useExisting: SequenceGenerator },
  ],
  exports: [SequenceGenerator, SEQUENCE_GENERATOR_TOKEN],
})
export class UtilsModule {}
