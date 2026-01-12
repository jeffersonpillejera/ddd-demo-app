import { Module } from '@nestjs/common';
import { SequenceGenerator } from './sequence-generator';

@Module({ providers: [SequenceGenerator], exports: [SequenceGenerator] })
export class UtilsModule {}
