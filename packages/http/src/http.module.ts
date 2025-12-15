import { Module } from '@nestjs/common';
import { HttpModule as BaseHttpModule } from '@nestjs/axios';
import { Agent } from 'https';

/**
 * Using this HttpModule solves the timeout or slow response issue in Azure App Service
 * due to limited pre-allocated SNAT ports that are quickly exhausted. By implementing
 * Keep-alive agent, we can use connection pools in axios.
 *
 * Reference:
 * > https://docs.microsoft.com/en-us/azure/app-service/troubleshoot-intermittent-outbound-connection-errors
 */
@Module({
  imports: [
    BaseHttpModule.register({
      httpsAgent: new Agent({ keepAlive: true }),
      timeout: 5 * 60 * 1000, // 5 minutes
    }),
  ],
  exports: [BaseHttpModule],
})
export class HttpModule {}
