import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Generation, GenerationStatus, AssetType } from '@prisma/client';
import { GenerationsGateway } from './generations.gateway';
import Redis from 'ioredis';

@Injectable()
export class GenerationsService {
  constructor(
    private prisma: PrismaService,
    @Inject('REDIS_CLIENT') private redis: Redis,
    private gateway: GenerationsGateway,
  ) {}

  async create(data: {
    prompt: string;
    stylePreset?: string;
    projectId: string;
    userId: string;
  }): Promise<Generation> {
    const project = await this.prisma.project.findFirst({
      where: { id: data.projectId, userId: data.userId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const generation = await this.prisma.generation.create({
      data: {
        prompt: data.prompt,
        stylePreset: data.stylePreset || 'REALISTIC',
        projectId: data.projectId,
        status: GenerationStatus.PENDING,
      },
    });

    // Push to simple Redis list
    const task = {
      id: generation.id,
      prompt: data.prompt,
      style: data.stylePreset || 'REALISTIC',
    };
    
    await this.redis.lpush('blaze_image_tasks', JSON.stringify(task));

    return generation;
  }

  async updateStatus(
    id: string,
    data: { status: GenerationStatus; assets?: any[]; errorMessage?: string },
  ) {
    const generation = await this.prisma.generation.update({
      where: { id },
      data: {
        status: data.status,
        errorMessage: data.errorMessage,
        assets: data.assets ? {
          create: data.assets.map(asset => ({
            s3Key: asset.s3Key,
            width: asset.width,
            height: asset.height,
            versionType: asset.versionType || AssetType.ORIGINAL,
          })),
        } : undefined,
      },
      include: { project: true, assets: true },
    });

    this.gateway.sendUpdate(generation.project.userId, {
      generationId: id,
      status: generation.status,
      assets: generation.assets,
    });

    return generation;
  }

  async findOne(id: string) {
    return this.prisma.generation.findUnique({
      where: { id },
      include: { assets: true },
    });
  }
}
