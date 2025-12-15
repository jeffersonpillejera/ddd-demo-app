import { RegisterUserHandler } from '../../application/commands/register-user/register-user.handler';
import { ApplicationProxyModule } from '../application-proxy.module';
import { ApiController } from './dtos/common.dto';
import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
import { ApiRegisterUser, RegisterUserDTO } from './dtos/customer.dto';
import type { Request } from 'express';

@ApiController('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(ApplicationProxyModule.REGISTER_USER_COMMAND)
    private readonly registerUserHandler: RegisterUserHandler,
  ) {}

  @Post('register')
  @ApiRegisterUser()
  async registerUser(
    @Body() registerUserDTO: RegisterUserDTO,
    @Req() request: Request,
  ) {
    return this.registerUserHandler.execute({
      ...registerUserDTO,
      lastIpAddress: request.ip!,
    });
  }
}
