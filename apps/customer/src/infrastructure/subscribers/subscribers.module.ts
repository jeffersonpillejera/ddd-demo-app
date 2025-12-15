import { Module } from '@nestjs/common';
import { UserRegisteredHandler } from './user-registered.handler';

@Module({ imports: [], providers: [UserRegisteredHandler] })
export class SubscribersModule {}
