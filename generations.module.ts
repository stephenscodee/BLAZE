import { Module } from '@nestjs/common';
import { GenerationsService } from './generations.service';
import { GenerationsController } from './generations.controller';
import { GenerationsGateway } from './generations.gateway';
import Redis from 'ioredis';

@Module({
  providers: [
    GenerationsService, 
    GenerationsGateway,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        });
      },
    },
  ],
  controllers: [GenerationsController],
  exports: [GenerationsService],
})
export class GenerationsModule {}
